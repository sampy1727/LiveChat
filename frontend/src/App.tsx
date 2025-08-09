import React, { useState, useEffect, useRef } from 'react';

interface Message {
  username: string;
  text: string;
  timestamp: number;
}

// Enhanced room color themes with better gradients and animations
const roomThemes = {
  general: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    cardBg: 'rgba(102, 126, 234, 0.15)',
    accent: '#667eea',
    accentLight: 'rgba(102, 126, 234, 0.2)',
    name: 'General',
    icon: '💬',
    description: 'General discussions for everyone',
    particleColor: '#667eea'
  },
  tech: {
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #0fd850 100%)',
    cardBg: 'rgba(17, 153, 142, 0.15)',
    accent: '#11998e',
    accentLight: 'rgba(17, 153, 142, 0.2)',
    name: 'Tech Talk',
    icon: '⚡',
    description: 'Cutting-edge technology discussions',
    particleColor: '#11998e'
  },
  random: {
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #fd79a8 100%)',
    cardBg: 'rgba(255, 107, 107, 0.15)',
    accent: '#ff6b6b',
    accentLight: 'rgba(255, 107, 107, 0.2)',
    name: 'Random',
    icon: '🎲',
    description: 'Random conversations and fun',
    particleColor: '#ff6b6b'
  },
  gaming: {
    gradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 50%, #fd79a8 100%)',
    cardBg: 'rgba(162, 155, 254, 0.15)',
    accent: '#a29bfe',
    accentLight: 'rgba(162, 155, 254, 0.2)',
    name: 'Gaming',
    icon: '🎮',
    description: 'Gaming discussions and reviews',
    particleColor: '#a29bfe'
  },
  default: {
    gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #6c5ce7 100%)',
    cardBg: 'rgba(116, 185, 255, 0.15)',
    accent: '#74b9ff',
    accentLight: 'rgba(116, 185, 255, 0.2)',
    name: 'Custom',
    icon: '🏠',
    description: 'Custom room space',
    particleColor: '#74b9ff'
  }
};

// Enhanced Floating Particles Component
const FloatingParticles = ({ color, count = 20 }) => {
  const particles = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        position: 'absolute',
        width: Math.random() * 4 + 2 + 'px',
        height: Math.random() * 4 + 2 + 'px',
        background: color,
        borderRadius: '50%',
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        opacity: Math.random() * 0.3 + 0.1,
        animation: `float ${Math.random() * 10 + 15}s infinite linear`,
        animationDelay: Math.random() * 10 + 's'
      }}
    />
  ));

  return (
    <>
      <style>{`
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); }
          100% { transform: translateY(-100vh) rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0, -30px, 0); }
          70% { transform: translate3d(0, -15px, 0); }
          90% { transform: translate3d(0, -4px, 0); }
        }
        .typing-indicator {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #94a3b8;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {particles}
      </div>
    </>
  );
};

// Enhanced Loading Component
const LoadingSpinner = () => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  }}>
    <div style={{
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// User Avatar Component
const UserAvatar = ({ username, size = 40, online = false }) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];
  const color = colors[username.length % colors.length];
  
  return (
    <div style={{
      position: 'relative',
      display: 'inline-block'
    }}>
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '600',
        fontSize: size * 0.4,
        textTransform: 'uppercase',
        border: '2px solid rgba(255,255,255,0.2)'
      }}>
        {username.charAt(0)}
      </div>
      {online && (
        <div style={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#22c55e',
          border: '2px solid white',
          animation: 'pulse 2s infinite'
        }} />
      )}
    </div>
  );
};

function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentTheme = () => {
    const baseTheme = roomThemes[roomId as keyof typeof roomThemes] || roomThemes.default;
    
    if (!roomThemes[roomId as keyof typeof roomThemes]) {
      const formatRoomName = (name: string) => {
        return name
          .split(/[-_\s]+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      };
      
      return {
        ...baseTheme,
        name: formatRoomName(roomId),
        description: `Custom room: ${roomId}`
      };
    }
    
    return baseTheme;
  };
  const currentTheme = getCurrentTheme();

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket('ws://localhost:8080');
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Connected to WebSocket');
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'auth') {
              setIsAuthenticated(data.success);
            } else if (data.type === 'join') {
              setInRoom(true);
              setRoomId(data.roomId);
              setMessages([]);
              setOnlineUsers(data.users || []);
            } else if (data.type === 'chat') {
              setMessages(prev => [...prev, {
                username: data.username,
                text: data.text,
                timestamp: Date.now()
              }]);
            } else if (data.type === 'typing') {
              setIsTyping(data.isTyping);
            } else if (data.type === 'users') {
              setOnlineUsers(data.users || []);
            } else if (data.error) {
              alert(`Error: ${data.error}`);
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          setIsAuthenticated(false);
          setInRoom(false);
          setOnlineUsers([]);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      } catch (error) {
        console.error('Failed to connect:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const login = () => {
    if (!username.trim() || !wsRef.current) return;

    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ username, iat: Date.now() }));
    const signature = btoa('signature');
    const token = `${header}.${payload}.${signature}`;
    
    wsRef.current.send(JSON.stringify({
      type: 'auth',
      token: token
    }));
  };

  const joinRoom = (targetRoomId: string) => {
    if (!targetRoomId.trim() || !wsRef.current) return;
    
    wsRef.current.send(JSON.stringify({
      type: 'join',
      roomId: targetRoomId.trim()
    }));
  };

  const sendMessage = () => {
    if (!message.trim() || !wsRef.current) return;

    wsRef.current.send(JSON.stringify({
      type: 'chat',
      text: message
    }));

    setMessage('');
  };

  const handleTyping = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        isTyping: true
      }));

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'typing',
            isTyping: false
          }));
        }
      }, 2000);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setInRoom(false);
    setMessages([]);
    setUsername('');
    setRoomId('');
    setOnlineUsers([]);
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  // Enhanced Login Screen
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, black 50%, #ccfb93ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <FloatingParticles color="#ffffff" count={15} />
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '48px',
          borderRadius: '32px',
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.1)',
          maxWidth: '420px',
          width: '100%',
          backdropFilter: 'blur(20px)',
          animation: 'fadeInUp 0.8s ease-out',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '40px',
              animation: 'bounce 2s infinite',
              boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
            }}>
              💬
            </div>
            <h1 style={{ 
              color: '#2d3748', 
              fontSize: '36px', 
              fontWeight: '800',
              margin: '0 0 12px 0',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              LiveChat
            </h1>
            <p style={{ color: '#718096', fontSize: '18px', margin: 0, fontWeight: '500' }}>
              Connect. Chat. Create.
            </p>
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px', 
              color: '#4a5568',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              Your Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={{
                width: '100%',
                padding: '20px 24px',
                background: 'rgba(247, 250, 252, 0.8)',
                border: '2px solid rgba(203, 213, 225, 0.5)',
                borderRadius: '16px',
                fontSize: '16px',
                color: '#2d3748',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(203, 213, 225, 0.5)';
                e.target.style.boxShadow = 'none';
              }}
              onKeyPress={(e) => e.key === 'Enter' && login()}
            />
          </div>

          <button
            onClick={login}
            disabled={!username.trim() || !isConnected}
            style={{
              width: '100%',
              padding: '20px',
              background: isConnected && username.trim()
                ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                : 'rgba(203, 213, 225, 0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: isConnected && username.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: isConnected && username.trim() ? '0 8px 32px rgba(102, 126, 234, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (isConnected && username.trim()) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = isConnected && username.trim() ? '0 8px 32px rgba(102, 126, 234, 0.3)' : 'none';
            }}
          >
            {isConnected ? (username.trim() ? 'Enter LiveChat' : 'Enter Username') : <LoadingSpinner />}
          </button>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '24px',
              fontSize: '14px',
              fontWeight: '600',
              background: isConnected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: isConnected ? '#22c55e' : '#ef4444',
              border: `2px solid ${isConnected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isConnected ? '#22c55e' : '#ef4444',
                animation: 'pulse 2s infinite'
              }} />
              {isConnected ? 'Connected' : 'Connecting...'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Room Selection Screen
  if (!inRoom) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <FloatingParticles color="#ffffff" count={12} />
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '48px',
          borderRadius: '32px',
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.2)',
          maxWidth: '800px',
          width: '100%',
          backdropFilter: 'blur(20px)',
          animation: 'fadeInUp 0.8s ease-out'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h2 style={{ 
                color: '#1e293b', 
                fontSize: '32px', 
                fontWeight: '800',
                margin: '0 0 8px 0'
              }}>
                Welcome back, {username}! 👋
              </h2>
              <p style={{ color: '#64748b', margin: 0, fontSize: '16px' }}>
                Choose your perfect conversation space
              </p>
            </div>
            <button 
              onClick={logout} 
              style={{ 
                padding: '12px 24px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: '#ef4444', 
                border: '2px solid rgba(239, 68, 68, 0.2)', 
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Logout
            </button>
          </div>

          <h3 style={{ 
            color: '#334155', 
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            🔥 Popular Rooms
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px', 
            marginBottom: '48px' 
          }}>
            {Object.entries(roomThemes).filter(([key]) => key !== 'default').map(([roomKey, theme]) => (
              <button
                key={roomKey}
                onClick={() => joinRoom(roomKey)}
                style={{
                  padding: '24px',
                  background: `linear-gradient(135deg, ${theme.cardBg}, rgba(255,255,255,0.1))`,
                  border: `2px solid ${theme.accentLight}`,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-6px) scale(1.02)';
                  e.target.style.boxShadow = `0 25px 50px ${theme.accentLight}`;
                  e.target.style.borderColor = theme.accent;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = theme.accentLight;
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentLight})`
                }} />
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  marginBottom: '12px'
                }}>
                  <span style={{ 
                    fontSize: '32px',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}>
                    {theme.icon}
                  </span>
                  <h4 style={{ 
                    color: '#1e293b', 
                    fontSize: '20px',
                    fontWeight: '700',
                    margin: 0 
                  }}>
                    {theme.name}
                  </h4>
                </div>
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {theme.description}
                </p>
              </button>
            ))}
          </div>

          <h3 style={{ 
            color: '#334155', 
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            ⚡ Create Custom Room
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="my-awesome-room"
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '18px 24px',
                background: 'rgba(248, 250, 252, 0.8)',
                border: '2px solid rgba(203, 213, 225, 0.5)',
                borderRadius: '16px',
                fontSize: '16px',
                color: '#1e293b',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0284c7';
                e.target.style.boxShadow = '0 0 0 4px rgba(2, 132, 199, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(203, 213, 225, 0.5)';
                e.target.style.boxShadow = 'none';
              }}
              onKeyPress={(e) => e.key === 'Enter' && roomId.trim() && joinRoom(roomId)}
            />
            <button
              onClick={() => roomId.trim() && joinRoom(roomId)}
              disabled={!roomId.trim()}
              style={{
                padding: '18px 32px',
                background: roomId.trim() 
                  ? 'linear-gradient(135deg, #0284c7, #0369a1)' 
                  : 'rgba(203, 213, 225, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                cursor: roomId.trim() ? 'pointer' : 'not-allowed',
                fontWeight: '700',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                boxShadow: roomId.trim() ? '0 8px 25px rgba(2, 132, 199, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (roomId.trim()) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(2, 132, 199, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = roomId.trim() ? '0 8px 25px rgba(2, 132, 199, 0.3)' : 'none';
              }}
            >
              Create & Join
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Chat Screen
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: currentTheme.gradient,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <FloatingParticles color={currentTheme.particleColor} count={8} />
      
      {/* Enhanced Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '20px 32px',
        borderBottom: `3px solid ${currentTheme.accent}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            padding: '12px',
            background: `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.accentLight})`,
            borderRadius: '16px',
            fontSize: '28px',
            boxShadow: `0 8px 25px ${currentTheme.accentLight}`
          }}>
            {currentTheme.icon}
          </div>
          <div>
            <h3 style={{ 
              color: '#1e293b', 
              fontSize: '28px',
              fontWeight: '800',
              margin: '0 0 4px 0'
            }}>
              {currentTheme.name}
            </h3>
            <p style={{ 
              color: '#64748b', 
              fontSize: '14px',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {currentTheme.description}
              <span style={{
                padding: '4px 12px',
                background: currentTheme.accentLight,
                color: currentTheme.accent,
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {onlineUsers.length} online
              </span>
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Online users display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(248, 250, 252, 0.8)',
            borderRadius: '20px',
            border: '1px solid rgba(203, 213, 225, 0.5)'
          }}>
            <UserAvatar username={username} size={32} online={true} />
            <span style={{
              color: '#1e293b',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {username}
            </span>
          </div>
          
          <button 
            onClick={() => setInRoom(false)} 
            style={{ 
              padding: '12px 20px', 
              background: 'rgba(107, 114, 128, 0.1)', 
              color: '#6b7280', 
              border: '2px solid rgba(107, 114, 128, 0.2)', 
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(107, 114, 128, 0.2)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(107, 114, 128, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Switch Room
          </button>
          
          <button 
            onClick={logout} 
            style={{ 
              padding: '12px 20px', 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              border: '2px solid rgba(239, 68, 68, 0.2)', 
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.2)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Enhanced Messages Area */}
      <div style={{
        flex: 1,
        padding: '32px',
        overflowY: 'auto',
        background: 'rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'rgba(255, 255, 255, 0.8)', 
            marginTop: '120px',
            animation: 'fadeInUp 1s ease-out'
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '24px',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }}>
              {currentTheme.icon}
            </div>
            <h3 style={{ 
              color: 'white', 
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 16px 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Welcome to {currentTheme.name}! 🎉
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '18px',
              opacity: 0.9
            }}>
              Start the conversation and connect with others
            </p>
          </div>
        ) : (
          <div>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                style={{
                  marginBottom: '24px',
                  display: 'flex',
                  justifyContent: msg.username === username ? 'flex-end' : 'flex-start',
                  animation: `${msg.username === username ? 'slideInRight' : 'slideIn'} 0.3s ease-out`
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  maxWidth: '70%',
                  flexDirection: msg.username === username ? 'row-reverse' : 'row'
                }}>
                  <UserAvatar username={msg.username} size={40} />
                  
                  <div style={{
                    background: msg.username === username 
                      ? `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.accent}dd)` 
                      : 'rgba(255, 255, 255, 0.95)',
                    color: msg.username === username ? 'white' : '#1e293b',
                    padding: '16px 20px',
                    borderRadius: msg.username === username ? '24px 24px 8px 24px' : '24px 24px 24px 8px',
                    backdropFilter: 'blur(10px)',
                    border: msg.username === username 
                      ? 'none' 
                      : '1px solid rgba(203, 213, 225, 0.3)',
                    boxShadow: msg.username === username
                      ? `0 8px 25px ${currentTheme.accentLight}`
                      : '0 8px 25px rgba(0,0,0,0.1)',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      fontSize: '12px', 
                      opacity: 0.8, 
                      marginBottom: '8px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {msg.username}
                      <span style={{ opacity: 0.6 }}>•</span>
                      <span style={{ opacity: 0.6 }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div style={{ 
                      fontSize: '16px',
                      lineHeight: '1.5',
                      fontWeight: '500'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div style={{
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'flex-start',
                animation: 'fadeInUp 0.3s ease-out'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <UserAvatar username="typing" size={32} />
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '12px 20px',
                    borderRadius: '24px 24px 24px 8px',
                    border: '1px solid rgba(203, 213, 225, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                      Someone is typing
                    </span>
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Enhanced Message Input */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '24px 32px',
        borderTop: `1px solid ${currentTheme.accentLight.replace('0.2', '0.3')}`,
        display: 'flex',
        gap: '16px',
        backdropFilter: 'blur(20px)',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder={`Share your thoughts in ${currentTheme.name}...`}
            style={{
              width: '100%',
              padding: '18px 24px',
              background: 'rgba(248, 250, 252, 0.8)',
              border: '2px solid rgba(203, 213, 225, 0.5)',
              borderRadius: '28px',
              fontSize: '16px',
              color: '#1e293b',
              outline: 'none',
              transition: 'all 0.3s ease',
              fontWeight: '500'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = currentTheme.accent;
              e.target.style.boxShadow = `0 0 0 4px ${currentTheme.accentLight}`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(203, 213, 225, 0.5)';
              e.target.style.boxShadow = 'none';
            }}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
        </div>
        
        <button
          onClick={sendMessage}
          disabled={!message.trim()}
          style={{
            padding: '18px 28px',
            background: message.trim() 
              ? `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.accent}dd)` 
              : 'rgba(203, 213, 225, 0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '28px',
            cursor: message.trim() ? 'pointer' : 'not-allowed',
            fontWeight: '700',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: message.trim() ? `0 8px 25px ${currentTheme.accentLight}` : 'none'
          }}
          onMouseEnter={(e) => {
            if (message.trim()) {
              e.target.style.transform = 'scale(1.05) translateY(-2px)';
              e.target.style.boxShadow = `0 12px 35px ${currentTheme.accentLight}`;
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1) translateY(0)';
            e.target.style.boxShadow = message.trim() ? `0 8px 25px ${currentTheme.accentLight}` : 'none';
          }}
        >
          <span>Send</span>
          <span style={{ fontSize: '18px' }}>🚀</span>
        </button>
      </div>
    </div>
  );
}

export default App;