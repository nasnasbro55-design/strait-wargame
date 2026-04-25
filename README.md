# STRAIT 🌊
### AI-Powered Taiwan Strait Crisis Wargame Simulator
> Built for the SCSP National Security Hackathon 2026 — Wargaming Track

## What is STRAIT?
A turn-based wargame that puts you in the seat of the US commander during a Chinese naval blockade of Taiwan. Every decision triggers an adaptive AI Red Cell (China) that responds strategically, while an AI Adjudicator scores escalation, casualties, and conflict probability in real time.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, TailwindCSS |
| AI Agents | Groq llama-3.3-70b |
| Database | Supabase (Postgres) |
| Backend | Python / Flask |

## Local Backend Setup
1. Go to backend directory.
2. Create and activate a Python virtual environment.
3. Install dependencies.
4. Configure Groq API key.
5. Run Flask server.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
# edit .env and set GROQ_API_KEY
python app.py
```

Server starts on `http://localhost:5000`.

## API Flow
The backend game loop processes one turn as:
1. Receive `player_decision` and either `session_id` or full `game_state`
2. Call Red Cell (`llama-3.3-70b-versatile` on Groq) with current game state
3. Call adjudicator with the resulting Red Cell move
4. Return updated game state JSON

### Create Session
```bash
curl -X POST http://localhost:5000/api/session/new
```

### Process Turn
```bash
curl -X POST http://localhost:5000/api/turn \
	-H "Content-Type: application/json" \
	-d '{
		"session_id": "<session-id>",
		"player_decision": {
			"action": "deploy_carrier_group",
			"label": "Deploy USS Ronald Reagan to South China Sea",
			"category": "military"
		}
	}'
```

The response includes:
- Updated `current_turn`
- Full `turns` history
- `redcell_response` JSON (China next move)
- `adjudicator_score`

## Team
| Name | Role |
|---|---|
| Nasrullah (Naz) Hussain | Frontend, Adjudicator AI, Scenario Design, Pitch |
| Shriyash Soni | Red Cell AI, Backend Game Loop, API Integration |
