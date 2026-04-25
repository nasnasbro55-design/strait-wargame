import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")

ADJUDICATOR_SYSTEM_PROMPT = """You are a geopolitical adjudicator analyzing a Taiwan Strait crisis wargame simulation.

Your job is to assess the current state of the crisis after each turn and return a structured JSON score.

You must consider:
- The cumulative history of decisions and escalations
- Real-world geopolitical dynamics between the US, China, Taiwan, Japan, and international actors
- Military, economic, diplomatic, and cyber dimensions of the conflict

Always return ONLY valid JSON in this exact format, no preamble:
{
  "escalation_level": <integer 0-100>,
  "escalation_label": "<Low | Moderate | High | Critical | War>",
  "us_casualties": <integer>,
  "taiwan_casualties": <integer>,
  "china_casualties": <integer>,
  "international_reaction": "<1-2 sentence description>",
  "conflict_probability": <float 0.0-1.0>,
  "narrative_summary": "<2-3 sentence summary>"
}"""


def _extract_json(content):
    if not content:
        raise ValueError("Adjudicator returned empty content")

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
        raise ValueError(f"Adjudicator response did not contain a JSON object: {raw}")

    return json.loads(raw[start : end + 1])


def _get_client():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set. Add it to your environment or .env file.")
    return Groq(api_key=api_key)


def get_adjudicator_score(player_decision, redcell_response, turn_history):
    history_text = ""
    for i, turn in enumerate(turn_history):
        history_text += f"\nTurn {i+1}: US decided to {turn['player_decision']['label']}. China responded: {turn['redcell_response']['narrative']}"

    user_message = f"""Crisis history so far:{history_text}

Current turn:
- US Commander decision: {player_decision['label']}
- China (Red Cell) response: {redcell_response['narrative']}

Assess the current state of the Taiwan Strait crisis and return your adjudicator score as JSON."""

    client = _get_client()
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        max_tokens=1000,
        messages=[
            {"role": "system", "content": ADJUDICATOR_SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ]
    )

    parsed = _extract_json(response.choices[0].message.content)
    return {
        "escalation_level": int(parsed.get("escalation_level", 0)),
        "escalation_label": parsed.get("escalation_label", "Low"),
        "us_casualties": int(parsed.get("us_casualties", 0)),
        "taiwan_casualties": int(parsed.get("taiwan_casualties", 0)),
        "china_casualties": int(parsed.get("china_casualties", 0)),
        "international_reaction": parsed.get("international_reaction", "International actors are monitoring events."),
        "conflict_probability": float(parsed.get("conflict_probability", 0.0)),
        "narrative_summary": parsed.get("narrative_summary", "The situation remains fluid."),
    }
