import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })
import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { personaPrompts, PERSONA_KEYS } from './personas.js'

const app = express()
const PORT = process.env.PORT || 8787

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/chat', async (req, res) => {
  try {
    const { persona, messages } = req.body || {}

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error:
          'Server is missing GEMINI_API_KEY. Add it to your .env file and restart.',
      })
    }

    if (!persona || !personaPrompts[persona]) {
      return res.status(400).json({
        error: `Invalid persona. Use one of: ${Object.values(PERSONA_KEYS).join(', ')}`,
      })
    }

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages must be an array.' })
    }

    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = client.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
      systemInstruction: personaPrompts[persona],
    })

    const contents = messages
      .filter(
        (msg) =>
          msg &&
          (msg.role === 'user' || msg.role === 'assistant') &&
          typeof msg.content === 'string' &&
          msg.content.trim().length > 0,
      )
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }))

    const result = await model.generateContent({
      contents,
      generationConfig: {
        temperature: 0.7,
      },
    })

    const reply = result.response.text()?.trim()

    if (!reply) {
      return res.status(502).json({
        error: 'Model returned an empty response. Please try again.',
      })
    }

    return res.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)

    const status = typeof error?.status === 'number' ? error.status : 500
    const message = String(error?.message || '')
    const causeCode = String(error?.cause?.code || '')

    if (status === 429) {
      return res.status(429).json({
        error:
          'Gemini quota/rate limit reached for this model. Switch to gemini-flash-latest or enable billing in your Gemini project.',
      })
    }

    if (status === 400 && message.toLowerCase().includes('api key')) {
      return res.status(401).json({
        error:
          'Invalid Gemini API key. Update GEMINI_API_KEY in .env and restart the server.',
      })
    }

    if (status === 404 && message.toLowerCase().includes('models/')) {
      return res.status(400).json({
        error:
          'Selected Gemini model is unavailable for this key. Try GEMINI_MODEL=gemini-flash-latest.',
      })
    }

    if (
      message.toLowerCase().includes('fetch failed') ||
      causeCode === 'ENOTFOUND' ||
      causeCode === 'ECONNRESET' ||
      causeCode === 'ETIMEDOUT'
    ) {
      return res.status(503).json({
        error:
          'Could not reach Gemini API. Check internet/VPN/firewall and try again.',
      })
    }

    if (message) {
      return res.status(500).json({
        error: `Gemini API error: ${message}`,
      })
    }

    return res.status(500).json({
      error: `Something went wrong while contacting the AI service. Error details: ${String(error?.message || error || 'Unknown error')}. Please try again in a moment.`,
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
