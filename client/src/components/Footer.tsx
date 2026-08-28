"use client";

import Link from "next/link";
import { Send, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#183629] relative overflow-hidden text-[#F9F8F4]/70 border-t-4 border-[#E27142] w-full">
      
      {/* Subtle Dark Texture Overlay */}
      <div 
        className="absolute inset-0 z-0 mix-blend-overlay opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 py-16 lg:px-8 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Column 1: Brand & Newsletter (Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* SCALED-UP EDITORIAL BRAND PLAQUE */}
              <Link href="/" className="inline-block group mb-8">
                <div className="bg-[#F9F8F4] px-8 py-5 rounded-[1.5rem] rounded-br-md shadow-[0_12px_24px_rgba(0,0,0,0.25)] border-b-[5px] border-[#E27142] group-hover:-translate-y-1 transition-transform duration-300">
                  <img 
                    src="/KP logo.png" 
                    alt="KitabPoint Logo" 
                    className="h-16 md:h-24 w-auto object-contain drop-shadow-sm"
                  />
                </div>
              </Link>
              <p className="text-[#F9F8F4]/70 text-lg leading-relaxed max-w-sm mb-10">
                Curating the world's best stories. A premium marketplace for pristine new releases and verified pre-loved books.
              </p>
            </div>

            {/* Newsletter block */}
            <div className="max-w-md">
              <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E27142]" /> 
                Join the Reading List
              </h4>
              <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full bg-white/5 border border-white/10 text-white text-base rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:border-[#E27142] focus:bg-white/10 transition-all placeholder-white/30 shadow-sm"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#E27142] hover:bg-[#c45a31] text-white p-2.5 rounded-xl transition-colors shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Elegant Navigation (Span 3) */}
          <div className="lg:col-span-3 lg:col-start-7 flex flex-col gap-10">
            <div>
              <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Explore</h4>
              <ul className="space-y-4 text-base font-medium">
                <li><Link href="/catalog?type=new" className="hover:text-[#E27142] transition-colors inline-flex items-center gap-2 group">New Arrivals <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
                <li><Link href="/catalog?type=used" className="hover:text-[#E27142] transition-colors inline-flex items-center gap-2 group">Pre-Loved Books <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
                <li><Link href="/sell" className="hover:text-[#E27142] transition-colors inline-flex items-center gap-2 group">Start Selling <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
                <li><Link href="#" className="hover:text-[#E27142] transition-colors inline-flex items-center gap-2 group">Services <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Legal</h4>
              <ul className="space-y-4 text-base font-medium">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Redesigned Headquarters (Span 3) */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            {/* Editorial Address Block with Terracotta Accent */}
            <div className="pl-5 border-l-2 border-[#E27142]">
              <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-4">Headquarters</h4>
              <p className="font-bold text-white text-lg mb-2">
                SUMANBALKISHAN TECH <br/> PVT. LTD.
              </p>
              <p className="text-[#F9F8F4]/60 leading-relaxed text-base">
                2nd Floor, 1984,<br />
                SBI Jhokan Bagh, Jhansi<br />
                Uttar Pradesh, India — 284001
              </p>
            </div>

            {/* Social Icons aligned to bottom */}
            <div className="flex items-center gap-3 pt-10">
              <a href="#" className="bg-white/5 border border-white/10 p-3 rounded-xl text-white hover:bg-[#E27142] hover:border-[#E27142] transition-all hover:-translate-y-1">
                <TwitterIcon />
              </a>
              <a href="#" className="bg-white/5 border border-white/10 p-3 rounded-xl text-white hover:bg-[#E27142] hover:border-[#E27142] transition-all hover:-translate-y-1">
                <GithubIcon />
              </a>
              <a href="#" className="bg-white/5 border border-white/10 p-3 rounded-xl text-white hover:bg-[#E27142] hover:border-[#E27142] transition-all hover:-translate-y-1">
                <LinkedinIcon />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="relative z-10 border-t border-white/10 mx-6 lg:mx-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#F9F8F4]/40 font-medium">
        <p>© {new Date().getFullYear()} Sk Design Studio. All rights reserved.</p>
        <p>Designed & Developed in India.</p>
      </div>
    </footer>
  );
}

// --- Custom Native SVGs ---
function TwitterIcon() {
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
  );
}
function GithubIcon() {
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
  );
}
function LinkedinIcon() {
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  );
}