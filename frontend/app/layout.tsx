import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./components/ToastContext";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Fitness App",
  description: "Track your workouts and meals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <ToastProvider>
            {/* Nav removed - moved to (main)/layout.tsx */}

            {/* main with flex-1 ensures the footer is pushed to the bottom */}
            <main className="flex-1">
              {children}
            </main>

            {/* Render the Footer here */}
            <Footer />
            
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}