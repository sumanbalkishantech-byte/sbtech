"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UploadCloud, BookOpen, Loader2 } from "lucide-react";

export default function SellBookPage() {
  const router = useRouter();
  
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    condition: "Good",
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("description", formData.description);
    data.append("condition", formData.condition);
    if (image) data.append("images", image);

    try {
      const token = localStorage.getItem("token");
      
      await axios.post("https://sbtech-production.up.railway.app/api/books/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ text: "Book submitted successfully! Pending admin approval.", type: "success" });
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data?.error || "Error uploading book. Are you logged in?", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#F9F8F4]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E27142]" />
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-80px)] py-12 px-6 bg-[#F9F8F4] overflow-hidden">
      
      {/* Seamless Washi Paper Texture */}
      <div 
        className="absolute inset-0 z-0 mix-blend-multiply opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-[#183629]/5 p-8 md:p-12 relative z-10">
        
        <div className="flex items-center gap-4 mb-8 border-b border-[#183629]/5 pb-6">
          <div className="bg-[#E27142] text-white p-3.5 rounded-2xl shadow-[0_8px_20px_rgba(226,113,66,0.2)]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#183629] tracking-tight">List a Book</h1>
            <p className="text-[#183629]/60 mt-1 font-medium">Provide details and an image for admin review.</p>
          </div>
        </div>

        {message.text && (
          <div className={`mb-8 p-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center ${message.type === 'success' ? 'bg-[#183629]/5 text-[#183629] border border-[#183629]/10' : 'bg-red-50 text-red-600 border border-red-100'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest pl-1">Book Title</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3.5 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl focus:bg-white focus:border-[#E27142] transition-all outline-none font-bold text-[#183629] placeholder-[#183629]/30" />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest pl-1">Author</label>
              <input type="text" required value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full px-4 py-3.5 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl focus:bg-white focus:border-[#E27142] transition-all outline-none font-bold text-[#183629] placeholder-[#183629]/30" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest pl-1">Description</label>
            <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3.5 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl focus:bg-white focus:border-[#E27142] transition-all outline-none resize-none font-medium text-[#183629]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest pl-1">Condition</label>
              <select value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} className="w-full px-4 py-3.5 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl focus:bg-white focus:border-[#E27142] transition-all outline-none appearance-none font-bold text-[#183629] cursor-pointer">
                <option value="Like_New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest pl-1">Upload Image</label>
              <div className="relative">
                <input type="file" required accept="image/*" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#F9F8F4] text-[#183629] border border-[#183629]/10 hover:border-[#E27142] hover:text-[#E27142] rounded-xl cursor-pointer transition-colors font-bold text-sm h-[52px]">
                  <UploadCloud className="w-5 h-5" />
                  {image ? image.name.substring(0, 20) + "..." : "Choose File"}
                </label>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-[#183629] hover:bg-[#12291f] text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-[#183629]/20 hover:-translate-y-1 disabled:opacity-70 mt-6">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit for Review"}
          </button>
        </form>

      </div>
    </main>
  );
}