# Reflection (300-500 words)

This assignment highlighted how strongly prompt quality influences model behavior. The biggest thing that worked was grounding each system prompt in persona-specific details: communication tone, recurring beliefs, preferred response structure, and boundaries. Once those were explicit, the same model produced noticeably different answers for each persona without any additional model tuning.

The most practical takeaway from GIGO (Garbage In, Garbage Out) was that vague prompts produce generic outputs, even when the UI is polished. Early drafts with minimal persona context sounded interchangeable. As soon as I introduced stronger identity constraints, realistic few-shot examples, and clear output instructions, response quality improved in both consistency and authenticity. Few-shot examples were especially impactful because they demonstrated not only "what to say" but also "how to say it" in that person’s style.

Another key learning was that product behavior and prompt behavior are tightly linked. Persona switching only feels correct when conversation state resets; otherwise context leakage can make one persona speak like another. Similarly, API error handling matters for user trust. If the app fails silently or crashes, it does not matter how good the prompts are. Building a robust backend contract and a clear frontend fallback message made the application feel reliable.

If I had more time, I would improve three areas. First, I would do deeper source-backed persona research and cite specific talks/posts per prompt section. Second, I would add lightweight evaluation checks (for example, style consistency scoring and constraint violation tests) to catch prompt regressions when prompts are edited. Third, I would add conversation persistence with persona-isolated histories so users can continue longer discussions while still avoiding cross-persona contamination.

Overall, the assignment reinforced that prompt engineering is not just writing instructions; it is system design. Good outputs come from clear persona definition, careful examples, strict boundaries, and thoughtful product implementation around the model call.
