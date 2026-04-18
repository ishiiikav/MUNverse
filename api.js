// ─── CLAUDE API HELPER ────────────────────────────────────────────────────────
// Calls the Anthropic Claude API directly from the browser.
// The API key is handled by the Anthropic proxy in this environment.
// For local development, add your key to a .env file:
//   VITE_ANTHROPIC_API_KEY=sk-ant-...
// and update the headers below accordingly.

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL   = 'claude-sonnet-4-20250514';

/**
 * Send a prompt to Claude and return the text response.
 *
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} [system] - Optional system prompt
 * @returns {Promise<string>}
 */
export async function callClaude(messages, system = 'You are an expert MUN simulation AI.') {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.content?.map((block) => block.text || '').join('\n') || '';
}
