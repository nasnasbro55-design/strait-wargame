from datetime import datetime

def process_turn(player_decision, redcell_response, adjudicator_score, turn_number):
    return {
        "turn_number": turn_number,
        "timestamp": datetime.utcnow().isoformat(),
        "player_decision": player_decision,
        "redcell_response": redcell_response,
        "adjudicator_score": adjudicator_score
    }
