"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingBag, User, BookOpen, LogOut, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Global Cart State
  const cartItems = useCartStore((state) => state.items);

  // Hydration & Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // --- PREMIUM SEARCH STATE ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check auth state on load and URL change
  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (token && userString) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(userString));
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, [pathname]);

  // Handle Search Modal Keyboard Controls (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    
    // Prevent background scrolling when search overlay is open
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    router.push("/login");
  };

  const executeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      // Pushes the query to the catalog so it can be picked up by the URL
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // reset after search
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-[#183629]/10 bg-[#F9F8F4]/80 backdrop-blur-xl shadow-sm transition-all">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#E27142] text-white p-2.5 rounded-xl group-hover:scale-105 transition-transform shadow-md shadow-[#E27142]/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-[#183629]">
              Kitab<span className="text-[#E27142]">Point</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-white/60 p-1.5 rounded-full border border-[#183629]/5 shadow-sm">
            <Link href="/catalog?type=new" className="px-5 py-2 text-sm font-bold text-[#183629]/70 hover:text-[#E27142] hover:bg-white rounded-full transition-all shadow-sm shadow-transparent hover:shadow-[#183629]/5">
              New Arrivals
            </Link>
            <Link href="/catalog?type=used" className="px-5 py-2 text-sm font-bold text-[#183629]/70 hover:text-[#E27142] hover:bg-white rounded-full transition-all shadow-sm shadow-transparent hover:shadow-[#183629]/5">
              Pre-Loved
            </Link>
            <Link href="#" className="px-5 py-2 text-sm font-bold text-[#183629]/70 hover:text-[#E27142] hover:bg-white rounded-full transition-all shadow-sm shadow-transparent hover:shadow-[#183629]/5">
              Services
            </Link>
          </div>

          {/* Icons & CTA Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-5 text-[#183629]">
              
              {/* MAGNIFYING GLASS -> OPENS SEARCH MODAL */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search" 
                className="hover:text-[#E27142] transition-colors"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
              </button>

              {isLoggedIn ? (
                <>
                  {userData?.role !== "super_admin" && (
                    <Link href="/cart" aria-label="Cart" className="hover:text-[#E27142] transition-colors relative">
                      <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                      {isMounted && cartItems.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-[#E27142] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                          {cartItems.length}
                        </span>
                      )}
                    </Link>
                  )}

                  <Link href={userData?.role === "super_admin" ? "/admin" : "/dashboard"} className="flex items-center gap-2 hover:text-[#E27142] transition-colors font-bold text-sm">
                    <User className="w-5 h-5 stroke-[2.5]" />
                    <span className="hidden lg:block">{userData?.name.split(" ")[0]}</span>
                  </Link>

                  <button onClick={handleLogout} aria-label="Logout" className="hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </>
              ) : (
                <Link href="/login" className="hover:text-[#E27142] transition-colors font-bold text-sm">
                  Sign In
                </Link>
              )}
            </div>

            {!isLoggedIn ? (
              <Link href="/register" className="hidden lg:flex items-center gap-2 bg-[#183629] hover:bg-[#12291f] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#183629]/20 hover:-translate-y-0.5">
                Create Account
              </Link>
            ) : userData?.role === "super_admin" ? (
              <Link href="/admin" className="hidden lg:flex items-center gap-2 bg-[#E27142] hover:bg-[#c45a31] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#E27142]/20 hover:-translate-y-0.5">
                Admin Panel
              </Link>
            ) : (
              <Link href="/sell" className="hidden lg:flex items-center gap-2 bg-[#183629] hover:bg-[#12291f] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#183629]/20 hover:-translate-y-0.5">
                Sell a Book
              </Link>
            )}
          </div>

        </div>
      </nav>

      {/* ========================================== */}
      {/* 90/100 PREMIUM GLOBAL SEARCH COMMAND PALETTE */}
      {/* ========================================== */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-6 pointer-events-auto">
          
          {/* Glassmorphic Backdrop */}
          <div
            className="absolute inset-0 bg-[#183629]/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsSearchOpen(false)}
          />

          {/* Search Modal Container */}
          <div className="relative w-full max-w-3xl bg-[#F9F8F4] rounded-3xl shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-10 duration-300 flex flex-col mt-4">
            
            <form onSubmit={executeSearch} className="flex items-center px-6 py-5">
              <Search className="w-6 h-6 text-[#E27142] mr-4 shrink-0 stroke-[2.5]" />
              <input
                autoFocus
                type="text"
                placeholder="Search by book title, author, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-xl text-[#183629] placeholder-[#183629]/30 outline-none font-bold w-full"
              />
              <div className="flex items-center gap-3 shrink-0">
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-white text-[#183629]/50 text-[10px] font-bold rounded-lg border border-[#183629]/10 uppercase tracking-wider shadow-sm">
                  ESC
                </kbd>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors text-[#183629]/40 hover:text-[#E27142]"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </form>

            {/* Quick Suggestions Strip */}
            <div className="bg-white/60 px-6 py-4 border-t border-[#183629]/5 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-[#183629]/40 uppercase tracking-wider mr-2">Quick Picks</span>
              {["Fiction", "Business", "Philosophy", "Design"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchQuery(term);
                  }}
                  className="px-3.5 py-1.5 bg-white border border-[#183629]/10 rounded-full text-xs font-bold text-[#183629]/70 hover:text-[#E27142] hover:border-[#E27142] hover:bg-[#E27142]/5 transition-colors shadow-sm"
                >
                  {term}
                </button>
              ))}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}