// Facebook Content Script - Injected into Facebook pages
// Handles auto-filling post content

console.log('SocialSpark Extension: Facebook content script loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('SocialSpark: Received message', request);
  
  if (request.action === 'fillPost') {
    fillFacebookPost(request.content, request.target)
      .then(result => sendResponse({success: true, result}))
      .catch(error => sendResponse({success: false, error: error.message}));
    return true; // Keep channel open for async
  }
  
  if (request.action === 'checkPage') {
    const isComposerVisible = checkForComposer();
    sendResponse({hasComposer: isComposerVisible});
  }
});

// Check if Facebook composer is available
function checkForComposer() {
  const composer = document.querySelector('[role="textbox"]') || 
                   document.querySelector('[contenteditable="true"]') ||
                   document.querySelector('div[aria-label*="What"]') ||
                   document.querySelector('div[aria-label*="Create"]');
  return !!composer;
}

// Main function to fill Facebook post
async function fillFacebookPost(content, target = 'feed') {
  console.log('SocialSpark: Filling post', {content, target});
  
  // Wait for page to be ready
  await waitForPageReady();
  
  // If target is groups, try to find group composer
  if (target === 'groups') {
    const groupComposer = await findGroupComposer();
    if (groupComposer) {
      await fillComposer(groupComposer, content);
      return {success: true, location: 'group'};
    }
  }
  
  // Otherwise fill main feed composer
  const mainComposer = await findMainComposer();
  if (mainComposer) {
    await fillComposer(mainComposer, content);
    return {success: true, location: 'feed'};
  }
  
  throw new Error('Could not find Facebook composer. Please navigate to Facebook first.');
}

// Wait for page to be ready
function waitForPageReady() {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve, {once: true});
    }
  });
}

// Find the main feed composer
async function findMainComposer() {
  // Try multiple selectors as Facebook changes them often
  const selectors = [
    '[role="textbox"][aria-label*="What"]',
    '[contenteditable="true"][aria-label*="What"]',
    'div[aria-label="What\'s on your mind?"]',
    'div[aria-label="Create a post"]',
    '[data-testid="status-attachment-mentions-input"]',
    '[data-testid="status-attachment-mentions-input"] [contenteditable]',
    'form [role="presentation"] [contenteditable]',
    'div[contenteditable="true"][role="textbox"]'
  ];
  
  for (let i = 0; i < 10; i++) { // Try for 5 seconds
    for (const selector of selectors) {
      const composer = document.querySelector(selector);
      if (composer && isElementVisible(composer)) {
        console.log('SocialSpark: Found main composer', selector);
        return composer;
      }
    }
    await sleep(500);
  }
  
  return null;
}

// Find group composer
async function findGroupComposer() {
  const selectors = [
    '[role="textbox"][aria-label*="group"]',
    '[contenteditable="true"][aria-label*="group"]',
    '[data-testid="status-attachment-mentions-input"]',
    'div[contenteditable="true"]'
  ];
  
  for (let i = 0; i < 10; i++) {
    for (const selector of selectors) {
      const composer = document.querySelector(selector);
      if (composer && isElementVisible(composer)) {
        console.log('SocialSpark: Found group composer');
        return composer;
      }
    }
    await sleep(500);
  }
  
  return null;
}

// Fill the composer with content
async function fillComposer(composer, content) {
  // Click to focus
  composer.click();
  await sleep(300);
  
  // Clear existing content
  composer.focus();
  document.execCommand('selectAll', false, null);
  document.execCommand('delete', false, null);
  await sleep(200);
  
  // Type the content
  typeContent(composer, content);
  
  // Trigger input events
  triggerInputEvents(composer);
  
  console.log('SocialSpark: Content filled successfully');
}

// Type content into element
function typeContent(element, text) {
  // Method 1: Direct text insertion
  if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
    element.value = text;
  } else {
    // For contenteditable
    element.textContent = text;
  }
  
  // Method 2: Simulate typing (more reliable)
  const event = new InputEvent('input', {
    bubbles: true,
    cancelable: true,
    inputType: 'insertText',
    data: text
  });
  element.dispatchEvent(event);
}

// Trigger necessary input events
function triggerInputEvents(element) {
  const events = ['focus', 'input', 'change', 'keyup', 'blur'];
  events.forEach(eventType => {
    const event = new Event(eventType, { bubbles: true });
    element.dispatchEvent(event);
  });
  
  // Also trigger React-friendly events
  const inputEvent = new InputEvent('input', { bubbles: true });
  element.dispatchEvent(inputEvent);
}

// Check if element is visible
function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight;
}

// Sleep utility
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Monitor for composer availability and notify background
let composerAvailable = false;
function checkComposerAvailability() {
  const hasComposer = checkForComposer();
  if (hasComposer !== composerAvailable) {
    composerAvailable = hasComposer;
    chrome.runtime.sendMessage({
      action: 'composerStatus',
      available: hasComposer
    });
  }
}

// Check periodically
checkComposerAvailability();
setInterval(checkComposerAvailability, 2000);

console.log('SocialSpark Extension: Content script initialized');
