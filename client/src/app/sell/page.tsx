"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UploadCloud, BookOpen, Loader2 } from "lucide-react";

export default function SellBookPage() {
  const router = useRouter();
  
  // New state to prevent the form from flashing before redirect
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

  // AUTHENTICATION CHECK: Run this the exact moment the page loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token exists, bounce them to the login page instantly
      router.push("/login");
    } else {
      // If they have a token, reveal the form
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
      
      await axios.post("http://localhost:5000/api/books/upload", data, {
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

  // Show a loading screen while we check their JWT token
  if (isCheckingAuth) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] py-12 px-6 bg-gray-50/50">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
        
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-3 rounded-2xl shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">List a Book for Sale</h1>
            <p className="text-sm text-gray-500">Provide details and an image for admin review.</p>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium text-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Book Title</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none" />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Author</label>
              <input type="text" required value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Condition</label>
              <select value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none appearance-none">
                <option value="Like_New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Upload Image</label>
              <div className="relative">
                <input type="file" required accept="image/*" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 rounded-xl cursor-pointer transition-colors font-medium text-sm">
                  <UploadCloud className="w-5 h-5" />
                  {image ? image.name.substring(0, 20) + "..." : "Choose File"}
                </label>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-70 mt-4">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit for Review"}
          </button>
        </form>

      </div>
    </main>
  );
}