from groq import Groq
import json
import os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

REDCELL_SYSTEM_PROMPT = """You are the Red Cell — you play China (PRC) in a Taiwan Strait crisis wargame simulation.

Your objective is to reunify Taiwan with mainland China while avoiding a full-scale war with the United States if possible. You act in China's strategic interests:
- Maintaining face and projecting strength domestically
- Testing US resolve without triggering direct military conflict
- Isolating Taiwan diplomatically and economically
- Adapting your strategy based on US actions

Always return ONLY valid JSON in this exact format, no preamble, no markdown:
{"action": "<short_action_code>", "narrative": "<2-3 sentences of China's response>", "escalation_delta": <integer -20 to +25>}"""

def get_redcell_response(data, turn_history=None):
    if isinstance(data, dict) and 'turns' in data:
        turns = data.get('turns', [])
        actual_decision = data.get('player_decision', {})
    else:
        turns = turn_history if turn_history else []
        actual_decision = data

    history_text = ""
    for i, turn in enumerate(turns):
        history_text += f"\nTurn {i+1}: US decided to {turn['player_decision']['label']}. China responded: {turn['redcell_response']['narrative']}"

    label = actual_decision.get('label', '') if isinstance(actual_decision, dict) else str(actual_decision)

    user_message = f"""Crisis history so far:{history_text}

The US Commander has just decided to: {label}

As China, what is your strategic response? Return JSON only. No markdown."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=1000,
        messages=[
            {"role": "system", "content": REDCELL_SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ]
    )
    raw = response.choices[0].message.content.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    start = raw.find('{')
    end = raw.rfind('}')
    if start != -1 and end != -1:
        raw = raw[start:end+1]
    return json.loads(raw.strip())
