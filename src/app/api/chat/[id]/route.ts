// src/app/api/chat/[id]/route.ts
import { NextResponse } from 'next/server';
import { memoryAccessRequests, messages } from '../../../../server/memory';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  return NextResponse.json({
    chatId: id,
    messages,
    memoryAccessRequests,
  });
}