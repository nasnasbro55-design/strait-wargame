import anthropic
import json
import os

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

ADJUDICATOR_SYSTEM_PROMPT = """You are a geopolitical adjudicator analyzing a Taiwan Strait crisis wargame simulation.
Assess the current state of the crisis after each turn and return a structured JSON score.
Always return ONLY valid JSON, no preamble:
{
  "escalation_level": <integer 0-100>,
  "escalation_label": "<Low | Moderate | High | Critical | War>",
  "us_casualties": <integer>,
  "taiwan_casualties": <integer>,
  "china_casualties": <integer>,
  "international_reaction": "<1-2 sentence description>",
  "conflict_probability": <float 0.0-1.0>,
  "narrative_summary": "<2-3 sentence summary of where the crisis stands>"
}"""

def get_adjudicator_score(player_decision, redcell_response, turn_history):
    history_text = ""
    for i, turn in enumerate(turn_history):
        history_text += f"\nTurn {i+1}: US decided to {turn['player_decision']['label']}. China responded: {turn['redcell_response']['narrative']}"

    user_message = f"""Crisis history:{history_text}
Current turn:
- US decision: {player_decision['label']}
- China response: {redcell_response['narrative']}
Return adjudicator score as JSON."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=ADJUDICATOR_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}]
    )
    return json.loads(message.content[0].text.strip())
