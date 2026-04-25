from flask import Flask, request, jsonify
from flask_cors import CORS
from game_loop import initialize_game_state, process_player_turn
import uuid

app = Flask(__name__)
CORS(app)
SESSIONS = {}

@app.route("/api/session/new", methods=["POST"])
def new_session():
    session_id = str(uuid.uuid4())
    session = initialize_game_state(session_id)
    SESSIONS[session_id] = session
    return jsonify(session)

@app.route("/api/turn", methods=["POST"])
def take_turn():
    data = request.get_json(silent=True) or {}
    player_decision = data.get("player_decision")
    session_id = data.get("session_id")
    provided_state = data.get("game_state")

    if not player_decision:
        return jsonify({"error": "player_decision is required"}), 400

    game_state = None
    if session_id and session_id in SESSIONS:
        game_state = SESSIONS[session_id]
    elif provided_state:
        game_state = provided_state
    else:
        fallback_session_id = session_id or str(uuid.uuid4())
        game_state = initialize_game_state(fallback_session_id)

    try:
        updated_state = process_player_turn(game_state, player_decision)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": f"turn processing failed: {exc}"}), 500

    SESSIONS[updated_state["session_id"]] = updated_state
    return jsonify(updated_state)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
