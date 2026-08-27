"use client";

import Link from "next/link";
import { BookOpen, Send, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2 text-white group w-fit">
              <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-2.5 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Market<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Engine</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              A premium marketplace for new and pre-loved books. Built with modern web architecture and precision engineering.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="bg-gray-800/80 p-2.5 rounded-full hover:bg-indigo-600 hover:text-white transition-all hover:scale-110">
                <TwitterIcon />
              </a>
              <a href="#" className="bg-gray-800/80 p-2.5 rounded-full hover:bg-indigo-600 hover:text-white transition-all hover:scale-110">
                <GithubIcon />
              </a>
              <a href="#" className="bg-gray-800/80 p-2.5 rounded-full hover:bg-indigo-600 hover:text-white transition-all hover:scale-110">
                <LinkedinIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Explore</h3>
            <ul className="space-y-3.5 text-sm font-medium">
              <li><Link href="/catalog?type=new" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-300">New Arrivals</Link></li>
              <li><Link href="/catalog?type=used" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-300">Pre-Loved Books</Link></li>
              <li><Link href="/sell" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-300">Start Selling</Link></li>
              <li><Link href="/dashboard" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-300">Your Account</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Legal</h3>
            <ul className="space-y-3.5 text-sm font-medium">
              <li><Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-300">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-300">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-300">Return Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-300">Services</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Stay Connected</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              SUMANBALKISHAN TECH PRIVATE LIMITED. <br />
              2ND FLOOR, 1984, SBI JHOKAN BAGH, Jhansi, Uttar Pradesh, India, 284001
            </p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-gray-800/50 border border-gray-700 text-white text-sm rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:border-indigo-500 focus:bg-gray-800 transition-all placeholder-gray-500"
              />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} Shri Kishori Design Studio. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Designed & Developed in India.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Custom Native SVGs to replace the missing Lucide brand icons ---

function TwitterIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}