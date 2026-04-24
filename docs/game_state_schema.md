# Game State Schema

## Turn Object
{
  "turn_number": 1,
  "player_decision": { "action": "deploy_carrier_group", "label": "Deploy USS Ronald Reagan to South China Sea", "category": "military" },
  "redcell_response": { "action": "escalate_blockade", "narrative": "China tightens the blockade...", "escalation_delta": 15 },
  "adjudicator_score": { "escalation_level": 65, "escalation_label": "High", "us_casualties": 0, "taiwan_casualties": 12, "conflict_probability": 0.42, "narrative_summary": "..." }
}

## Player Decision Options
- deploy_carrier_group (military)
- impose_sanctions (economic)
- airlift_supplies_taiwan (logistics)
- diplomatic_backchannel (diplomatic)
- cyber_operation (cyber)
- stand_down (deescalation)
