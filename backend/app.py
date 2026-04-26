import os
import uuid
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

from adjudicator import get_adjudicator_score
from game_loop import process_player_turn, initialize_game_state
from groq import Groq

load_dotenv()

app = Flask(__name__)
CORS(app)

try:
    from supabase import create_client
    supabase = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))
except:
    supabase = None

sessions = {}

@app.route("/api/session/new", methods=["POST"])
def new_session():
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "session_id": session_id,
        "created_at": datetime.utcnow().isoformat(),
        "status": "active",
        "current_turn": 0,
        "turns": []
    }
    return jsonify(sessions[session_id])

@app.route("/api/turn", methods=["POST"])
def take_turn():
    data = request.json
    session_id = data.get("session_id")
    player_decision = data.get("player_decision")
    turn_history = data.get("turn_history", [])

    if session_id not in sessions:
        sessions[session_id] = initialize_game_state(session_id)

    sessions[session_id] = process_player_turn(sessions[session_id], player_decision)

    if supabase:
        try:
            supabase.table("turns").insert({
                "session_id": session_id,
                "turn_number": turn["turn_number"],
                "player_decision": turn["player_decision"],
                "redcell_response": turn["redcell_response"],
                "adjudicator_score": turn["adjudicator_score"],
                "timestamp": turn["timestamp"]
            }).execute()
        except:
            pass

    return jsonify(sessions[session_id])

@app.route("/api/session/<session_id>/replay", methods=["GET"])
def get_replay(session_id):
    if session_id in sessions:
        return jsonify(sessions[session_id])
    return jsonify({"session_id": session_id, "turns": []})

@app.route("/api/aar", methods=["POST"])
def after_action_review():
    data = request.json
    turn_history = data.get("turn_history", [])
    final_escalation = data.get("final_escalation", 0)

    history_text = ""
    for turn in turn_history:
        history_text += f"\nTurn {turn['turn_number']}: US decided to {turn['player_decision']['label']}. China responded: {turn['redcell_response']['narrative']}. Escalation reached {turn['adjudicator_score']['escalation_level']}/100."

    prompt = f"""You are a senior national security analyst writing a classified after-action review of a Taiwan Strait crisis wargame simulation.

The simulation had {len(turn_history)} turns. Final escalation level: {final_escalation}/100.

Turn history:
{history_text}

Write a 3-4 paragraph after-action review that:
1. Assesses the overall strategic performance of the US commander
2. Identifies the 1-2 key decision points that most shaped the outcome
3. Evaluates whether the crisis was handled according to sound doctrine
4. Provides a final verdict on whether the crisis was contained or escalated unnecessarily

Write in the style of a real classified government after-action report. Be direct and analytical. No preamble."""

    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )
    aar_text = response.choices[0].message.content.strip()
    return jsonify({"aar_text": aar_text})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
