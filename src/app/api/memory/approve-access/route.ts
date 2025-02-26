// src/app/api/memory/approve-access/route.ts
import { NextResponse } from 'next/server';
import { memoryAccessRequests } from '../../../../server/memory';

export async function POST(request: Request) {
  const { requestId, signature } = await request.json();

  // 这里可以添加签名验证逻辑
  memoryAccessRequests.push({ requestId, status: 'approved' });

  return NextResponse.json({ message: '访问已批准', requestId });
}