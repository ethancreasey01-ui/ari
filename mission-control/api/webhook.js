// Vercel Serverless Function - Telegram Webhook
// Receives messages from Telegram bot when Ari replies
// File: /api/webhook.js

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  // Telegram sends updates via POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message || !message.text) {
    return res.status(200).json({ ok: true }); // Acknowledge but ignore
  }

  const text = message.text;
  const chatId = message.chat.id;

  // Only process messages from Ethan's chat
  if (chatId.toString() !== '7548763122') {
    return res.status(200).json({ ok: true });
  }

  // Check if message contains a task response
  // Format expected: "Task {task-id} - {response}" or just the response with task ID
  const taskIdMatch = text.match(/scribe-\d+|sage-\d+|dev-\d+|analyst-\d+|pixel-\d+|client-\d+/);
  
  if (taskIdMatch) {
    const taskId = taskIdMatch[0];
    const agentId = taskId.split('-')[0];
    
    // Extract response (everything after task ID or full message)
    let responseContent = text;
    if (text.includes(taskId)) {
      responseContent = text.split(taskId)[1]?.trim() || text;
    }

    // Create task response file
    const taskResponse = {
      id: taskId,
      agentId: agentId,
      status: 'completed',
      response: {
        content: responseContent,
        completedAt: Date.now()
      }
    };

    try {
      // Save to file
      const fs = await import('fs').then(m => m.promises);
      const path = `./tasks/${taskId}.json`;
      
      await fs.mkdir('./tasks', { recursive: true });
      await fs.writeFile(path, JSON.stringify(taskResponse, null, 2));

      // Commit to GitHub
      await execAsync(`git add ${path} && git commit -m "Add task response: ${taskId}" && git push`);

      console.log(`✅ Task ${taskId} response saved and pushed to GitHub`);
      
      return res.status(200).json({ 
        ok: true, 
        taskId: taskId,
        message: 'Response saved' 
      });

    } catch (error) {
      console.error('Error saving task response:', error);
      return res.status(500).json({ 
        error: 'Failed to save response',
        details: error.message 
      });
    }
  }

  // If no task ID found, just acknowledge
  return res.status(200).json({ ok: true, message: 'No task ID found in message' });
}
