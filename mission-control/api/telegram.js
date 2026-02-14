// Vercel Serverless Function - Telegram Bot Integration
// File: /api/telegram.js

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { taskId, agentName, agentId, request, timestamp } = req.body;

  if (!taskId || !agentName || !request) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = '7548763122'; // Ethan's Telegram ID

  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not set');
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  // Format the message
  const message = `📋 NEW MISSION CONTROL TASK

🤖 Agent: ${agentName}
🆔 Task ID: ${taskId}
⏰ Time: ${new Date(timestamp).toLocaleString()}

📝 REQUEST:
"${request}"

Reply to complete this task.`;

  try {
    // Send message to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      console.error('Telegram API error:', telegramData);
      return res.status(500).json({ 
        error: 'Failed to send Telegram message',
        details: telegramData 
      });
    }

    // Success!
    return res.status(200).json({
      success: true,
      messageId: telegramData.result.message_id,
      taskId: taskId
    });

  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
