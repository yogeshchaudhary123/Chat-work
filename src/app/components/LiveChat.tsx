'use client';

import { useEffect, useState, useRef, FormEvent, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import api from '../../../api';

type User = {
  id: string;
  name: string;
  email: string;
  active?: boolean;
};

// Add a type for chat messages with timestamp
interface ChatMessage {
  text: string;
  sender: string;
  time: string;
  seen?: number;
}

interface ApiChatMessage {
  text: string;
  sender_id: string;
  time: string;
  seen: number;
}

export default function LiveChat() {
  const { data: session } = useSession();
  const [recipient, setRecipient] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const getUsers = useCallback(async (currentUserId: string) => {
    try {
      const { data } = await api.get<User[]>('/api/users');
      setUsers(
        data
          .filter(u => String(u.id) !== String(currentUserId))
          .map(u => ({
            ...u,
            active: onlineUsers.includes(String(u.id)),
          }))
      );
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, [onlineUsers]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
      auth: { userId: session.user.id },
    });

    socketRef.current = socket;

    socket.emit('register', session.user.id);

    const handleReceiveMessage = (msg: string, time?: string) => {
      console.log('[Client] Message received:', msg);
      setChat(prev => [...prev, { text: msg, sender: 'Other', time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), seen: 0 }]);
      // Mark as seen if chat is open and window is focused
      if (recipient && document.hasFocus()) {
        api.post('/api/chat/seen', {
          senderId: recipient,
          recipientId: session.user.id,
        }).then(async () => {
          // Optionally, refresh chat history to update seen status
          const { data } = await api.get(`/api/chat/history`, {
            params: { userId: session.user.id, otherUserId: recipient },
          });
          setChat(
            data.map((msg: ApiChatMessage) => ({
              text: msg.text,
              sender: msg.sender_id === session.user.id ? 'You' : 'Other',
              time: msg.time,
              seen: msg.seen,
            }))
          );
        });
      }
    };

    const handleUserList = (list: string[]) => {
      const filtered = list.filter(u => u !== session.user.id);
      setOnlineUsers(filtered);
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('user-list', handleUserList);

    getUsers(session.user.id);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('user-list', handleUserList);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session?.user?.id, getUsers, recipient]);

  useEffect(() => {
    if (!users.length) return;

    setUsers(prev =>
      prev.map(u => ({ ...u, active: onlineUsers.includes(String(u.id)) }))
    );
  }, [onlineUsers, users.length]);

  // Fetch chat history when recipient changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!session?.user?.id || !recipient) return;
      try {
        const { data } = await api.get(`/api/chat/history`, {
          params: { userId: session.user.id, otherUserId: recipient },
        });
        setChat(
          data.map((msg: ApiChatMessage) => ({
            text: msg.text,
            sender: msg.sender_id === session.user.id ? 'You' : 'Other',
            time: msg.time,
            seen: msg.seen,
          }))
        );
        // Mark messages as seen
        await api.post('/api/chat/seen', {
          senderId: recipient,
          recipientId: session.user.id,
        });
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
      }
    };
    fetchHistory();
  }, [recipient, session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id || !recipient) return;
    // Listen for focus to mark messages as seen in real time
    const handleFocus = async () => {
      try {
        await api.post('/api/chat/seen', {
          senderId: recipient,
          recipientId: session.user.id,
        });
        // Optionally, refresh chat history to update seen status
        const { data } = await api.get(`/api/chat/history`, {
          params: { userId: session.user.id, otherUserId: recipient },
        });
        setChat(
          data.map((msg: ApiChatMessage) => ({
            text: msg.text,
            sender: msg.sender_id === session.user.id ? 'You' : 'Other',
            time: msg.time,
            seen: msg.seen,
          }))
        );
      } catch (err) {
        console.error('Failed to mark messages as seen:', err);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [recipient, session?.user?.id]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!socketRef.current || !recipient || !message.trim() || !session?.user?.id) return;

    const msgText = `${session?.user?.name}: ${message}`;
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    const time = `${hours}:${minutes}:${seconds}.${milliseconds}`;

    // Emit via socket
    socketRef.current.emit('send-private-message', {
      to: recipient,
      message: msgText,
      time,
    });

    // Save to database
    let seen = 0;
    if (onlineUsers.includes(recipient)) {
      seen = 1;
    }
    try {
      await api.post('/api/chat/message', {
        senderId: session.user.id,
        recipientId: recipient,
        text: message,
        time,
        seen,
      });
    } catch (err) {
      console.error('Failed to save message:', err);
    }

    setChat(prev => [...prev, { text: message, sender: 'You', time, seen }]);
    setMessage('');
  };
  const setMessageRecipient = (id: string) => {
    setRecipient(id);
  };


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar toggle button for mobile */}
        <button
          className="block sm:hidden absolute top-4 left-4 z-50 bg-green-500 text-white p-2 rounded-md shadow-md"
          onClick={() => setShowSidebar((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Sidebar (always visible on desktop, toggled on mobile) */}
        <aside className={`fixed sm:static top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-lg border-r overflow-y-auto z-40 transition-transform duration-200 ease-in-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:block sm:w-1/3 md:w-1/4`}>
          <div className="p-4 ">
            <h1 className="text-xl font-bold text-green-600">Chats</h1>
          </div>
          <ul>
            {users.map(user => (
              <li
                key={user.id}
                onClick={() => { setMessageRecipient(user.id); setShowSidebar(false); }}
                className={`cursor-pointer  border-b px-4 py-3 text-sm hover:bg-gray-100
                  ${user.id === recipient ? 'bg-green-100' : ''}`}
              >
                <div className="font-medium text-gray-800">{user.name}</div>
                {user.active && (
                  <div className="text-xs text-green-500">Online</div>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex-1 flex flex-col bg-gray-50 h-full">
          {recipient ? (
            <>
              <aside className="p-4 border-b bg-white shadow-sm">
                {(() => {
                  const user = users.find(u => u.id === recipient);
                  return (
                    <>
                      <h2 className="text-lg font-semibold text-gray-700">
                        {user?.name ?? 'Unknown'}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {user?.active ? 'Online' : 'Offline'}
                      </p>
                    </>
                  );
                })()}
              </aside>

              <aside className="flex-1 p-2 sm:p-4 overflow-y-auto space-y-2 bg-zinc-400" >
                {chat.map((msg, idx) => {
                  const isMe = msg.sender === 'You';
                  return (
                    <div
                      key={idx}
                      className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} mb-1`}
                    >
                      <div
                        className={`relative max-w-[75%] px-3 py-2 rounded-lg text-sm break-words flex flex-col
                          ${isMe
                            ? 'bg-green-100 text-black rounded-br-none items-end ml-auto'
                            : 'bg-white text-black rounded-bl-none items-start mr-auto'}`
                        }
                      >
                        {/* Message Text */}
                        <div>{msg.text}</div>
                        {/* Time + Seen ticks */}
                        <div className={`flex flex-row-reverse items-center gap-1 text-[11px] mt-1 w-full ${isMe ? 'justify-end text-right' : 'justify-start text-left'}`}>
                          {isMe && (
                            <>
                              {msg.seen === 0 && <span className="text-gray-400">✓</span>}
                              {msg.seen === 1 && <span className="text-gray-400">✓✓</span>}
                              {msg.seen === 2 && <span className="text-blue-500">✓✓</span>}
                            </>
                          )}
                          <span>{formatTime(msg.time)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </aside>

              <form onSubmit={sendMessage} className="p-2 sm:p-4 bg-white border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type a message…"
                    className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-400 text-lg">
              Select a user to start chatting
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// Add this helper function at the top-level (outside the component):
function formatTime(time: string) {
  // Try to parse as Date, fallback to original if invalid
  let date: Date | null = null;
  if (/\d{1,2}:\d{2}/.test(time)) {
    // If time is like '17:00' or '05:00 pm', try to parse today with that time
    const today = new Date();
    const [h, m] = time.match(/\d{1,2}/g) || [];
    if (h && m) {
      date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(h), parseInt(m));
    }
  } else if (!isNaN(Date.parse(time))) {
    date = new Date(time);
  }
  if (date && !isNaN(date.getTime())) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
  }
  // fallback: try to format as 12-hour if possible
  const match = time.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    let hour = parseInt(match[1]);
    const minute = match[2];
    const ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }
  return time;
}