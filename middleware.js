import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login"
  },
});

// Protect /admin and API routes
export const config = { matcher: ["/admin/:path*", "/api/blog/:path*", "/api/events/:path*", "/api/contact/:path*"] };
