import "./globals.css";

export const metadata = {
  title: "AgenticHireAI",
  description: "Spec-driven multi-agent recruitment platform"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
