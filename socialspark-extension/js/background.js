// Background Script - Handles communication between dashboard and Facebook

console.log('SocialSpark Extension: Background script loaded');

// Store pending posts
let pendingPost = null;

// Listen for messages from dashboard or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received:', request, 'from:', sender);
  
  // From dashboard: Request to post to Facebook
  if (request.action === 'postToFacebook') {
    handlePostRequest(request.content, request.target)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({success: false, error: error.message}));
    return true; // Keep channel open
  }
  
  // From dashboard: Check if extension is installed
  if (request.action === 'ping') {
    sendResponse({success: true, version: '1.0.0'});
  }
  
  // From content script: Composer status update
  if (request.action === 'composerStatus') {
    console.log('Composer status:', request.available);
    // Could update badge or popup here
  }
  
  // From popup: Get pending post
  if (request.action === 'getPendingPost') {
    sendResponse({post: pendingPost});
    pendingPost = null; // Clear after retrieval
  }
});

// Handle post request from dashboard
async function handlePostRequest(content, target) {
  console.log('Handling post request:', {content, target});
  
  // Check if Facebook tab already exists
  const facebookTabs = await chrome.tabs.query({
    url: ['https://www.facebook.com/*', 'https://facebook.com/*']
  });
  
  let facebookTab;
  
  if (facebookTabs.length > 0) {
    // Use existing Facebook tab
    facebookTab = facebookTabs[0];
    await chrome.tabs.update(facebookTab.id, {active: true});
    console.log('Using existing Facebook tab');
  } else {
    // Open new Facebook tab
    facebookTab = await chrome.tabs.create({
      url: 'https://www.facebook.com',
      active: true
    });
    console.log('Opened new Facebook tab');
  }
  
  // Wait for page to load
  await sleep(3000);
  
  // Send message to content script to fill the post
  try {
    const response = await chrome.tabs.sendMessage(facebookTab.id, {
      action: 'fillPost',
      content: content,
      target: target
    });
    
    console.log('Post filled response:', response);
    
    if (response && response.success) {
      // Store pending post info
      pendingPost = {
        content: content,
        target: target,
        timestamp: Date.now(),
        tabId: facebookTab.id
      };
      
      return {
        success: true,
        message: 'Content filled in Facebook. Please click "Post" to publish.',
        tabId: facebookTab.id
      };
    } else {
      throw new Error(response?.error || 'Failed to fill post');
    }
  } catch (error) {
    console.error('Error sending message to content script:', error);
    
    // Content script might not be loaded yet, try again
    if (error.message.includes('Could not establish connection')) {
      await sleep(2000);
      return handlePostRequest(content, target); // Retry
    }
    
    throw error;
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('SocialSpark Extension installed:', details.reason);
  
  // Set default settings
  chrome.storage.sync.set({
    autoPost: false,
    defaultTarget: 'feed',
    showNotifications: true
  });
});

// Handle tab updates (check if Facebook loaded)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('facebook.com')) {
    console.log('Facebook page loaded in tab:', tabId);
  }
});

// Utility function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Keep service worker alive (Manifest V3 requirement)
chrome.alarms.create('keepAlive', { periodInMinutes: 4.9 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log('Keeping service worker alive');
  }
});

console.log('SocialSpark Extension: Background script initialized');
