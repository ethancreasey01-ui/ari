# Agent Task System - GitHub Sync

## How It Works

### 1. User Sends Message in Dashboard
- Dashboard generates unique Task ID (e.g., "scribe-20240214-215900")
- Shows Task ID to user
- Saves to localStorage (temporary)

### 2. User Notifies Ari (Telegram)
User messages Ari:
```
New task in Mission Control
Task ID: scribe-20240214-215900
Agent: Scribe
Request: "Write 3 Facebook posts for Danny's bathroom reno"
```

### 3. Ari Processes Task
- Ari spawns the appropriate agent
- Agent does the work
- Ari saves response to: `/tasks/{task-id}.json`
- Commits to GitHub

### 4. Dashboard Reads Response
- Dashboard polls GitHub every 10 seconds
- When response file appears, displays it in chat
- Updates localStorage

## File Structure

```
/mission-control/
  /tasks/
    scribe-20240214-215900.json
    sage-20240214-220100.json
    dev-20240214-220500.json
```

## Task File Format

```json
{
  "id": "scribe-20240214-215900",
  "agentId": "scribe",
  "agentName": "Scribe",
  "request": "Write 3 Facebook posts for Danny's bathroom reno",
  "status": "completed",
  "timestamp": 1707919140000,
  "response": {
    "content": "Here are 3 posts...",
    "deliverables": ["post1", "post2", "post3"],
    "completedAt": 1707919200000
  }
}
```

## API Endpoint

Dashboard reads from:
```
https://raw.githubusercontent.com/ethancreasey01/mission-control/main/tasks/{task-id}.json
```
