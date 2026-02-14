import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, BarChart3, Users, FolderKanban, 
  Settings, Zap, Search, Send, Sparkles,
  Target, PenTool, Code, Palette, LineChart, HeartHandshake,
  Menu, X, ChevronRight, Plus, Clock, CheckCircle2
} from 'lucide-react';

// Brand Colors
const colors = {
  primary: '#6366f1',    // Indigo
  secondary: '#8b5cf6',  // Purple
  accent: '#06b6d4',     // Cyan
  success: '#10b981',    // Emerald
  warning: '#f59e0b',    // Amber
  danger: '#ef4444',     // Red
  dark: '#0f172a',       // Slate 900
  darker: '#020617',     // Slate 950
  panel: '#1e293b',      // Slate 800
  border: '#334155',     // Slate 700
  text: '#f8fafc',       // Slate 50
  muted: '#94a3b8'       // Slate 400
};

// Agent Definitions
const agents = [
  { 
    id: 'sage', 
    name: 'Sage', 
    role: 'Research & Strategy',
    icon: Target,
    color: '#8b5cf6',
    description: 'Competitor analysis, SEO audits, market research',
    skills: ['SEO Audit', 'Competitor Research', 'Keyword Analysis', 'Market Trends']
  },
  { 
    id: 'scribe', 
    name: 'Scribe', 
    role: 'Content & Copy',
    icon: PenTool,
    color: '#06b6d4',
    description: 'Social posts, ad copy, emails, blogs',
    skills: ['Social Media', 'Ad Copy', 'Email Sequences', 'Blog Posts']
  },
  { 
    id: 'dev', 
    name: 'Dev', 
    role: 'Web Development',
    icon: Code,
    color: '#10b981',
    description: 'Websites, landing pages, technical fixes',
    skills: ['React/Vite', 'WordPress', 'Landing Pages', 'SEO Tech']
  },
  { 
    id: 'analyst', 
    name: 'Analyst', 
    role: 'Data & Analytics',
    icon: LineChart,
    color: '#f59e0b',
    description: 'Campaign reports, ROI tracking, insights',
    skills: ['Google Analytics', 'Campaign Reports', 'ROI Tracking', 'A/B Testing']
  },
  { 
    id: 'pixel', 
    name: 'Pixel', 
    role: 'Design & Creative',
    icon: Palette,
    color: '#ec4899',
    description: 'Ad creatives, social graphics, branding',
    skills: ['Ad Creatives', 'Social Graphics', 'Brand Assets', 'Canva/Figma']
  },
  { 
    id: 'client', 
    name: 'Client', 
    role: 'Client Success',
    icon: HeartHandshake,
    color: '#6366f1',
    description: 'Onboarding, check-ins, reports, upsells',
    skills: ['Onboarding', 'Check-in Emails', 'Monthly Reports', 'Upsell Strategy']
  }
];

// Initial Chat Messages
const initialMessages = {
  sage: [
    { role: 'agent', content: 'Hi Ethan! I\'m Sage, your research specialist. I can help with SEO audits, competitor analysis, and market research. What would you like me to look into today?' }
  ],
  scribe: [
    { role: 'agent', content: 'Hey Ethan! Scribe here ✍️ Ready to craft some killer copy? I can write social posts, ad copy, emails, or blog content. What do you need?' }
  ],
  dev: [
    { role: 'agent', content: 'Yo Ethan! Dev at your service 💻 Need a website built? Landing page optimized? Technical SEO fixed? Let me know what you\'re working on.' }
  ],
  analyst: [
    { role: 'agent', content: 'Hello Ethan! Analyst here 📊 I track campaign performance, calculate ROI, and spot optimization opportunities. Want me to check on any metrics?' }
  ],
  pixel: [
    { role: 'agent', content: 'Hi Ethan! Pixel here 🎨 Ready to make things look beautiful? I can create ad creatives, social graphics, or help with brand assets. What\'s the project?' }
  ],
  client: [
    { role: 'agent', content: 'Hey Ethan! Client here 🤝 I handle onboarding sequences, check-in emails, and monthly reports. Need help keeping clients happy and engaged?' }
  ]
};

// Sample Projects
const sampleProjects = [
  { id: 1, name: 'Danny Ymer — Cherry Builds', status: 'active', progress: 35, agent: 'sage', lastUpdate: '2 hours ago' },
  { id: 2, name: 'Ron Smith — Blockage Masters', status: 'completed', progress: 100, agent: 'dev', lastUpdate: '3 days ago' },
  { id: 3, name: 'Elliot — DSEA Electrical', status: 'active', progress: 60, agent: 'analyst', lastUpdate: '5 hours ago' }
];

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [chatMessages, setChatMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Active task tracking
  const [activeTasks, setActiveTasks] = useState({});
  
  // Handle sending message - creates task and shows instructions
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent) return;
    
    // Generate unique task ID
    const taskId = `${selectedAgent}-${Date.now()}`;
    const agentName = agents.find(a => a.id === selectedAgent)?.name;
    
    // Add user message to UI
    const userMessage = { role: 'user', content: inputMessage, timestamp: Date.now(), taskId };
    const newMessages = {
      ...chatMessages,
      [selectedAgent]: [...(chatMessages[selectedAgent] || []), userMessage]
    };
    setChatMessages(newMessages);
    setInputMessage('');
    
    // Save task to localStorage
    const taskData = {
      id: taskId,
      agentId: selectedAgent,
      agentName: agentName,
      request: inputMessage,
      status: 'pending',
      timestamp: Date.now()
    };
    localStorage.setItem(`task-${taskId}`, JSON.stringify(taskData));
    
    // Track active task
    setActiveTasks(prev => ({ ...prev, [selectedAgent]: taskId }));
    
    // Send Telegram notification via API
    const telegramPayload = {
      taskId: taskId,
      agentName: agentName,
      agentId: selectedAgent,
      request: inputMessage,
      timestamp: Date.now()
    };
    
    // Call the API endpoint
    fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramPayload)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('✅ Telegram notification sent:', data.messageId);
      } else {
        console.error('❌ Failed to send Telegram notification:', data.error);
      }
    })
    .catch(error => {
      console.error('❌ API error:', error);
    });
    
    // Add confirmation message
    const waitingMessage = { 
      role: 'agent', 
      content: `📋 **TASK CREATED: ${taskId}**

✅ **Notification sent to Ari via Telegram Bot!**

🤖 Agent: ${agentName}
📝 Request: "${inputMessage.substring(0, 80)}${inputMessage.length > 80 ? '...' : ''}"

⏳ Ari has been notified and will process this task.
📱 Response will appear here automatically.

*No need to copy/paste — the bot handles everything!*`,
      timestamp: Date.now(),
      taskId: taskId,
      isTaskCard: true
    };
    
    setTimeout(() => {
      setChatMessages(prev => ({
        ...prev,
        [selectedAgent]: [...(prev[selectedAgent] || []), waitingMessage]
      }));
    }, 500);
  };
  
  // Function to check for task responses
  const checkForResponses = async () => {
    // Get all pending tasks from localStorage
    const pendingTasks = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('task-') && !key.includes('-completed')) {
        const taskData = JSON.parse(localStorage.getItem(key) || '{}');
        if (taskData.status === 'pending') {
          pendingTasks.push(taskData);
        }
      }
    }
    
    if (pendingTasks.length === 0) return;
    
    for (const task of pendingTasks) {
      try {
        const response = await fetch(`https://raw.githubusercontent.com/ethancreasey01-ui/ari/main/mission-control/tasks/${task.id}.json?t=${Date.now()}`);
        if (response.ok) {
          const taskData = await response.json();
          if (taskData.status === 'completed' && taskData.response) {
            // Add response to chat
            const agentMessage = {
              role: 'agent',
              content: taskData.response.content,
              timestamp: taskData.response.completedAt || Date.now(),
              taskId: task.id,
              isComplete: true
            };
            
            setChatMessages(prev => {
              const existing = prev[task.agentId]?.find(m => m.taskId === task.id && m.isComplete);
              if (existing) return prev;
              
              return {
                ...prev,
                [task.agentId]: [...(prev[task.agentId] || []), agentMessage]
              };
            });
            
            // Update localStorage
            localStorage.setItem(`task-${task.id}`, JSON.stringify({ ...task, status: 'completed' }));
            localStorage.setItem(`task-${task.id}-completed`, JSON.stringify(taskData));
            
            // Remove from active tasks
            setActiveTasks(prev => {
              const newTasks = { ...prev };
              delete newTasks[task.agentId];
              return newTasks;
            });
          }
        }
      } catch (error) {
        console.log(`Task ${task.id} not ready yet`);
      }
    }
  };

  // Poll for task responses from GitHub
  useEffect(() => {
    const interval = setInterval(checkForResponses, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Check for responses on initial load
  useEffect(() => {
    checkForResponses();
  }, []);
  
  // Poll for agent responses (simulated)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      // In real implementation, this would check for new responses from backend
      // For now, localStorage is used to simulate persistence
    }, 2000);
    
    return () => clearInterval(pollInterval);
  }, []);

  return (
    <div className="min-h-screen flex" style={{ background: colors.darker, color: colors.text, fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <motion.aside 
        className="fixed left-0 top-0 h-full z-50 border-r"
        style={{ 
          width: sidebarOpen ? 280 : 80, 
          background: colors.dark,
          borderColor: colors.border 
        }}
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b" style={{ borderColor: colors.border }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-lg">Mission Control</h1>
              <p className="text-xs" style={{ color: colors.muted }}>AI-Powered Agency</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <NavButton 
            icon={BarChart3} 
            label="Dashboard" 
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            sidebarOpen={sidebarOpen}
          />
          <NavButton 
            icon={MessageSquare} 
            label="AI Agents" 
            active={activeTab === 'agents'}
            onClick={() => setActiveTab('agents')}
            sidebarOpen={sidebarOpen}
          />
          <NavButton 
            icon={FolderKanban} 
            label="Projects" 
            active={activeTab === 'projects'}
            onClick={() => setActiveTab('projects')}
            sidebarOpen={sidebarOpen}
          />
          <NavButton 
            icon={Users} 
            label="Clients" 
            active={activeTab === 'clients'}
            onClick={() => setActiveTab('clients')}
            sidebarOpen={sidebarOpen}
          />
          <NavButton 
            icon={Settings} 
            label="Settings" 
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            sidebarOpen={sidebarOpen}
          />
        </nav>

        {/* Toggle Sidebar */}
        <button 
          className="absolute -right-3 top-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs"
          style={{ background: colors.panel, border: `1px solid ${colors.border}` }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? '<' : '>'}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main 
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 280 : 80 }}
      >
        {/* Header */}
        <header 
          className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-40"
          style={{ background: colors.dark, borderColor: colors.border }}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'agents' && 'AI Agents'}
              {activeTab === 'projects' && 'Projects'}
              {activeTab === 'clients' && 'Clients'}
              {activeTab === 'settings' && 'Settings'}
            </h2>
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{ background: `${colors.success}20`, color: colors.success }}
            >
              6 Agents Online
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: colors.panel }}
            >
              <Search className="w-4 h-4" style={{ color: colors.muted }} />
              <input 
                type="text" 
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-48"
                style={{ color: colors.text }}
              />
            </div>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
            >
              EC
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'agents' && (
            <AgentsView 
              selectedAgent={selectedAgent}
              setSelectedAgent={setSelectedAgent}
              chatMessages={chatMessages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              checkForResponses={checkForResponses}
            />
          )}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'clients' && <ClientsView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
}

// Navigation Button Component
function NavButton({ icon: Icon, label, active, onClick, sidebarOpen }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
      style={{ 
        background: active ? `${colors.primary}20` : 'transparent',
        color: active ? colors.primary : colors.muted,
        borderLeft: active ? `3px solid ${colors.primary}` : '3px solid transparent'
      }}
    >
      <Icon className="w-5 h-5" />
      {sidebarOpen && <span className="font-medium">{label}</span>}
    </button>
  );
}

// Dashboard View
function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Active Projects" 
          value="3" 
          change="+1 this week" 
          icon={FolderKanban}
          color={colors.primary}
        />
        <StatCard 
          title="Leads This Month" 
          value="12" 
          change="+25% vs last month" 
          icon={Target}
          color={colors.success}
        />
        <StatCard 
          title="Ad Spend" 
          value="$1,380" 
          change="$780 remaining" 
          icon={LineChart}
          color={colors.accent}
        />
        <StatCard 
          title="Cost Per Lead" 
          value="$115" 
          change="-15% optimized" 
          icon={Zap}
          color={colors.secondary}
        />
      </div>

      {/* Agent Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Activity */}
        <div 
          className="rounded-xl p-6 border"
          style={{ background: colors.dark, borderColor: colors.border }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: colors.secondary }} />
            Agent Activity (24h)
          </h3>
          <div className="space-y-3">
            <ActivityItem 
              agent="Scribe" 
              action="Created 5 Facebook posts for Danny"
              time="2 hours ago"
              color="#06b6d4"
            />
            <ActivityItem 
              agent="Dev" 
              action="Deployed plumber website update"
              time="4 hours ago"
              color="#10b981"
            />
            <ActivityItem 
              agent="Analyst" 
              action="Generated weekly report for Elliot"
              time="6 hours ago"
              color="#f59e0b"
            />
            <ActivityItem 
              agent="Sage" 
              action="Completed SEO audit for new client"
              time="8 hours ago"
              color="#8b5cf6"
            />
          </div>
        </div>

        {/* Recent Projects */}
        <div 
          className="rounded-xl p-6 border"
          style={{ background: colors.dark, borderColor: colors.border }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FolderKanban className="w-5 h-5" style={{ color: colors.primary }} />
            Active Projects
          </h3>
          <div className="space-y-3">
            {sampleProjects.map(project => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div 
        className="rounded-xl p-6 border"
        style={{ background: colors.dark, borderColor: colors.border }}
      >
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <QuickActionButton icon={Plus} label="New Project" />
          <QuickActionButton icon={MessageSquare} label="Message Agent" />
          <QuickActionButton icon={LineChart} label="View Reports" />
          <QuickActionButton icon={Users} label="Add Client" />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, change, icon: Icon, color }) {
  return (
    <div 
      className="rounded-xl p-5 border"
      style={{ background: colors.dark, borderColor: colors.border }}
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium" style={{ color: colors.muted }}>{title}</div>
      <div className="text-xs mt-2" style={{ color: colors.success }}>{change}</div>
    </div>
  );
}

// Activity Item
function ActivityItem({ agent, action, time, color }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: colors.panel }}>
      <div 
        className="w-2 h-2 rounded-full"
        style={{ background: color }}
      />
      <div className="flex-1">
        <span className="font-medium" style={{ color }}>{agent}</span>
        <span className="mx-2" style={{ color: colors.muted }}>•</span>
        <span>{action}</span>
      </div>
      <div className="text-xs" style={{ color: colors.muted }}>{time}</div>
    </div>
  );
}

// Project Item
function ProjectItem({ project }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: colors.panel }}>
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: `${agents.find(a => a.id === project.agent)?.color || colors.primary}20` }}
      >
        {(() => {
          const AgentIcon = agents.find(a => a.id === project.agent)?.icon || FolderKanban;
          return <AgentIcon className="w-5 h-5" style={{ color: agents.find(a => a.id === project.agent)?.color || colors.primary }} />;
        })()}
      </div>
      <div className="flex-1">
        <div className="font-medium">{project.name}</div>
        <div className="text-xs" style={{ color: colors.muted }}>Last update: {project.lastUpdate}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium">{project.progress}%</div>
        <div 
          className="w-20 h-1.5 rounded-full mt-1"
          style={{ background: colors.border }}
        >
          <div 
            className="h-full rounded-full"
            style={{ 
              width: `${project.progress}%`,
              background: project.progress === 100 ? colors.success : colors.primary
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Quick Action Button
function QuickActionButton({ icon: Icon, label }) {
  return (
    <button 
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all hover:opacity-80"
      style={{ background: colors.panel, border: `1px solid ${colors.border}` }}
    >
      <Icon className="w-4 h-4" style={{ color: colors.primary }} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// Agents View
function AgentsView({ selectedAgent, setSelectedAgent, chatMessages, inputMessage, setInputMessage, handleSendMessage, checkForResponses }) {
  const agent = agents.find(a => a.id === selectedAgent);

  return (
    <div className="flex gap-6" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Agent List */}
      <div className="w-80 space-y-3">
        <h3 className="text-sm font-semibold mb-4" style={{ color: colors.muted }}>YOUR AI TEAM</h3>
        {agents.map(a => (
          <button
            key={a.id}
            onClick={() => setSelectedAgent(a.id)}
            className="w-full text-left p-4 rounded-xl border transition-all"
            style={{ 
              background: selectedAgent === a.id ? colors.panel : colors.dark,
              borderColor: selectedAgent === a.id ? a.color : colors.border,
              borderWidth: selectedAgent === a.id ? '2px' : '1px'
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${a.color}20` }}
              >
                <a.icon className="w-5 h-5" style={{ color: a.color }} />
              </div>
              <div>
                <div className="font-semibold">{a.name}</div>
                <div className="text-xs" style={{ color: colors.muted }}>{a.role}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {a.skills.slice(0, 3).map(skill => (
                <span 
                  key={skill}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: `${a.color}20`, color: a.color }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Chat Interface */}
      {selectedAgent && agent ? (
        <div 
          className="flex-1 rounded-xl border flex flex-col"
          style={{ background: colors.dark, borderColor: colors.border }}
        >
          {/* Chat Header */}
          <div 
            className="p-4 border-b flex items-center justify-between"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${agent.color}20` }}
              >
                <agent.icon className="w-5 h-5" style={{ color: agent.color }} />
              </div>
              <div>
                <div className="font-semibold">{agent.name}</div>
                <div className="text-xs flex items-center gap-1" style={{ color: colors.success }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={checkForResponses}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
              style={{ background: colors.panel, border: `1px solid ${colors.border}` }}
            >
              <Clock className="w-4 h-4" style={{ color: colors.primary }} />
              Check for Responses
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {(chatMessages[selectedAgent] || []).map((msg, idx) => (
              <div 
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className="max-w-[80%] p-3 rounded-xl"
                  style={{ 
                    background: msg.role === 'user' ? colors.primary : colors.panel,
                    color: msg.role === 'user' ? 'white' : colors.text
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t" style={{ borderColor: colors.border }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Message ${agent.name}...`}
                className="flex-1 px-4 py-3 rounded-lg outline-none"
                style={{ background: colors.panel, border: `1px solid ${colors.border}`, color: colors.text }}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-3 rounded-lg flex items-center gap-2"
                style={{ background: colors.primary }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="flex-1 rounded-xl border flex items-center justify-center"
          style={{ background: colors.dark, borderColor: colors.border }}
        >
          <div className="text-center" style={{ color: colors.muted }}>
            <MessageSquare className="w-12 h-12 mx-auto mb-3" />
            <p>Select an agent to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Projects View
function ProjectsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Projects</h2>
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ background: colors.primary }}
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>
      
      <div className="grid gap-4">
        {sampleProjects.map(project => (
          <div 
            key={project.id}
            className="p-6 rounded-xl border"
            style={{ background: colors.dark, borderColor: colors.border }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm" style={{ color: colors.muted }}>Managed by {agents.find(a => a.id === project.agent)?.name}</p>
              </div>
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  background: project.status === 'completed' ? `${colors.success}20` : `${colors.primary}20`,
                  color: project.status === 'completed' ? colors.success : colors.primary
                }}
              >
                {project.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm" style={{ color: colors.muted }}>Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div 
                  className="h-2 rounded-full"
                  style={{ background: colors.border }}
                >
                  <motion.div 
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1 }}
                    style={{ 
                      background: project.progress === 100 ? colors.success : `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`
                    }}
                  />
                </div>
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: colors.muted }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Clients View
function ClientsView() {
  const clients = [
    { name: 'Danny Ymer', business: 'Cherry Builds & Aqua Tight', status: 'active', leads: 3 },
    { name: 'Ron Smith', business: 'Blockage Masters', status: 'active', leads: 8 },
    { name: 'Elliot', business: 'DSEA Electrical', status: 'active', leads: 5 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clients</h2>
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ background: colors.primary }}
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      <div className="grid gap-4">
        {clients.map((client, idx) => (
          <div 
            key={idx}
            className="p-6 rounded-xl border flex items-center gap-4"
            style={{ background: colors.dark, borderColor: colors.border }}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
            >
              {client.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{client.name}</h3>
              <p className="text-sm" style={{ color: colors.muted }}>{client.business}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: colors.success }}>{client.leads}</div>
                <div className="text-xs" style={{ color: colors.muted }}>Leads</div>
              </div>
              <span 
                className="px-3 py-1 rounded-full text-sm"
                style={{ background: `${colors.success}20`, color: colors.success }}
              >
                Active
              </span>
              <ChevronRight className="w-5 h-5" style={{ color: colors.muted }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Settings View
function SettingsView() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-4">
        <SettingItem 
          title="Agency Name"
          value="Mission Control AI"
          description="This appears on client reports and dashboards"
        />
        <SettingItem 
          title="Default Ad Budget"
          value="$800/month"
          description="Suggested starting budget for new clients"
        />
        <SettingItem 
          title="Notification Preferences"
          value="Email & Dashboard"
          description="How you want to be notified of agent activity"
        />
        <SettingItem 
          title="API Integrations"
          value="Google Ads, Facebook, Stripe"
          description="Connected services"
        />
      </div>
    </div>
  );
}

// Setting Item
function SettingItem({ title, value, description }) {
  return (
    <div 
      className="p-4 rounded-xl border flex items-center justify-between"
      style={{ background: colors.dark, borderColor: colors.border }}
    >
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm" style={{ color: colors.muted }}>{description}</div>
      </div>
      <div className="flex items-center gap-3">
        <span style={{ color: colors.primary }}>{value}</span>
        <ChevronRight className="w-4 h-4" style={{ color: colors.muted }} />
      </div>
    </div>
  );
}

export default App;
