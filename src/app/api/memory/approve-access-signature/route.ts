// src/app/api/memory/approve-access/route.ts
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { memoryAccessRequests } from '../../../../server/memory';

export async function POST(request: Request) {
  const { requestId, signature } = await request.json();

  // EIP712 签名数据
  const domain = {
    name: 'MemoryAccess',
    version: '1',
    chainId: 1, // 主网
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC', // 替换为你的合约地址
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

  try {
    // 验证签名
    const recoveredAddress = ethers.utils.verifyTypedData(domain, types, value, signature);
    console.log('签名验证通过，签名者地址:', recoveredAddress);

    memoryAccessRequests.push({ requestId, status: 'approved' });
    return NextResponse.json({ message: '访问已批准', requestId });
  } catch (error) {
    console.error('签名验证失败:', error);
    return NextResponse.json({ message: '签名验证失败' }, { status: 400 });
  }
}