import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")

REDCELL_SYSTEM_PROMPT = """You are the Red Cell — you play China (PRC) in a Taiwan Strait crisis wargame simulation.

Your objective is to reunify Taiwan with mainland China while avoiding a full-scale war with the United States if possible. You act in China's strategic interests:
- Maintaining face and projecting strength domestically
- Testing US resolve without triggering direct military conflict
- Isolating Taiwan diplomatically and economically
- Adapting your strategy based on US actions

Always return ONLY valid JSON in this exact format, no preamble:
{
  "action": "<short_action_code>",
  "narrative": "<2-3 sentences of China's response>",
  "escalation_delta": <integer -20 to +25>
}"""


def _extract_json(content):
    if not content:
        raise ValueError("Red Cell returned empty content")

    raw = content.strip()
    if raw.startswith("```"):
        parts = raw.split("```")
        if len(parts) > 1:
            raw = parts[1].strip()
            if raw.startswith("json"):
                raw = raw[4:].strip()

    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError(f"Red Cell response did not contain a JSON object: {raw}")

    return json.loads(raw[start : end + 1])


def _get_client():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set. Add it to your environment or .env file.")
    return Groq(api_key=api_key)


def get_redcell_response(game_state):
    turn_history = game_state.get("turns", [])
    player_decision = game_state.get("player_decision")
    if not player_decision or "label" not in player_decision:
        raise ValueError("game_state.player_decision.label is required")

    history_text = ""
    for i, turn in enumerate(turn_history):
        history_text += f"\nTurn {i+1}: US decided to {turn['player_decision']['label']}. China responded: {turn['redcell_response']['narrative']}"

    user_message = f"""Crisis history so far:{history_text}

The US Commander has just decided to: {player_decision['label']}

As China, what is your strategic response? Return JSON only."""

    client = _get_client()
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        max_tokens=1000,
        messages=[
            {"role": "system", "content": REDCELL_SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ]
    )

    content = response.choices[0].message.content
    parsed = _extract_json(content)
    return {
        "action": parsed.get("action", "monitor_and_prepare"),
        "narrative": parsed.get("narrative", "China issues a calibrated response."),
        "escalation_delta": int(parsed.get("escalation_delta", 0)),
    }
