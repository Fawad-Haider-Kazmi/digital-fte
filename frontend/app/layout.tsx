import "./globals.css";

export const metadata = {
  title: "Digital FTE",
  description: "Autonomous AI Agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}