const BASE_URL = 'https://superagent-02ccfade.base44.app/functions';

export async function generateProposal({ prompt, client_name, project_type, budget, timeline }) {
  const res = await fetch(`${BASE_URL}/proposalGenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, client_name, project_type, budget, timeline }),
  });
  return res.json();
}

export async function generatePitchDeck({ business_name, industry, description, target_market, revenue_model, funding_amount }) {
  const res = await fetch(`${BASE_URL}/proposalGenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'pitch_deck', business_name, industry, description, target_market, revenue_model, funding_amount }),
  });
  return res.json();
}
