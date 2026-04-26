from groq import Groq
import json
import os

from dotenv import load_dotenv; load_dotenv(); client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

ADJUDICATOR_SYSTEM_PROMPT = """You are a geopolitical adjudicator analyzing a Taiwan Strait crisis wargame simulation.

Your job is to assess the current state of the crisis after each turn and return a structured JSON score.

Always return ONLY valid JSON in this exact format, no preamble, no markdown, no code fences:
{"escalation_level": <integer 0-100>, "escalation_label": "<Low|Moderate|High|Critical|War>", "us_casualties": <integer>, "taiwan_casualties": <integer>, "china_casualties": <integer>, "international_reaction": "<1-2 sentence description>", "conflict_probability": <float 0.0-1.0>, "narrative_summary": "<2-3 sentence summary>"}"""

def get_adjudicator_score(player_decision, redcell_response, turn_history):
    history_text = ""
    for i, turn in enumerate(turn_history):
        history_text += f"\nTurn {i+1}: US decided to {turn['player_decision']['label']}. China responded: {turn['redcell_response']['narrative']}"

    user_message = f"""Crisis history so far:{history_text}

Current turn:
- US Commander decision: {player_decision['label']}
- China (Red Cell) response: {redcell_response['narrative']}

Return adjudicator score as JSON only. No markdown. No code fences. Just the JSON object."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=1000,
        messages=[
            {"role": "system", "content": ADJUDICATOR_SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ]
    )

    raw = response.choices[0].message.content.strip()

    raw = raw.replace("```json", "").replace("```", "").strip()

    start = raw.find('{')
    end = raw.rfind('}')
    if start != -1 and end != -1:
        raw = raw[start:end+1]

    return json.loads(raw)
