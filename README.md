# Persona-Based AI Chatbot (Scaler Assignment 01)

A working persona chatbot that supports three personalities:

- Anshuman Singh
- Abhimanyu Saxena
- Kshitij Mishra

The app includes persona switching, per-persona quick-start chips, typing indicator, API error handling, and mobile-responsive UI.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- LLM API: Google Gemini API

## Project Structure

- `frontend/src/` - React frontend
- `backend/index.js` - Backend API (`/api/chat`)
- `backend/personas.js` - Persona prompts and metadata
- `prompts.md` - Annotated prompt document
- `reflection.md` - Assignment reflection (300-500 words)
- `.env.example` - Environment template

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from example:

   ```bash
   cp .env.example .env
   ```

3. Add your Gemini key in `.env`:

   ```env
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-1.5-flash
   PORT=8787
   ```

4. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

5. In a new terminal, start the frontend:

   ```bash
   cd frontend
   npm run dev
   ```

6. Open the local app URL shown by Vite (typically `http://localhost:5173`).

## Prompt Authoring Workflow

1. Finalize all three researched system prompts in `prompts.md`.
2. Copy each final prompt into the matching entry inside `backend/personas.js`.
3. Keep at least 3 few-shot examples, CoT internal reasoning instruction, output format rules, and constraints in each prompt.

## Deployment

You can deploy to platforms like Vercel/Render/Railway.  
Ensure both frontend and backend are configured in production and the API key is set as an environment variable in the deployment settings.

## Submission Checklist

- Public GitHub repo link
- Live deployed URL
- `README.md` with setup + deployed link
- `prompts.md` with all annotated prompts
- `reflection.md` (300-500 words)
- `.env.example` present and no real API keys committed

## Screenshots

Add screenshots in a folder like `screenshots/` and reference them here before submission.
