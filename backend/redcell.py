import anthropic
import json
import os

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

REDCELL_SYSTEM_PROMPT = """You are the Red Cell — you play China in a Taiwan Strait crisis wargame.
Your objective is to reunify Taiwan while avoiding full-scale war with the US if possible.
Always return ONLY valid JSON, no preamble:
{
  "action": "<short_action_code>",
  "narrative": "<2-3 sentences of China's response>",
  "escalation_delta": <integer -20 to +25>
}"""

def get_redcell_response(player_decision, turn_history):
    history_text = ""
    for i, turn in enumerate(turn_history):
        history_text += f"\nTurn {i+1}: US: {turn['player_decision']['label']}. China: {turn['redcell_response']['narrative']}"

    user_message = f"""Crisis history:{history_text}
US Commander just decided: {player_decision['label']}
As China, what is your strategic response? Return JSON only."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=REDCELL_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}]
    )
    return json.loads(message.content[0].text.strip())
