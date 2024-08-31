import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export async function POST(request: NextRequest) {
  console.log('CALLED <><><>')
  const { appId } = await request.json();

  cookies().set('appId', appId);

  return NextResponse.json({
    message: 'App ID set successfully'
  });
}

export async function GET(request: NextRequest) {
    const appId = cookies().get('appId');

    if (!appId) {
      return NextResponse.json({});
    }

    return NextResponse.json({ appId });
  
}
