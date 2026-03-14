import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import messageService from '../services/messageService';
import { toast } from 'react-toastify';
import {
  FaPaperPlane, FaSearch, FaArrowLeft,
  FaCircle, FaSpinner, FaTrash, FaHome,
  FaUser, FaBars, FaTimes, FaComments,
} from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b3e;
    --navy2: #112255;
    --orange: #e8501a;
    --orange-light: #ff6b3d;
    --orange-pale: #fff3ef;
    --white: #ffffff;
    --gray-bg: #f4f6fa;
    --gray-light: #e4e6eb;
    --text-dark: #111827;
    --text-mid: #4b5563;
    --text-light: #9ca3af;
    --success: #059669;
    --success-pale: #ecfdf5;
    --danger: #dc2626;
    --card-radius: 16px;
    --transition: all 0.2s ease;
    --mine-bubble: linear-gradient(135deg, #e8501a, #ff6b3d);
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 20px rgba(0,0,0,0.1);
  }

  html, body { font-family: 'Manrope', sans-serif; height: 100%; overflow: hidden; }

  /* ── TOPBAR ── */
  .msg-topbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    height: 64px; background: var(--navy);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem;
    box-shadow: 0 2px 20px rgba(0,0,0,0.3);
  }
  .msg-topbar-left { display: flex; align-items: center; gap: 0.75rem; }
  .msg-topbar-logo { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; }
  .msg-topbar-logo img { width: 36px; height: 36px; border-radius: 9px; object-fit: cover; border: 2px solid rgba(255,255,255,0.15); }
  .msg-topbar-logo span { font-size: 1.05rem; font-weight: 800; color: white; letter-spacing: -0.3px; }
  .msg-topbar-badge { font-size: 0.6rem; font-weight: 700; background: rgba(232,80,26,0.3); color: #ffb49a; border: 1px solid rgba(232,80,26,0.5); padding: 2px 8px; border-radius: 20px; letter-spacing: 1px; text-transform: uppercase; }
  .msg-back-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: white; width: 36px; height: 36px; border-radius: 9px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
  .msg-back-btn:hover { background: rgba(255,255,255,0.2); }
  .msg-topbar-right { display: flex; align-items: center; gap: 0.5rem; }
  .msg-online-indicator { display: flex; align-items: center; gap: 0.4rem; background: rgba(5,150,105,0.2); border: 1px solid rgba(5,150,105,0.3); border-radius: 20px; padding: 4px 10px; }
  .msg-online-indicator span { font-size: 0.72rem; font-weight: 700; color: #6ee7b7; }

  /* ── LAYOUT ── */
  .msg-layout {
    display: flex;
    height: 100vh;
    padding-top: 64px;
    overflow: hidden;
  }

  /* ── SIDEBAR ── */
  .msg-sidebar {
    width: 360px; min-width: 360px;
    background: white;
    border-right: 1px solid var(--gray-light);
    display: flex; flex-direction: column;
    overflow: hidden;
    box-shadow: 2px 0 10px rgba(0,0,0,0.04);
  }

  .msg-sidebar-head {
    padding: 1.25rem 1.25rem 0.9rem;
    background: white;
    border-bottom: 1px solid var(--gray-light);
  }

  .msg-sidebar-title-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1rem;
  }
  .msg-sidebar-title { font-size: 1.2rem; font-weight: 900; color: var(--navy); }
  .msg-conv-count { background: var(--orange-pale); color: var(--orange); font-size: 0.72rem; font-weight: 800; padding: 3px 9px; border-radius: 20px; }

  .msg-search {
    display: flex; align-items: center; gap: 0.6rem;
    background: var(--gray-bg); border: 1.5px solid var(--gray-light);
    border-radius: 12px; padding: 0.6rem 1rem;
    transition: var(--transition);
  }
  .msg-search:focus-within { border-color: var(--orange); background: white; box-shadow: 0 0 0 3px rgba(232,80,26,0.08); }
  .msg-search input { border: none; outline: none; background: none; font-family: 'Manrope', sans-serif; font-size: 0.875rem; color: var(--text-dark); width: 100%; }
  .msg-search input::placeholder { color: var(--text-light); }
  .msg-search svg { color: var(--text-light); flex-shrink: 0; }

  /* Conversation list */
  .msg-conv-list { flex: 1; overflow-y: auto; }
  .msg-conv-list::-webkit-scrollbar { width: 4px; }
  .msg-conv-list::-webkit-scrollbar-track { background: transparent; }
  .msg-conv-list::-webkit-scrollbar-thumb { background: var(--gray-light); border-radius: 4px; }

  .msg-conv-item {
    display: flex; align-items: center; gap: 0.9rem;
    padding: 1rem 1.25rem; cursor: pointer;
    transition: var(--transition);
    border-bottom: 1px solid rgba(228,230,235,0.6);
    position: relative;
  }
  .msg-conv-item:hover { background: #fdf8f6; }
  .msg-conv-item.active {
    background: var(--orange-pale);
    border-left: 3px solid var(--orange);
  }
  .msg-conv-item.active .msg-conv-name { color: var(--orange); }

  .msg-avatar {
    width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--navy), #1a3fa4);
    color: white; display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 800; position: relative; overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .msg-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .msg-avatar.owner-avatar { background: linear-gradient(135deg, #065f46, #059669); }
  .msg-avatar.student-avatar { background: linear-gradient(135deg, var(--navy), #1a3fa4); }

  .msg-online-dot {
    position: absolute; bottom: 2px; right: 2px;
    width: 12px; height: 12px; border-radius: 50%;
    background: var(--success); border: 2px solid white;
    animation: pulse-online 2s infinite;
  }
  @keyframes pulse-online { 0%,100% { box-shadow: 0 0 0 0 rgba(5,150,105,0.4); } 50% { box-shadow: 0 0 0 4px rgba(5,150,105,0); } }

  .msg-conv-info { flex: 1; min-width: 0; }
  .msg-conv-name { font-size: 0.9rem; font-weight: 700; color: var(--text-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
  .msg-conv-hostel { font-size: 0.72rem; color: var(--orange); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; display: flex; align-items: center; gap: 0.25rem; }
  .msg-conv-preview { font-size: 0.78rem; color: var(--text-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .msg-conv-preview.unread { color: var(--text-dark); font-weight: 700; }

  .msg-conv-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem; flex-shrink: 0; }
  .msg-conv-time { font-size: 0.68rem; color: var(--text-light); }
  .msg-unread-badge { background: var(--orange); color: white; border-radius: 20px; min-width: 20px; height: 20px; padding: 0 6px; font-size: 0.68rem; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(232,80,26,0.4); }

  /* Empty state */
  .msg-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 3rem 1.5rem; text-align: center; flex: 1;
    gap: 0.75rem;
  }
  .msg-empty-ico { width: 70px; height: 70px; background: var(--orange-pale); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: var(--orange); }
  .msg-empty h4 { font-size: 1rem; font-weight: 800; color: var(--navy); }
  .msg-empty p { font-size: 0.82rem; color: var(--text-mid); line-height: 1.6; max-width: 220px; }

  /* ── CHAT AREA ── */
  .msg-chat {
    flex: 1; display: flex; flex-direction: column;
    overflow: hidden; background: #f0f2f5;
    background-image: radial-gradient(circle at 20px 20px, rgba(232,80,26,0.03) 1px, transparent 0),
                      radial-gradient(circle at 60px 60px, rgba(13,27,62,0.02) 1px, transparent 0);
    background-size: 80px 80px;
  }

  /* Chat Header */
  .msg-chat-head {
    background: white; border-bottom: 1px solid var(--gray-light);
    padding: 0.9rem 1.5rem;
    display: flex; align-items: center; gap: 1rem;
    box-shadow: var(--shadow-sm);
  }
  .msg-chat-head-info { flex: 1; min-width: 0; }
  .msg-chat-head-name { font-size: 1rem; font-weight: 800; color: var(--navy); }
  .msg-chat-head-sub { display: flex; align-items: center; gap: 0.5rem; margin-top: 2px; flex-wrap: wrap; }
  .msg-online-badge { display: flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; font-weight: 600; color: var(--success); }
  .msg-offline-badge { font-size: 0.75rem; color: var(--text-light); font-weight: 500; }
  .msg-hostel-chip { display: inline-flex; align-items: center; gap: 0.3rem; background: var(--orange-pale); color: var(--orange); border-radius: 8px; padding: 3px 10px; font-size: 0.72rem; font-weight: 700; border: 1px solid rgba(232,80,26,0.2); }

  .msg-chat-actions { display: flex; gap: 0.4rem; }
  .msg-act-btn { background: var(--gray-bg); border: 1px solid var(--gray-light); border-radius: 9px; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-mid); transition: var(--transition); }
  .msg-act-btn:hover { background: #fef2f2; color: var(--danger); border-color: #fecaca; }

  /* Messages */
  .msg-messages {
    flex: 1; overflow-y: auto; padding: 1.5rem 1.25rem;
    display: flex; flex-direction: column; gap: 0.35rem;
  }
  .msg-messages::-webkit-scrollbar { width: 4px; }
  .msg-messages::-webkit-scrollbar-track { background: transparent; }
  .msg-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }

  /* Date separator */
  .msg-date-sep {
    display: flex; align-items: center; gap: 0.75rem; margin: 1rem 0;
  }
  .msg-date-sep::before, .msg-date-sep::after { content: ''; flex: 1; height: 1px; background: rgba(0,0,0,0.08); }
  .msg-date-sep span { font-size: 0.7rem; font-weight: 700; color: var(--text-light); white-space: nowrap; background: rgba(255,255,255,0.8); padding: 3px 10px; border-radius: 20px; border: 1px solid var(--gray-light); }

  /* Bubble wrapper */
  .msg-row { display: flex; align-items: flex-end; gap: 0.5rem; max-width: 72%; margin-bottom: 0.15rem; }
  .msg-row.mine { align-self: flex-end; flex-direction: row-reverse; }
  .msg-row.theirs { align-self: flex-start; }
  .msg-row.consecutive { margin-bottom: 1px; }

  .msg-bubble-avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, var(--navy), #1a3fa4); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800; flex-shrink: 0; overflow: hidden; }
  .msg-bubble-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .msg-bubble-avatar.hidden { visibility: hidden; }

  .msg-bubble {
    padding: 0.7rem 1rem; border-radius: 18px;
    font-size: 0.875rem; line-height: 1.55;
    word-break: break-word; position: relative;
    max-width: 100%;
  }
  .msg-bubble.mine {
    background: var(--mine-bubble); color: white;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 12px rgba(232,80,26,0.3);
  }
  .msg-bubble.theirs {
    background: white; color: var(--text-dark);
    border-bottom-left-radius: 4px;
    box-shadow: var(--shadow-sm);
  }
  .msg-bubble-time {
    font-size: 0.62rem; margin-top: 0.3rem; display: block;
  }
  .msg-bubble.mine .msg-bubble-time { color: rgba(255,255,255,0.65); text-align: right; }
  .msg-bubble.theirs .msg-bubble-time { color: var(--text-light); text-align: left; }

  /* Typing */
  .msg-typing-wrap { display: flex; align-items: center; gap: 0.5rem; align-self: flex-start; padding: 0.4rem 0; }
  .msg-typing-bubble { background: white; border-radius: 18px; border-bottom-left-radius: 4px; padding: 0.65rem 1rem; box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 0.5rem; }
  .msg-typing-name { font-size: 0.72rem; color: var(--text-light); font-style: italic; }
  .typing-dots { display: flex; gap: 3px; align-items: center; }
  .typing-dots span { width: 7px; height: 7px; border-radius: 50%; background: var(--orange); opacity: 0.6; animation: typing-bounce 1.2s infinite; }
  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typing-bounce { 0%,80%,100% { transform: translateY(0); opacity: 0.6; } 40% { transform: translateY(-6px); opacity: 1; } }

  /* Input area */
  .msg-input-area {
    background: white; border-top: 1px solid var(--gray-light);
    padding: 1rem 1.25rem;
    display: flex; align-items: flex-end; gap: 0.75rem;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.04);
  }
  .msg-input-wrap {
    flex: 1; background: var(--gray-bg);
    border: 1.5px solid var(--gray-light); border-radius: 14px;
    padding: 0.7rem 1rem; transition: var(--transition);
  }
  .msg-input-wrap:focus-within { border-color: var(--orange); background: white; box-shadow: 0 0 0 3px rgba(232,80,26,0.08); }
  .msg-input-wrap textarea {
    width: 100%; border: none; outline: none; background: none;
    font-family: 'Manrope', sans-serif; font-size: 0.875rem;
    color: var(--text-dark); resize: none; max-height: 120px; line-height: 1.55;
  }
  .msg-input-wrap textarea::placeholder { color: var(--text-light); }
  .msg-send-btn {
    width: 46px; height: 46px; border-radius: 14px;
    background: linear-gradient(135deg, var(--orange), var(--orange-light));
    border: none; color: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; transition: var(--transition); flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(232,80,26,0.4);
  }
  .msg-send-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(232,80,26,0.5); }
  .msg-send-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

  /* No chat selected */
  .msg-no-chat {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 2rem;
    background: #f0f2f5;
  }
  .msg-no-chat-ico {
    width: 100px; height: 100px;
    background: white; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; margin: 0 auto 1.5rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  }
  .msg-no-chat h3 { font-size: 1.3rem; font-weight: 800; color: var(--navy); margin-bottom: 0.5rem; }
  .msg-no-chat p { color: var(--text-mid); font-size: 0.88rem; max-width: 280px; line-height: 1.6; }

  /* Loading */
  .msg-loading { display: flex; align-items: center; justify-content: center; padding: 3rem; gap: 0.75rem; }
  .msg-spinner { animation: spin 0.8s linear infinite; color: var(--orange); font-size: 1.6rem; }
  .msg-loading p { color: var(--text-mid); font-size: 0.88rem; font-weight: 600; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Mobile */
  @media (max-width: 768px) {
    .msg-sidebar { position: absolute; z-index: 50; height: calc(100vh - 64px); transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); width: 100%; min-width: 0; }
    .msg-sidebar.hidden { transform: translateX(-100%); }
    .msg-mobile-back { display: flex !important; }
    .msg-chat { width: 100%; }
    .msg-row { max-width: 85%; }
  }
`;

// ── HELPERS ───────────────────────────────────────
const formatTime = (date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const formatConvTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return formatTime(date);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const formatDate = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
};

const groupMessagesByDate = (messages) => {
  const groups = [];
  let lastDate = null;
  messages.forEach((msg) => {
    const date = formatDate(msg.createdAt);
    if (date !== lastDate) { groups.push({ type: 'date', label: date }); lastDate = date; }
    groups.push({ type: 'message', data: msg });
  });
  return groups;
};

// ── MAIN COMPONENT ────────────────────────────────
const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const {
    socket, joinConversation, leaveConversation,
    sendSocketMessage, startTyping, stopTyping, isUserOnline,
  } = useSocket();

  const [conversations,      setConversations]      = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages,           setMessages]           = useState([]);
  const [inputText,          setInputText]          = useState('');
  const [searchQuery,        setSearchQuery]        = useState('');
  const [loadingConvs,       setLoadingConvs]       = useState(true);
  const [loadingMsgs,        setLoadingMsgs]        = useState(false);
  const [sending,            setSending]            = useState(false);
  const [typingUser,         setTypingUser]         = useState(null);
  const [showSidebar,        setShowSidebar]        = useState(true);

  const messagesEndRef   = useRef(null);
  const textareaRef      = useRef(null);
  const typingTimeout    = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setLoadingConvs(true);
      const data = await messageService.getConversations();
      setConversations(data.data || []);
    } catch {
      toast.error('Failed to load conversations');
    } finally {
      setLoadingConvs(false);
    }
  }, []);

  useEffect(() => { loadConversations(); }, []);

  // Open conversation from URL
  useEffect(() => {
    const convId = searchParams.get('conversation');
    if (convId && conversations.length > 0) {
      const conv = conversations.find((c) => c._id === convId);
      if (conv) openConversation(conv);
    }
  }, [searchParams, conversations]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const onReceive = (message) => {
      setMessages((prev) => [...prev, message]);
      setTimeout(scrollToBottom, 50);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === message.conversation
            ? { ...c, lastMessage: { text: message.text, createdAt: message.createdAt } }
            : c
        )
      );
    };

    const onTypingStart = ({ name }) => setTypingUser(name);
    const onTypingStop  = ()         => setTypingUser(null);

    socket.on('message:receive', onReceive);
    socket.on('typing:start',    onTypingStart);
    socket.on('typing:stop',     onTypingStop);

    return () => {
      socket.off('message:receive', onReceive);
      socket.off('typing:start',    onTypingStart);
      socket.off('typing:stop',     onTypingStop);
    };
  }, [socket]);

  const openConversation = async (conv) => {
    if (activeConversation?._id === conv._id) return;
    if (activeConversation) leaveConversation(activeConversation._id);

    setActiveConversation(conv);
    setMessages([]);
    setLoadingMsgs(true);
    setShowSidebar(false);
    joinConversation(conv._id);

    try {
      const data = await messageService.getMessages(conv._id);
      setMessages(data.data || []);
      setTimeout(scrollToBottom, 100);
      setConversations((prev) =>
        prev.map((c) => c._id === conv._id ? { ...c, unreadCount: {} } : c)
      );
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoadingMsgs(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !activeConversation || sending) return;
    const text = inputText.trim();
    setInputText('');
    setSending(true);

    const tempMsg = {
      _id: 'temp_' + Date.now(),
      text,
      sender: { _id: user._id, firstName: user.firstName, profilePicture: user.profilePicture },
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    setTimeout(scrollToBottom, 50);

    try {
      const data = await messageService.sendMessage(activeConversation._id, text);
      const real = data.data;
      setMessages((prev) => prev.map((m) => m._id === tempMsg._id ? real : m));
      sendSocketMessage(activeConversation._id, real);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConversation._id
            ? { ...c, lastMessage: { text, createdAt: new Date() } }
            : c
        )
      );
    } catch {
      setMessages((prev) => prev.filter((m) => m._id !== tempMsg._id));
      toast.error('Failed to send message');
      setInputText(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (activeConversation) {
      startTyping(activeConversation._id);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => stopTyping(activeConversation._id), 1500);
    }
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'; }
  };

  const getOther = (conv) =>
    conv.participants?.find((p) => p._id !== user?._id);

  const getUnread = (conv) => {
    try {
      if (conv.unreadCount instanceof Map) return conv.unreadCount.get(user?._id) || 0;
      return conv.unreadCount?.[user?._id] || 0;
    } catch { return 0; }
  };

  const handleDeleteConversation = async (conv) => {
    if (!window.confirm(`Delete conversation with ${getOther(conv)?.firstName}?`)) return;
    try {
      await messageService.deleteConversation(conv._id);
      setConversations((prev) => prev.filter((c) => c._id !== conv._id));
      if (activeConversation?._id === conv._id) setActiveConversation(null);
      toast.success('Conversation deleted');
    } catch {
      toast.error('Failed to delete conversation');
    }
  };

  const filtered = conversations.filter((conv) => {
    const other = getOther(conv);
    const name = `${other?.firstName || ''} ${other?.lastName || ''}`.toLowerCase();
    const hostel = conv.hostel?.name?.toLowerCase() || '';
    return name.includes(searchQuery.toLowerCase()) || hostel.includes(searchQuery.toLowerCase());
  });

  const grouped = groupMessagesByDate(messages);

  return (
    <>
      <style>{styles}</style>

      {/* TOPBAR */}
      <nav className="msg-topbar">
        <div className="msg-topbar-left">
          <button className="msg-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <a href="/" className="msg-topbar-logo">
            <img src="/PezaHostelLogo.png" alt="PezaHostel" />
            <span>PezaHostel</span>
          </a>
          <span className="msg-topbar-badge">Messages</span>
        </div>
        <div className="msg-topbar-right">
          <div className="msg-online-indicator">
            <FaCircle style={{ fontSize: '0.5rem', color: '#6ee7b7' }} />
            <span>{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </nav>

      <div className="msg-layout">

        {/* ── SIDEBAR ── */}
        <div className={`msg-sidebar${!showSidebar ? ' hidden' : ''}`}>
          <div className="msg-sidebar-head">
            <div className="msg-sidebar-title-row">
              <span className="msg-sidebar-title">💬 Chats</span>
              {filtered.length > 0 && (
                <span className="msg-conv-count">{filtered.length}</span>
              )}
            </div>
            <div className="msg-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search people or hostels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="msg-conv-list">
            {loadingConvs ? (
              <div className="msg-loading">
                <FaSpinner className="msg-spinner" />
                <p>Loading chats...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="msg-empty">
                <div className="msg-empty-ico">💬</div>
                <h4>No conversations yet</h4>
                <p>Browse hostels and tap "Contact Owner" to start chatting</p>
              </div>
            ) : (
              filtered.map((conv) => {
                const other   = getOther(conv);
                const unread  = getUnread(conv);
                const online  = isUserOnline(other?._id);
                const isActive = activeConversation?._id === conv._id;

                return (
                  <div
                    key={conv._id}
                    className={`msg-conv-item${isActive ? ' active' : ''}`}
                    onClick={() => openConversation(conv)}
                  >
                    <div className={`msg-avatar ${other?.role === 'owner' ? 'owner-avatar' : 'student-avatar'}`}>
                      {other?.profilePicture
                        ? <img src={other.profilePicture} alt={other.firstName} />
                        : (other?.firstName?.[0] || '?').toUpperCase()
                      }
                      {online && <span className="msg-online-dot" />}
                    </div>

                    <div className="msg-conv-info">
                      <div className="msg-conv-name">
                        {other?.firstName} {other?.lastName}
                        {other?.role === 'owner' && (
                          <span style={{ fontSize: '0.68rem', color: 'var(--success)', fontWeight: 700, marginLeft: 5 }}>
                            · Owner
                          </span>
                        )}
                      </div>
                      <div className="msg-conv-hostel">
                        🏠 {conv.hostel?.name}
                      </div>
                      <div className={`msg-conv-preview${unread > 0 ? ' unread' : ''}`}>
                        {conv.lastMessage?.text || 'Tap to start chatting'}
                      </div>
                    </div>

                    <div className="msg-conv-meta">
                      <span className="msg-conv-time">
                        {formatConvTime(conv.lastMessage?.createdAt || conv.updatedAt)}
                      </span>
                      {unread > 0 && (
                        <span className="msg-unread-badge">{unread > 99 ? '99+' : unread}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div className="msg-chat">
          {!activeConversation ? (
            <div className="msg-no-chat">
              <div className="msg-no-chat-ico">💬</div>
              <h3>Your messages</h3>
              <p>Select a conversation to read and reply to messages from students and owners</p>
            </div>
          ) : (
            <>
              {/* Header */}
              {(() => {
                const other  = getOther(activeConversation);
                const online = isUserOnline(other?._id);
                return (
                  <div className="msg-chat-head">
                    <button
                      className="msg-back-btn"
                      style={{ display: 'none' }}
                      id="mobile-back"
                      onClick={() => setShowSidebar(true)}
                    >
                      <FaArrowLeft />
                    </button>

                    <div className={`msg-avatar ${other?.role === 'owner' ? 'owner-avatar' : 'student-avatar'}`}
                      style={{ width: 42, height: 42, fontSize: '0.9rem' }}>
                      {other?.profilePicture
                        ? <img src={other.profilePicture} alt={other.firstName} />
                        : (other?.firstName?.[0] || '?').toUpperCase()
                      }
                      {online && <span className="msg-online-dot" />}
                    </div>

                    <div className="msg-chat-head-info">
                      <div className="msg-chat-head-name">
                        {other?.firstName} {other?.lastName}
                      </div>
                      <div className="msg-chat-head-sub">
                        {online
                          ? <span className="msg-online-badge"><FaCircle style={{ fontSize: '0.45rem' }} /> Online now</span>
                          : <span className="msg-offline-badge">Offline</span>
                        }
                        <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>·</span>
                        <span className="msg-hostel-chip">🏠 {activeConversation.hostel?.name}</span>
                      </div>
                    </div>

                    <div className="msg-chat-actions">
                      <button
                        className="msg-act-btn"
                        title="Delete conversation"
                        onClick={() => handleDeleteConversation(activeConversation)}
                      >
                        <FaTrash style={{ fontSize: '0.8rem' }} />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Messages */}
              <div className="msg-messages">
                {loadingMsgs ? (
                  <div className="msg-loading">
                    <FaSpinner className="msg-spinner" />
                    <p>Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👋</div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      Say hello to {getOther(activeConversation)?.firstName}!
                    </p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>
                      This is the beginning of your conversation about{' '}
                      <strong>{activeConversation.hostel?.name}</strong>
                    </p>
                  </div>
                ) : (
                  grouped.map((item, idx) => {
                    if (item.type === 'date') {
                      return (
                        <div key={`d-${idx}`} className="msg-date-sep">
                          <span>{item.label}</span>
                        </div>
                      );
                    }

                    const msg    = item.data;
                    const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                    const nextItem = grouped[idx + 1];
                    const isLast = !nextItem || nextItem.type === 'date' ||
                      (nextItem.type === 'message' &&
                        (nextItem.data.sender?._id !== msg.sender?._id));

                    return (
                      <div
                        key={msg._id}
                        className={`msg-row ${isMine ? 'mine' : 'theirs'}${!isLast ? ' consecutive' : ''}`}
                      >
                        {!isMine && (
                          <div className={`msg-bubble-avatar${!isLast ? ' hidden' : ''}`}>
                            {msg.sender?.profilePicture
                              ? <img src={msg.sender.profilePicture} alt="" />
                              : (msg.sender?.firstName?.[0] || '?').toUpperCase()
                            }
                          </div>
                        )}
                        <div className={`msg-bubble ${isMine ? 'mine' : 'theirs'}`}>
                          {msg.text}
                          <span className="msg-bubble-time">{formatTime(msg.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })
                )}

                {typingUser && (
                  <div className="msg-typing-wrap">
                    <div className="msg-bubble-avatar">
                      {getOther(activeConversation)?.firstName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="msg-typing-bubble">
                      <div className="typing-dots">
                        <span /><span /><span />
                      </div>
                      <span className="msg-typing-name">{typingUser} is typing</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="msg-input-area">
                <div className="msg-input-wrap">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    placeholder={`Message ${getOther(activeConversation)?.firstName}...`}
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <button
                  className="msg-send-btn"
                  onClick={handleSend}
                  disabled={!inputText.trim() || sending}
                  title="Send message"
                >
                  {sending
                    ? <FaSpinner style={{ animation: 'spin 0.8s linear infinite' }} />
                    : <FaPaperPlane />
                  }
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;