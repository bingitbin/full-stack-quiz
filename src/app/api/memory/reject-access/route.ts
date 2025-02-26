// src/app/api/memory/reject-access/route.ts
import { NextResponse } from 'next/server';
import { memoryAccessRequests } from '../../../../server/memory';

export async function POST(request: Request) {
  const { requestId } = await request.json();

  memoryAccessRequests.push({ requestId, status: 'rejected' });

  return NextResponse.json({ message: '访问已拒绝', requestId });
}