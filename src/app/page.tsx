// src/app/page.tsx
'use client'; // 标记为客户端组件

import { useEffect, useState } from 'react';
import axios from 'axios';

type Message = {
  id: number;
  role: string;
  content: string;
};

type MemoryAccessRequest = {
  requestId: string;
  status: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [memoryAccessRequests, setMemoryAccessRequests] = useState<MemoryAccessRequest[]>([]);

  useEffect(() => {
    fetchChatData();
  }, []);

  const fetchChatData = async () => {
    const response = await axios.get('/api/chat/0');
    setMessages(response.data.messages);
    setMemoryAccessRequests(response.data.memoryAccessRequests);
  };

  const handleApproveAccess = async () => {
    const response = await axios.post('/api/memory/approve-access', { requestId: 'req123' });
    setMemoryAccessRequests([...memoryAccessRequests, { requestId: 'req123', status: 'approved' }]);
    alert(response.data.message);
  };

  const handleRejectAccess = async () => {
    const response = await axios.post('/api/memory/reject-access', { requestId: 'req123' });
    setMemoryAccessRequests([...memoryAccessRequests, { requestId: 'req123', status: 'rejected' }]);
    alert(response.data.message);
  };

  return (
    <div style={{padding:12}}>
      <h1>聊天记录</h1>
      {messages.map((msg) => (
        <div key={msg.id}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
      <h2>内存访问请求</h2>
      {memoryAccessRequests.map((req, index) => (
        <div key={index}>
          请求 ID: {req.requestId} - 状态: {req.status}
        </div>
      ))}
      <button className='chat-btn' onClick={handleApproveAccess}>批&nbsp;准</button>
      <button className='chat-btn' onClick={handleRejectAccess}>拒&nbsp;绝</button>
    </div>
  );
}