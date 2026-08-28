import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KitabPoint | Premium Book Marketplace",
  description: "Curating the world's best stories. A premium marketplace for pristine new releases and verified pre-loved books.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Updated global background to the organic cream color */}
      <body className={`${inter.className} flex flex-col min-h-screen bg-[#F9F8F4] text-[#183629]`}>
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}