import os
import uuid
import json
from urllib import error, parse, request as urllib_request

from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client

from game_loop import initialize_game_state, process_player_turn

load_dotenv()

app = Flask(__name__)
CORS(app)
SESSIONS = {}
SUPABASE_TABLE = "turns"
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_KEY")
SUPABASE = None

if SUPABASE_URL and SUPABASE_ANON_KEY:
    try:
        SUPABASE = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    except Exception:
        SUPABASE = None


def _supabase_rest_request(method, table, query_params=None, body=None):
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        raise ValueError("Supabase is not configured")

    query_string = ""
    if query_params:
        query_string = "?" + parse.urlencode(query_params, doseq=True)

    endpoint = f"{SUPABASE_URL}/rest/v1/{table}{query_string}"
    payload = None
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
    }
    if body is not None:
        payload = json.dumps(body).encode("utf-8")

    req = urllib_request.Request(endpoint, data=payload, headers=headers, method=method)
    with urllib_request.urlopen(req) as response:
        raw = response.read().decode("utf-8")
        if not raw.strip():
            return []
        return json.loads(raw)


def _save_turn_to_supabase(session_id, turn):
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return

    payload = {
        "session_id": session_id,
        "turn_number": turn.get("turn_number"),
        "timestamp": turn.get("timestamp"),
        "player_decision": turn.get("player_decision"),
        "redcell_response": turn.get("redcell_response"),
        "adjudicator_score": turn.get("adjudicator_score"),
    }
    if SUPABASE is not None:
        SUPABASE.table(SUPABASE_TABLE).insert(payload).execute()
        return

    _supabase_rest_request(
        "POST",
        SUPABASE_TABLE,
        query_params={"select": "session_id"},
        body=payload,
    )


def _get_replay_turns(session_id=None):
    if SUPABASE is not None:
        query = (
            SUPABASE.table(SUPABASE_TABLE)
            .select(
                "session_id,turn_number,timestamp,player_decision,redcell_response,adjudicator_score"
            )
            .order("timestamp")
            .order("turn_number")
        )
        if session_id:
            query = query.eq("session_id", session_id)

        response = query.execute()
        return response.data or []

    if SUPABASE_URL and SUPABASE_ANON_KEY:
        params = {
            "select": "session_id,turn_number,timestamp,player_decision,redcell_response,adjudicator_score",
            "order": ["timestamp.asc", "turn_number.asc"],
        }
        if session_id:
            params["session_id"] = f"eq.{session_id}"

        try:
            return _supabase_rest_request("GET", SUPABASE_TABLE, query_params=params)
        except error.HTTPError as exc:
            raise ValueError(exc.read().decode("utf-8")) from exc

    if session_id:
        session = SESSIONS.get(session_id)
        if not session:
            return []
        return [
            {
                "session_id": session_id,
                **turn,
            }
            for turn in session.get("turns", [])
        ]

    turns = []
    for sid, session in SESSIONS.items():
        for turn in session.get("turns", []):
            turns.append({
                "session_id": sid,
                **turn,
            })

    turns.sort(key=lambda item: (item.get("timestamp", ""), item.get("turn_number", 0)))
    return turns

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

    latest_turn = updated_state.get("turns", [])[-1]
    try:
        _save_turn_to_supabase(updated_state["session_id"], latest_turn)
    except Exception as exc:
        return jsonify({"error": f"failed to save turn: {exc}"}), 500

    return jsonify(updated_state)


@app.route("/api/replay", methods=["GET"])
def replay_turns():
    session_id = request.args.get("session_id")

    try:
        turns = _get_replay_turns(session_id=session_id)
    except Exception as exc:
        return jsonify({"error": f"failed to fetch replay turns: {exc}"}), 500

    return jsonify({
        "session_id": session_id,
        "count": len(turns),
        "turns": turns,
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
