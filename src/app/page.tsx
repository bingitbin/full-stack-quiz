// src/app/page.tsx
'use client'; // 标记为客户端组件

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

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
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // 初始化钱包连接
  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
    } else {
      alert('请安装 MetaMask 或其他以太坊钱包！');
    }
  }, []);

  // 获取聊天数据
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

  // 连接钱包
  const connectWallet = async () => {
    if (provider) {
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      setSigner(signer);
      alert('钱包已连接！');
    }
  };

  // 处理批准访问（带签名）
  const handleApproveAccessWithSignature = async () => {
    if (!signer) {
      alert('请先连接钱包！');
      return;
    }

    // EIP712 签名数据
    const domain = {
      name: 'MemoryAccess',
      version: '1',
      chainId: 1,
      // 替换为你的合约地址
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC', 
    };

    const types = {
      MemoryAccess: [
        { name: 'requestId', type: 'string' },
        { name: 'status', type: 'string' },
      ],
    };

    const value = {
      requestId: 'req123',
      status: 'approved',
    };

    // 签名
    const signature = await signer._signTypedData(domain, types, value);

    // 发送批准请求（附带签名）
    const response = await axios.post('/api/memory/approve-access-signature', {
      requestId: 'req123',
      signature,
    });

    setMemoryAccessRequests([...memoryAccessRequests, { requestId: 'req123', status: 'approved' }]);
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
      <div>场景1</div>
      <button className='chat-btn' onClick={handleApproveAccess}>批&nbsp;准</button>
      <button className='chat-btn' onClick={handleRejectAccess}>拒&nbsp;绝</button>
      <div>场景2</div>
      <button className='chat-btn' onClick={connectWallet}>连接钱包</button>
      <button className='chat-btn' onClick={handleApproveAccessWithSignature}>批&nbsp;准</button>
    </div>
  );
}