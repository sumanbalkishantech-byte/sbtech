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
      <nav className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/70 backdrop-blur-xl shadow-sm transition-all">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-2 rounded-xl group-hover:scale-105 transition-transform shadow-md shadow-indigo-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Market<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Engine</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-full border border-gray-200/50">
            <Link href="/catalog?type=new" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-white rounded-full transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50">
              New Arrivals
            </Link>
            <Link href="/catalog?type=used" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-white rounded-full transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50">
              Pre-Loved
            </Link>
            <Link href="#" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-white rounded-full transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50">
              Services
            </Link>
          </div>

          {/* Icons & CTA Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-5 text-gray-600">
              
              {/* MAGNIFYING GLASS -> OPENS SEARCH MODAL */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search" 
                className="hover:text-indigo-600 transition-colors"
              >
                <Search className="w-5 h-5 stroke-[2]" />
              </button>

              {isLoggedIn ? (
                <>
                  {userData?.role !== "super_admin" && (
                    <Link href="/cart" aria-label="Cart" className="hover:text-indigo-600 transition-colors relative">
                      <ShoppingBag className="w-5 h-5 stroke-[2]" />
                      {isMounted && cartItems.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                          {cartItems.length}
                        </span>
                      )}
                    </Link>
                  )}

                  <Link href={userData?.role === "super_admin" ? "/admin" : "/dashboard"} className="flex items-center gap-2 hover:text-indigo-600 transition-colors font-medium text-sm">
                    <User className="w-5 h-5 stroke-[2]" />
                    <span className="hidden lg:block">{userData?.name.split(" ")[0]}</span>
                  </Link>

                  <button onClick={handleLogout} aria-label="Logout" className="hover:text-rose-500 transition-colors">
                    <LogOut className="w-5 h-5 stroke-[2]" />
                  </button>
                </>
              ) : (
                <Link href="/login" className="hover:text-indigo-600 transition-colors font-medium text-sm">
                  Sign In
                </Link>
              )}
            </div>

            {!isLoggedIn ? (
              <Link href="/register" className="hidden lg:flex items-center gap-2 bg-gray-900 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5">
                Create Account
              </Link>
            ) : userData?.role === "super_admin" ? (
              <Link href="/admin" className="hidden lg:flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5">
                Admin Panel
              </Link>
            ) : (
              <Link href="/sell" className="hidden lg:flex items-center gap-2 bg-gray-900 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5">
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
            className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsSearchOpen(false)}
          />

          {/* Search Modal Container */}
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-10 duration-300 flex flex-col mt-4">
            
            <form onSubmit={executeSearch} className="flex items-center px-6 py-5">
              <Search className="w-6 h-6 text-indigo-600 mr-4 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search by book title, author, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-xl text-gray-900 placeholder-gray-400 outline-none font-medium w-full"
              />
              <div className="flex items-center gap-3 shrink-0">
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-200 uppercase tracking-wider">
                  ESC
                </kbd>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                >
                  <X className="w-5 h-5 stroke-[2]" />
                </button>
              </div>
            </form>

            {/* Quick Suggestions Strip */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Quick Picks</span>
              {["Engineering", "Programming", "Mathematics", "Fiction"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchQuery(term);
                  }}
                  className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors shadow-sm"
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