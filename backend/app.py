from flask import Flask, request, jsonify
from flask_cors import CORS
from redcell import get_redcell_response
from adjudicator import get_adjudicator_score
from game_loop import process_turn
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

@app.route("/api/session/new", methods=["POST"])
def new_session():
    session_id = str(uuid.uuid4())
    session = {
        "session_id": session_id,
        "created_at": datetime.utcnow().isoformat(),
        "status": "active",
        "current_turn": 0,
        "turns": []
    }
    return jsonify(session)

@app.route("/api/turn", methods=["POST"])
def take_turn():
    data = request.json
    player_decision = data.get("player_decision")
    turn_history = data.get("turn_history", [])
    redcell_response = get_redcell_response(player_decision, turn_history)
    adjudicator_score = get_adjudicator_score(player_decision, redcell_response, turn_history)
    turn = process_turn(player_decision, redcell_response, adjudicator_score, len(turn_history) + 1)
    return jsonify(turn)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
