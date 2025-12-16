import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/Nav"; 

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
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Nav /> {/* <--- Lägg till Nav här högst upp */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}