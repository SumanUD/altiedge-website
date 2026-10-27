export const dynamic = "force-static";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page" style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, we couldn’t find the page you were looking for.</p>
      <Link href="/" className="home-link" style={{ color: "#0070f3", textDecoration: "underline" }}>
        Go back home
      </Link>
    </main>
  );
}
