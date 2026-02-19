# SocialSpark Browser Extension - Build Plan
## Option A: Quick Win Approach

**Goal**: One-click post to Facebook from the SocialSpark dashboard
**Timeline**: 1-2 weeks
**Budget**: $500-1000 dev cost
**No Meta approvals needed!**

---

## 🎯 How It Works

### User Flow:
1. User generates content in SocialSpark dashboard
2. Clicks "Post to Facebook" button
3. Extension opens Facebook in new tab
4. Auto-fills the content
5. User clicks "Publish" (required by Facebook Terms)
6. Done!

**Time saved**: 30 seconds → 5 seconds per post

---

## 🛠️ Technical Architecture

### Components:

**1. Browser Extension (Chrome/Firefox)**
- Content script (injects into Facebook)
- Background script (handles messages)
- Popup UI (settings, status)

**2. SocialSpark Dashboard Integration**
- "Post to Facebook" button
- Sends content to extension
- Checks if extension installed

**3. Facebook Integration**
- Opens facebook.com
- Detects composer box
- Fills text content
- (User manually clicks Post)

---

## 📋 Features

### MVP (Week 1):
- ✅ Chrome extension
- ✅ "Post to Facebook" button in dashboard
- ✅ Auto-fill Facebook composer
- ✅ Basic error handling

### Polish (Week 2):
- ✅ Firefox support
- ✅ Facebook Groups support
- ✅ Image upload support
- ✅ Scheduling reminder
- ✅ Success notifications

---

## 💰 Pricing Strategy

### SocialSpark Tiers:
- **Starter**: $49/month - Manual copy/paste
- **Growth**: $149/month - **Includes browser extension** ⭐
- **Agency**: $499/month - Extension + priority support

**Extension adds $100/month value** (saves time, easier workflow)

---

## 🎯 For Elliot & Ron (Tradies)

### Their Workflow:
1. Generate post about emergency plumbing
2. Click "Post to Facebook"
3. Extension opens Facebook
4. Content auto-filled: "🚨 Emergency plumber available 24/7 in [area]. Call now: [number]"
5. They click "Post"
6. Done in 5 seconds!

### Value Prop:
- Post from anywhere (phone or computer)
- No copy/paste errors
- Consistent posting
- Saves 10+ hours/month

---

## 📊 Success Metrics

### Week 1 Goal:
- Extension working in Chrome
- One-click posting functional
- Demo to Elliot & Ron

### Week 2 Goal:
- Both browsers supported
- Facebook Groups working
- 2 paying customers

---

## 🚀 Next Steps

1. **Build Chrome extension** (today)
2. **Integrate with dashboard** (tomorrow)
3. **Test with Facebook** (day 3)
4. **Polish UI** (day 4-5)
5. **Demo to Elliot & Ron** (day 6-7)

**Ready to start?** 🛠️
