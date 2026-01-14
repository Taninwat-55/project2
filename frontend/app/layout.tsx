import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./components/ToastContext";


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

            <main className="flex-1">
              {children}
            </main>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}