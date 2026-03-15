import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import messageService from '../services/messageService';
import { toast } from 'react-toastify';
import {
  FaPaperPlane, FaSearch, FaArrowLeft,
  FaCircle, FaSpinner, FaTrash,
  FaEllipsisV, FaSmile, FaCheck, FaCheckDouble,
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
    --gray-bg: #f0f2f5;
    --gray-light: #e4e6eb;
    --text-dark: #111827;
    --text-mid: #4b5563;
    --text-light: #9ca3af;
    --success: #059669;
    --danger: #dc2626;
    --mine-bg: #e8501a;
    --theirs-bg: #ffffff;
    --chat-bg: #efeae2;
    --sidebar-bg: #ffffff;
    --header-bg: #0d1b3e;
  }

  html, body, #root {
    height: 100%;
    overflow: hidden;
    font-family: 'Manrope', sans-serif;
  }

  /* ── FULL PAGE WRAPPER ── */
  .wa-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background: var(--chat-bg);
  }

  /* ── TOP HEADER ── */
  .wa-header {
    background: var(--header-bg);
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.25rem;
    flex-shrink: 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    z-index: 100;
  }
  .wa-header-left { display: flex; align-items: center; gap: 0.75rem; }
  .wa-header-logo { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; }
  .wa-header-logo img { width: 34px; height: 34px; border-radius: 8px; object-fit: cover; }
  .wa-header-logo span { font-size: 1rem; font-weight: 800; color: white; }
  .wa-header-badge { font-size: 0.58rem; font-weight: 700; background: rgba(232,80,26,0.3); color: #ffb49a; border: 1px solid rgba(232,80,26,0.4); padding: 2px 7px; border-radius: 20px; letter-spacing: 0.8px; text-transform: uppercase; }
  .wa-back-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: white; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 0.9rem; }
  .wa-back-btn:hover { background: rgba(255,255,255,0.2); }

  /* ── MAIN BODY ── */
  .wa-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* ── LEFT PANEL (conversation list) ── */
  .wa-left {
    width: 380px;
    min-width: 380px;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--gray-light);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .wa-left-head {
    background: #f0f2f5;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--gray-light);
  }

  .wa-left-title {
    font-size: 1.1rem;
    font-weight: 900;
    color: var(--navy);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .wa-conv-count {
    font-size: 0.72rem;
    font-weight: 700;
    background: var(--orange-pale);
    color: var(--orange);
    padding: 2px 8px;
    border-radius: 20px;
  }

  .wa-search {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: white;
    border: 1.5px solid var(--gray-light);
    border-radius: 10px;
    padding: 0.55rem 0.9rem;
    transition: all 0.2s;
  }
  .wa-search:focus-within {
    border-color: var(--orange);
    box-shadow: 0 0 0 3px rgba(232,80,26,0.08);
  }
  .wa-search input {
    border: none; outline: none; background: none;
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem; color: var(--text-dark); width: 100%;
  }
  .wa-search input::placeholder { color: var(--text-light); }
  .wa-search svg { color: var(--text-light); flex-shrink: 0; font-size: 0.85rem; }

  /* Conv list */
  .wa-conv-list {
    flex: 1;
    overflow-y: auto;
  }
  .wa-conv-list::-webkit-scrollbar { width: 3px; }
  .wa-conv-list::-webkit-scrollbar-thumb { background: var(--gray-light); border-radius: 3px; }

  .wa-conv-item {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.85rem 1rem;
    cursor: pointer;
    transition: background 0.15s;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    position: relative;
  }
  .wa-conv-item:hover { background: #f5f5f5; }
  .wa-conv-item.active { background: #ffe8e0; }
  .wa-conv-item.active::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--orange);
    border-radius: 0 2px 2px 0;
  }

  /* Avatar */
  .wa-avatar {
    width: 50px; height: 50px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 800;
    color: white; overflow: hidden;
    position: relative;
  }
  .wa-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .wa-avatar.owner { background: linear-gradient(135deg, #065f46, #059669); }
  .wa-avatar.student { background: linear-gradient(135deg, #0d1b3e, #1a3fa4); }
  .wa-avatar-online {
    position: absolute; bottom: 2px; right: 2px;
    width: 12px; height: 12px; border-radius: 50%;
    background: #25d366; border: 2px solid white;
  }

  .wa-conv-info { flex: 1; min-width: 0; }
  .wa-conv-name-row {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 2px;
  }
  .wa-conv-name {
    font-size: 0.9rem; font-weight: 700;
    color: var(--text-dark);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    flex: 1;
  }
  .wa-conv-time {
    font-size: 0.68rem; color: var(--text-light);
    flex-shrink: 0; margin-left: 0.5rem;
  }
  .wa-conv-time.unread { color: var(--orange); font-weight: 700; }
  .wa-conv-hostel {
    font-size: 0.72rem; color: var(--orange);
    font-weight: 600; margin-bottom: 2px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .wa-conv-preview-row {
    display: flex; align-items: center;
    justify-content: space-between;
  }
  .wa-conv-preview {
    font-size: 0.78rem; color: var(--text-light);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    flex: 1;
  }
  .wa-conv-preview.unread { color: var(--text-dark); font-weight: 600; }
  .wa-unread-badge {
    background: var(--orange); color: white;
    border-radius: 50%; min-width: 20px; height: 20px;
    padding: 0 5px; font-size: 0.68rem; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    margin-left: 0.5rem; flex-shrink: 0;
  }

  /* Empty */
  .wa-empty {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 2rem; text-align: center; gap: 0.75rem;
  }
  .wa-empty-ico {
    width: 68px; height: 68px; background: var(--orange-pale);
    border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 1.8rem; color: var(--orange);
  }
  .wa-empty h4 { font-size: 1rem; font-weight: 800; color: var(--navy); }
  .wa-empty p { font-size: 0.82rem; color: var(--text-mid); line-height: 1.6; max-width: 220px; }

  /* ── RIGHT PANEL (chat) ── */
  .wa-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* No chat selected */
  .wa-welcome {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: var(--chat-bg); text-align: center; padding: 2rem;
  }
  .wa-welcome-ico {
    width: 120px; height: 120px;
    background: white; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 3rem; margin: 0 auto 1.5rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  }
  .wa-welcome h3 { font-size: 1.4rem; font-weight: 800; color: var(--navy); margin-bottom: 0.5rem; }
  .wa-welcome p { color: var(--text-mid); font-size: 0.88rem; max-width: 300px; line-height: 1.7; }
  .wa-welcome-hint {
    margin-top: 1.5rem;
    display: flex; align-items: center; gap: 0.5rem;
    background: white; border-radius: 12px;
    padding: 0.75rem 1.25rem;
    font-size: 0.82rem; color: var(--text-mid); font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  /* Chat header */
  .wa-chat-head {
    background: #f0f2f5;
    border-bottom: 1px solid var(--gray-light);
    padding: 0.75rem 1.25rem;
    display: flex; align-items: center; gap: 0.9rem;
    flex-shrink: 0;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .wa-chat-head-info { flex: 1; min-width: 0; }
  .wa-chat-head-name { font-size: 0.95rem; font-weight: 800; color: var(--navy); }
  .wa-chat-head-sub {
    display: flex; align-items: center; gap: 0.5rem;
    margin-top: 1px; flex-wrap: wrap;
  }
  .wa-online-text { font-size: 0.72rem; color: #25d366; font-weight: 600; }
  .wa-offline-text { font-size: 0.72rem; color: var(--text-light); }
  .wa-hostel-tag {
    font-size: 0.68rem; font-weight: 700;
    background: var(--orange-pale); color: var(--orange);
    border-radius: 6px; padding: 2px 7px;
    border: 1px solid rgba(232,80,26,0.2);
  }
  .wa-chat-head-actions { display: flex; gap: 0.4rem; }
  .wa-head-btn {
    width: 34px; height: 34px; border-radius: 8px;
    background: transparent; border: 1px solid var(--gray-light);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--text-mid); font-size: 0.85rem; transition: all 0.2s;
  }
  .wa-head-btn:hover { background: #fef2f2; color: var(--danger); border-color: #fecaca; }

  /* ── MESSAGES AREA ── */
  .wa-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: var(--chat-bg);
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4b896' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .wa-messages::-webkit-scrollbar { width: 4px; }
  .wa-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }

  /* Date separator */
  .wa-date-sep {
    display: flex; align-items: center;
    justify-content: center; margin: 0.75rem 0;
  }
  .wa-date-sep span {
    font-size: 0.72rem; font-weight: 700;
    color: #54656f;
    background: #d9fdd3;
    padding: 4px 12px; border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  /* Message rows */
  .wa-msg-row {
    display: flex;
    align-items: flex-end;
    gap: 0.4rem;
    max-width: 70%;
    margin-bottom: 1px;
  }
  .wa-msg-row.mine {
    align-self: flex-end;
    flex-direction: row-reverse;
  }
  .wa-msg-row.theirs {
    align-self: flex-start;
  }
  .wa-msg-row.tail-mine { margin-bottom: 6px; }
  .wa-msg-row.tail-theirs { margin-bottom: 6px; }

  /* Small avatar in chat */
  .wa-msg-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; font-weight: 800; color: white;
    flex-shrink: 0; overflow: hidden;
  }
  .wa-msg-avatar.owner { background: linear-gradient(135deg, #065f46, #059669); }
  .wa-msg-avatar.student { background: linear-gradient(135deg, #0d1b3e, #1a3fa4); }
  .wa-msg-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .wa-msg-avatar.invisible { visibility: hidden; }

  /* Bubbles */
  .wa-bubble {
    padding: 0.55rem 0.85rem 0.4rem;
    border-radius: 10px;
    font-size: 0.875rem;
    line-height: 1.5;
    word-break: break-word;
    position: relative;
    max-width: 100%;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  /* Mine — orange with tail on right */
  .wa-bubble.mine {
    background: #ffd9cc;
    color: #1a1a1a;
    border-bottom-right-radius: 3px;
  }

  /* Theirs — white with tail on left */
  .wa-bubble.theirs {
    background: white;
    color: #1a1a1a;
    border-bottom-left-radius: 3px;
  }

  .wa-bubble-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 3px;
    margin-top: 2px;
  }
  .wa-bubble-time {
    font-size: 0.62rem;
    color: rgba(0,0,0,0.4);
    white-space: nowrap;
  }
  .wa-read-tick { font-size: 0.68rem; color: #53bdeb; }
  .wa-sent-tick { font-size: 0.68rem; color: rgba(0,0,0,0.3); }

  /* Temp message (sending) */
  .wa-bubble.sending { opacity: 0.65; }

  /* Typing indicator */
  .wa-typing-row {
    align-self: flex-start;
    display: flex; align-items: flex-end; gap: 0.4rem;
    margin-bottom: 6px;
  }
  .wa-typing-bubble {
    background: white; border-radius: 10px; border-bottom-left-radius: 3px;
    padding: 0.65rem 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .wa-typing-name { font-size: 0.72rem; color: var(--text-light); }
  .typing-dots { display: flex; gap: 3px; }
  .typing-dots span {
    width: 7px; height: 7px; border-radius: 50%;
    background: #aaa; animation: td 1.2s infinite;
  }
  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes td {
    0%,80%,100% { transform: translateY(0); background: #aaa; }
    40% { transform: translateY(-6px); background: var(--orange); }
  }

  /* ── INPUT AREA ── */
  .wa-input-area {
    background: #f0f2f5;
    border-top: 1px solid var(--gray-light);
    padding: 0.75rem 1rem;
    display: flex; align-items: flex-end; gap: 0.6rem;
    flex-shrink: 0;
  }

  .wa-input-box {
    flex: 1;
    background: white;
    border: none;
    border-radius: 24px;
    padding: 0.7rem 1.1rem;
    display: flex; align-items: flex-end; gap: 0.5rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }

  .wa-input-box textarea {
    flex: 1; border: none; outline: none; background: none;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem; color: var(--text-dark);
    resize: none; max-height: 120px; line-height: 1.5;
    padding: 0;
  }
  .wa-input-box textarea::placeholder { color: var(--text-light); }

  .wa-send-btn {
    width: 46px; height: 46px; border-radius: 50%;
    background: var(--orange);
    border: none; color: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; transition: all 0.2s; flex-shrink: 0;
    box-shadow: 0 3px 12px rgba(232,80,26,0.4);
  }
  .wa-send-btn:hover:not(:disabled) {
    background: var(--orange-light);
    transform: scale(1.05);
    box-shadow: 0 5px 16px rgba(232,80,26,0.5);
  }
  .wa-send-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }

  /* Loading */
  .wa-loading {
    display: flex; align-items: center; justify-content: center;
    padding: 2.5rem; gap: 0.75rem;
  }
  .wa-spinner { animation: spin 0.8s linear infinite; color: var(--orange); font-size: 1.5rem; }
  .wa-loading p { color: var(--text-mid); font-size: 0.85rem; font-weight: 600; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Mobile */
  @media (max-width: 768px) {
    .wa-left {
      position: absolute; z-index: 50;
      height: calc(100vh - 60px);
      width: 100%; min-width: 0;
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .wa-left.hidden { transform: translateX(-100%); }
    .wa-right { width: 100%; }
    .wa-msg-row { max-width: 85%; }
    .wa-back-mobile { display: flex !important; }
  }
`;

// ── HELPERS ───────────────────────────────────────
const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const formatConvTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
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

const groupMessages = (messages) => {
  const groups = [];
  let lastDate = null;
  messages.forEach((msg) => {
    const date = formatDate(msg.createdAt);
    if (date !== lastDate) {
      groups.push({ type: 'date', label: date });
      lastDate = date;
    }
    groups.push({ type: 'msg', data: msg });
  });
  return groups;
};

// ── MAIN ─────────────────────────────────────────
const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const {
    socket, joinConversation, leaveConversation,
    sendSocketMessage, startTyping, stopTyping, isUserOnline,
  } = useSocket();

  const [conversations,      setConversations]      = useState([]);
  const [activeConv,         setActiveConv]         = useState(null);
  const [messages,           setMessages]           = useState([]);
  const [inputText,          setInputText]          = useState('');
  const [searchQuery,        setSearchQuery]        = useState('');
  const [loadingConvs,       setLoadingConvs]       = useState(true);
  const [loadingMsgs,        setLoadingMsgs]        = useState(false);
  const [sending,            setSending]            = useState(false);
  const [typingUser,         setTypingUser]         = useState(null);
  const [showSidebar,        setShowSidebar]        = useState(true);

  const bottomRef    = useRef(null);
  const textareaRef  = useRef(null);
  const typingTimer  = useRef(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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

  // Open conversation from URL param
  useEffect(() => {
    const convId = searchParams.get('conversation');
    if (!convId || loadingConvs) return;
    if (conversations.length > 0) {
      const conv = conversations.find((c) => c._id === convId);
      if (conv) {
        openConv(conv);
      } else {
        messageService.getConversations().then((data) => {
          const all = data.data || [];
          setConversations(all);
          const found = all.find((c) => c._id === convId);
          if (found) openConv(found);
        });
      }
    }
  }, [searchParams, conversations, loadingConvs]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    const onReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(scrollToBottom, 50);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === msg.conversation
            ? { ...c, lastMessage: { text: msg.text, createdAt: msg.createdAt } }
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
  }, [socket, scrollToBottom]);

  const openConv = async (conv) => {
    if (activeConv?._id === conv._id) return;
    if (activeConv) leaveConversation(activeConv._id);
    setActiveConv(conv);
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
    if (!inputText.trim() || !activeConv || sending) return;
    const text = inputText.trim();
    setInputText('');
    setSending(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const tempMsg = {
      _id: 'temp_' + Date.now(),
      text,
      sender: { _id: user._id, firstName: user.firstName, profilePicture: user.profilePicture },
      createdAt: new Date().toISOString(),
      _temp: true,
    };
    setMessages((prev) => [...prev, tempMsg]);
    setTimeout(scrollToBottom, 50);

    try {
      const data = await messageService.sendMessage(activeConv._id, text);
      const real = data.data;
      setMessages((prev) => prev.map((m) => m._id === tempMsg._id ? real : m));
      sendSocketMessage(activeConv._id, real);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConv._id
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
    if (activeConv) {
      startTyping(activeConv._id);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => stopTyping(activeConv._id), 1500);
    }
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };

  const getOther = (conv) =>
    conv.participants?.find((p) => p._id !== user?._id);

  const getUnread = (conv) => {
    try {
      if (conv.unreadCount instanceof Map) return conv.unreadCount.get(user?._id) || 0;
      return conv.unreadCount?.[user?._id] || 0;
    } catch { return 0; }
  };

  const handleDelete = async (conv) => {
    if (!window.confirm(`Delete conversation with ${getOther(conv)?.firstName}?`)) return;
    try {
      await messageService.deleteConversation(conv._id);
      setConversations((prev) => prev.filter((c) => c._id !== conv._id));
      if (activeConv?._id === conv._id) setActiveConv(null);
      toast.success('Conversation deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = conversations.filter((conv) => {
    const other = getOther(conv);
    const name = `${other?.firstName || ''} ${other?.lastName || ''}`.toLowerCase();
    const hostel = conv.hostel?.name?.toLowerCase() || '';
    return (
      name.includes(searchQuery.toLowerCase()) ||
      hostel.includes(searchQuery.toLowerCase())
    );
  });

  const grouped = groupMessages(messages);

  return (
    <>
      <style>{styles}</style>

      <div className="wa-page">

        {/* TOP HEADER */}
        <div className="wa-header">
          <div className="wa-header-left">
            <button className="wa-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </button>
            <a href="/" className="wa-header-logo">
              <img src="/PezaHostelLogo.png" alt="PezaHostel" />
              <span>PezaHostel</span>
            </a>
            <span className="wa-header-badge">Messages</span>
          </div>
        </div>

        {/* BODY */}
        <div className="wa-body">

          {/* ── LEFT: Conversation List ── */}
          <div className={`wa-left${!showSidebar ? ' hidden' : ''}`}>
            <div className="wa-left-head">
              <div className="wa-left-title">
                <span>💬 Chats</span>
                {filtered.length > 0 && (
                  <span className="wa-conv-count">{filtered.length}</span>
                )}
              </div>
              <div className="wa-search">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search or start new chat"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="wa-conv-list">
              {loadingConvs ? (
                <div className="wa-loading">
                  <FaSpinner className="wa-spinner" />
                  <p>Loading chats...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="wa-empty">
                  <div className="wa-empty-ico">💬</div>
                  <h4>No conversations yet</h4>
                  <p>Browse hostels and tap "Chat with Owner" to start a conversation</p>
                </div>
              ) : (
                filtered.map((conv) => {
                  const other   = getOther(conv);
                  const unread  = getUnread(conv);
                  const online  = isUserOnline(other?._id);
                  const isActive = activeConv?._id === conv._id;

                  return (
                    <div
                      key={conv._id}
                      className={`wa-conv-item${isActive ? ' active' : ''}`}
                      onClick={() => openConv(conv)}
                    >
                      <div className={`wa-avatar ${other?.role === 'owner' ? 'owner' : 'student'}`}>
                        {other?.profilePicture
                          ? <img src={other.profilePicture} alt={other.firstName} />
                          : (other?.firstName?.[0] || '?').toUpperCase()
                        }
                        {online && <span className="wa-avatar-online" />}
                      </div>

                      <div className="wa-conv-info">
                        <div className="wa-conv-name-row">
                          <span className="wa-conv-name">
                            {other?.firstName} {other?.lastName}
                            {other?.role === 'owner' && (
                              <span style={{ fontSize: '0.65rem', color: '#059669', fontWeight: 700, marginLeft: 4 }}>
                                · Owner
                              </span>
                            )}
                          </span>
                          <span className={`wa-conv-time${unread > 0 ? ' unread' : ''}`}>
                            {formatConvTime(conv.lastMessage?.createdAt || conv.updatedAt)}
                          </span>
                        </div>
                        <div className="wa-conv-hostel">🏠 {conv.hostel?.name}</div>
                        <div className="wa-conv-preview-row">
                          <span className={`wa-conv-preview${unread > 0 ? ' unread' : ''}`}>
                            {conv.lastMessage?.text || 'Tap to start chatting'}
                          </span>
                          {unread > 0 && (
                            <span className="wa-unread-badge">
                              {unread > 99 ? '99+' : unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── RIGHT: Chat ── */}
          <div className="wa-right">
            {!activeConv ? (
              <div className="wa-welcome">
                <div className="wa-welcome-ico">💬</div>
                <h3>PezaHostel Chats</h3>
                <p>Send and receive messages from hostel owners and students in real time</p>
                <div className="wa-welcome-hint">
                  👈 Select a conversation to start chatting
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                {(() => {
                  const other  = getOther(activeConv);
                  const online = isUserOnline(other?._id);
                  return (
                    <div className="wa-chat-head">
                      {/* Mobile back button */}
                      <button
                        className="wa-back-btn"
                        style={{ display: 'none', marginRight: '0.25rem' }}
                        id="wa-mobile-back"
                        onClick={() => setShowSidebar(true)}
                      >
                        <FaArrowLeft />
                      </button>

                      <div
                        className={`wa-avatar ${other?.role === 'owner' ? 'owner' : 'student'}`}
                        style={{ width: 42, height: 42, fontSize: '0.9rem', cursor: 'pointer' }}
                      >
                        {other?.profilePicture
                          ? <img src={other.profilePicture} alt={other.firstName} />
                          : (other?.firstName?.[0] || '?').toUpperCase()
                        }
                        {online && <span className="wa-avatar-online" />}
                      </div>

                      <div className="wa-chat-head-info">
                        <div className="wa-chat-head-name">
                          {other?.firstName} {other?.lastName}
                        </div>
                        <div className="wa-chat-head-sub">
                          {online
                            ? <span className="wa-online-text">● Online</span>
                            : <span className="wa-offline-text">● Offline</span>
                          }
                          <span className="wa-hostel-tag">🏠 {activeConv.hostel?.name}</span>
                        </div>
                      </div>

                      <div className="wa-chat-head-actions">
                        <button
                          className="wa-head-btn"
                          title="Delete conversation"
                          onClick={() => handleDelete(activeConv)}
                        >
                          <FaTrash style={{ fontSize: '0.78rem' }} />
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Messages */}
                <div className="wa-messages">
                  {loadingMsgs ? (
                    <div className="wa-loading">
                      <FaSpinner className="wa-spinner" />
                      <p>Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👋</div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#54656f' }}>
                        Say hi to {getOther(activeConv)?.firstName}!
                      </p>
                      <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '0.3rem' }}>
                        About: <strong>{activeConv.hostel?.name}</strong>
                      </p>
                    </div>
                  ) : (
                    grouped.map((item, idx) => {
                      if (item.type === 'date') {
                        return (
                          <div key={`d-${idx}`} className="wa-date-sep">
                            <span>{item.label}</span>
                          </div>
                        );
                      }

                      const msg    = item.data;
                      const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                      const isTemp = msg._temp;

                      // Check if next message is from same sender (no tail)
                      const nextItem = grouped[idx + 1];
                      const isLastInGroup =
                        !nextItem ||
                        nextItem.type === 'date' ||
                        (nextItem.type === 'msg' &&
                          nextItem.data.sender?._id !== msg.sender?._id);

                      const senderRole = msg.sender?.role ||
                        (isMine ? user?.role : getOther(activeConv)?.role);

                      return (
                        <div
                          key={msg._id}
                          className={`wa-msg-row ${isMine ? 'mine' : 'theirs'}${isLastInGroup ? (isMine ? ' tail-mine' : ' tail-theirs') : ''}`}
                        >
                          {/* Avatar for other person */}
                          {!isMine && (
                            <div
                              className={`wa-msg-avatar ${senderRole === 'owner' ? 'owner' : 'student'}${!isLastInGroup ? ' invisible' : ''}`}
                            >
                              {msg.sender?.profilePicture
                                ? <img src={msg.sender.profilePicture} alt="" />
                                : (msg.sender?.firstName?.[0] || '?').toUpperCase()
                              }
                            </div>
                          )}

                          <div className={`wa-bubble ${isMine ? 'mine' : 'theirs'}${isTemp ? ' sending' : ''}`}>
                            {msg.text}
                            <div className="wa-bubble-footer">
                              <span className="wa-bubble-time">
                                {formatTime(msg.createdAt)}
                              </span>
                              {isMine && (
                                isTemp
                                  ? <FaCheck className="wa-sent-tick" />
                                  : <FaCheckDouble className="wa-read-tick" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Typing indicator */}
                  {typingUser && (
                    <div className="wa-typing-row">
                      <div className={`wa-msg-avatar ${getOther(activeConv)?.role === 'owner' ? 'owner' : 'student'}`}>
                        {getOther(activeConv)?.firstName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="wa-typing-bubble">
                        <div className="typing-dots">
                          <span /><span /><span />
                        </div>
                        <span className="wa-typing-name">{typingUser}</span>
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="wa-input-area">
                  <div className="wa-input-box">
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      placeholder="Type a message"
                      value={inputText}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <button
                    className="wa-send-btn"
                    onClick={handleSend}
                    disabled={!inputText.trim() || sending}
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
      </div>
    </>
  );
};

export default Messages;