import "./globals.css";
import ErrorBoundary from "../components/ErrorBoundary";
import { ToastProvider } from "../context/ToastContext";

export const metadata = {
  title: "PaperMind AI",
  description: "RAG-powered research paper Q&A assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <ToastProvider>{children}</ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
