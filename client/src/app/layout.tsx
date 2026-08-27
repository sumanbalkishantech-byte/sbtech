import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // 1. IMPORT THE FOOTER

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MarketEngine | Buy & Sell Books",
  description: "A premium marketplace for new and used books.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. ADD 'flex flex-col min-h-screen' TO THE BODY TO PUSH FOOTER TO THE BOTTOM */}
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        <Navbar />
        
        {/* 3. ADD 'flex-grow' SO THE MAIN CONTENT TAKES UP AVAILABLE SPACE */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* 4. DROP THE FOOTER HERE */}
        <Footer />
      </body>
    </html>
  );
}