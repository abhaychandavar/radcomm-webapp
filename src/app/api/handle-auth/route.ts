import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export async function POST(request: NextRequest) {
  const { accessToken, refreshToken } = await request.json();

  cookies().set('accessToken', accessToken);
  cookies().set('refreshToken', refreshToken);

  return NextResponse.json({
    message: 'Authentication successful'
  });
}

export async function GET(request: NextRequest) {
  const accessToken = cookies().get('accessToken');
  const refreshToken = cookies().get('refreshToken');

  console.log('token', { accessToken, refreshToken });
  if (!accessToken?.value) {
    return NextResponse.json({
      message: 'No access token found'
    }, {
      status: 500
    });
  }
  return NextResponse.json({
    accessToken: accessToken?.value,
    refreshToken: refreshToken?.value
  });
}
