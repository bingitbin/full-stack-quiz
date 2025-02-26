// src/server/memory.ts
export interface MemoryAccessRequest {
    requestId: string;
    status: string;
  }
  
  export const memoryAccessRequests: MemoryAccessRequest[] = [];
  
  export const messages = [
    { id: 1, role: 'user', content: '你好，机器人！' },
    { id: 2, role: 'bot', content: '你好，用户！今天有什么可以帮你的吗？' },
  ];
  