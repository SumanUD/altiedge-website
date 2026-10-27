import { Header } from "@/components/Headers/index";
import { Footer } from "@/components/Footer";
import { WhatsApp } from "@/components/WhatsApp";
import SmoothScroll from "@/hooks/SmoothScroll";

//css directly importing because of hotreload issue
import '../style/_index.scss';
import '../style/_animation.scss';
import '../style/_footer.scss';
import '../style/_header.scss';
import '../style/_home.scss';
import '../style/_marque.scss';
import '../style/_readinessTest.scss';
import '../style/_programs_events.scss';
import '../style/about.scss';
import '../style/_blogs.scss';
import '../style/_contactUs.scss';

import ScrollToTop from "@/hooks/ScrollToTop";
// Helper: remove HTML tags and truncate text
const stripHtml = (html, maxLength = 150) => {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, ""); // Remove HTML tags
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export const metadata = {
  title: "Altiedge",
  description: "Prepare for high-altitude adventures with expert mountain climbing and fitness training. Build strength, endurance, and resilience for safe, successful ascents.",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="../assets/icons/logo.webp" sizes="any" />


      </head>
      <body>
        
        <SmoothScroll/>
        <Header />
        <ScrollToTop/>
        {children}
        <WhatsApp/>
        <Footer/>

      </body>


    </html>
  );
}
