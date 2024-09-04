import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 import appConfig from './config/config';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log('appConfig.isPlatformEnabled', appConfig.isPlatformEnabled);
  if (!appConfig.isPlatformEnabled) return NextResponse.redirect(new URL('/', request.url));
  if (request.url && request.url.includes('/authentication')) return NextResponse.next();
  const cookieStore = cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (!token) {
        // Redirect to authentication page if token is missing
        return NextResponse.redirect(new URL('/authentication', request.url));
    }
    return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/create-app/:path*', '/dashboard/:path*', '/authentication/:path*'],
}