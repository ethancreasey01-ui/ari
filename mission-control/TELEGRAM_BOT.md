# Telegram Bot Integration for Mission Control

## Bot Details
- **Name:** AriEthanSub2026Bot
- **Username:** @AriEthanSub2026Bot
- **Token:** Stored securely in environment variables

## How It Works

### 1. Dashboard Sends Message
When user sends message to agent in dashboard:
- POST to Telegram Bot API
- Sends message to my Telegram (@ethancreasey10)
- Includes: Task ID, Agent Name, Request

### 2. I Receive & Process
- Get instant notification in Telegram
- See Task ID and request details
- Spawn appropriate agent
- Do the work

### 3. Response Saved
- Save response to GitHub
- Dashboard polls and displays result
- User sees completed work in chat

## API Endpoints

### Send Message
```
POST https://api.telegram.org/bot{TOKEN}/sendMessage
{
  "chat_id": "7548763122",
  "text": "📋 NEW TASK\n\nID: scribe-123\nAgent: Scribe\nRequest: Write 3 Facebook posts..."
}
```

## Setup
1. Bot created ✓
2. Add bot token to dashboard config
3. Test message sending
4. Deploy updated dashboard
