from datetime import datetime
from redcell import get_redcell_response
from adjudicator import get_adjudicator_score


def initialize_game_state(session_id):
    return {
        "session_id": session_id,
        "created_at": datetime.utcnow().isoformat(),
        "status": "active",
        "current_turn": 0,
        "turns": [],
    }


def process_player_turn(game_state, player_decision):
    if not player_decision:
        raise ValueError("player_decision is required")

    turn_history = game_state.get("turns", [])
    redcell_response = get_redcell_response(
        {
            "turns": turn_history,
            "player_decision": player_decision,
        }
    )
    adjudicator_score = get_adjudicator_score(player_decision, redcell_response, turn_history)

    turn_number = len(turn_history) + 1
    turn = {
        "turn_number": turn_number,
        "timestamp": datetime.utcnow().isoformat(),
        "player_decision": player_decision,
        "redcell_response": redcell_response,
        "adjudicator_score": adjudicator_score,
    }

    updated_state = {
        **game_state,
        "current_turn": turn_number,
        "turns": [*turn_history, turn],
    }
    return updated_state
