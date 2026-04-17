import "./globals.css";

export const metadata = {
  title: "AI Notes Generator | Instant Structured Study Notes",
  description:
    "Generate high-quality, structured academic notes instantly using AI. Get topic overviews, detailed explanations, key points, exam questions, MCQs, and visual diagrams for any subject.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
