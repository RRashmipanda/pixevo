import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home"
])

const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
])


export default clerkMiddleware((auth,req) =>{
    const {userId} :any= auth();
    const currentUrl = new URL (req.url)
    const isAccessDashboard = currentUrl.pathname === "/home"
    const isApiRequest = currentUrl.pathname.startsWith("/api")

 //when user logged in trying to access publicroutes redirect to home
   if(userId && isPublicRoute(req) && !isAccessDashboard){
      return NextResponse.redirect(new URL("/home",req.url))
   }

   // not logged in trying to access a protected route like accesing social share
   if(!userId){
      if(!isPublicRoute(req) && !isPublicApiRoute(req)){
          return NextResponse.redirect(new URL("/sign-in",req.url))
      }

      //if the request is for protected API and user is not logged in like accesing /videos

      if(isApiRequest && !isPublicApiRoute(req)){
        return NextResponse.redirect(new URL("/sign-in",req.url))
      }
   }
   
   return NextResponse.next()
  
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};