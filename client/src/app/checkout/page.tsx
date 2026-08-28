"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCartStore } from "@/store/useCartStore";
import { 
  CreditCard, CheckCircle, MapPin, IndianRupee, Loader2, 
  ShieldCheck, ArrowLeft, Mail, TicketPercent, Wallet
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  
  // Payment State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponStatus, setCouponStatus] = useState<{type: 'success'|'error'|'', msg: string}>({type: '', msg: ''});

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    city: "",
    pinCode: "",
  });

  useEffect(() => {
    setIsMounted(true);
    // Protect the route: If cart is empty and they haven't just succeeded, boot them out
    if (items.length === 0 && !isSuccess) {
      router.push("/catalog");
    }
  }, [items, router, isSuccess]);

  if (!isMounted) return null;

  // Calculations
  const subtotal = getTotal();
  const shipping = 50;
  const total = subtotal + shipping - discountAmount;

  // Simulated Coupon Logic
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponStatus({ type: '', msg: '' });

    setTimeout(() => {
      setIsApplyingCoupon(false);
      const code = couponCode.toUpperCase();
      
      if (code === "SKDS20") {
        const discount = Math.floor(subtotal * 0.20);
        setDiscountAmount(discount);
        setCouponStatus({ type: 'success', msg: 'Agency 20% discount applied!' });
      } else if (code === "GMI15") {
        const discount = Math.floor(subtotal * 0.15);
        setDiscountAmount(discount);
        setCouponStatus({ type: 'success', msg: 'VIP 15% discount applied!' });
      } else {
        setDiscountAmount(0);
        setCouponStatus({ type: 'error', msg: 'Invalid or expired coupon code.' });
      }
    }, 800);
  };

  // REAL Backend Order Processing
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Please log in to complete your purchase.");
        router.push("/login");
        return;
      }
      
      const response = await axios.post(
        "https://sbtech-production.up.railway.app/api/orders",
        { items, totalAmount: total, paymentMethod, shippingAddress: formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsProcessing(false);
      setIsSuccess(true);
      
      setOrderId(`ORD-${response.data._id.substring(0, 6).toUpperCase()}`);
      clearCart(); 

      setTimeout(() => {
        router.push("/dashboard");
      }, 4000); 
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      alert("Payment failed. Please check your connection and try again.");
    }
  };

  // --- SUCCESS SCREEN ---
  if (isSuccess) {
    return (
      <main className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-[#F9F8F4] p-6 overflow-hidden">
        
        {/* Washi Paper Texture */}
        <div 
          className="absolute inset-0 z-0 mix-blend-multiply opacity-[0.2] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-[#183629]/5 text-center max-w-lg w-full relative z-10 animate-in zoom-in duration-500">
          <div className="mx-auto bg-[#F9F8F4] border border-[#183629]/10 w-24 h-24 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-[#183629]" />
          </div>
          <h1 className="text-3xl font-black text-[#183629] mb-2">Order Confirmed!</h1>
          <p className="text-[#183629]/60 font-medium mb-6">
            Thank you, {formData.fullName.split(" ")[0] || "Guest"}. A confirmation has been sent to <span className="text-[#183629] font-bold">{formData.email}</span>.
          </p>
          
          <div className="bg-[#F9F8F4] rounded-2xl p-6 mb-8 border border-[#183629]/5">
            <p className="text-xs text-[#183629]/50 uppercase tracking-widest font-bold mb-2">Order Number</p>
            <p className="text-2xl font-black text-[#E27142] tracking-widest">{orderId}</p>
            <p className="text-xs text-[#183629]/60 mt-3 font-bold uppercase tracking-wider">Payment Method: {paymentMethod}</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-[#183629]/60 font-bold animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting to your Dashboard...
          </div>
        </div>
      </main>
    );
  }

  // --- CHECKOUT FORM ---
  return (
    <main className="relative min-h-[calc(100vh-80px)] py-12 px-6 bg-[#F9F8F4] overflow-hidden">
      
      {/* Washi Paper Texture */}
      <div 
        className="absolute inset-0 z-0 mix-blend-multiply opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#183629]/50 hover:text-[#E27142] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Cart
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* LEFT: Forms */}
          <div className="flex-1 space-y-8">
            <h1 className="text-4xl font-black text-[#183629] tracking-tight">Checkout</h1>
            
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-8">
              
              {/* CONTACT INFORMATION */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#183629]/5">
                <div className="flex items-center gap-3 mb-8 border-b border-[#183629]/5 pb-4">
                  <Mail className="w-5 h-5 text-[#E27142]" />
                  <h2 className="text-xl font-bold text-[#183629]">Contact Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest">Email Address</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3.5 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl focus:bg-white focus:border-[#E27142] outline-none transition-colors text-[#183629] font-medium placeholder-[#183629]/30" placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#183629]/50 font-bold">+91</span>
                      <input required type="tel" pattern="[0-9]{10}" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full pl-14 pr-4 py-3.5 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl focus:bg-white focus:border-[#E27142] outline-none transition-colors text-[#183629] font-medium placeholder-[#183629]/30" placeholder="9876543210" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SHIPPING INFORMATION */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#183629]/5">
                <div className="flex items-center gap-3 mb-8 border-b border-[#183629]/5 pb-4">
                  <MapPin className="w-5 h-5 text-[#E27142]" />
                  <h2 className="text-xl font-bold text-[#183629]">Shipping Details</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest">Full Name</label>
                    <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3.5 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl focus:bg-white focus:border-[#E27142] outline-none transition-colors text-[#183629] font-medium placeholder-[#183629]/30" placeholder="John Doe" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest">Full Address</label>
                    <textarea required rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3.5 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl focus:bg-white focus:border-[#E27142] outline-none transition-colors resize-none text-[#183629] font-medium placeholder-[#183629]/30" placeholder="123 Market Street, Apt 4B" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest">City</label>
                      <input required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3.5 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl focus:bg-white focus:border-[#E27142] outline-none transition-colors text-[#183629] font-medium placeholder-[#183629]/30" placeholder="Mumbai" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#183629]/50 uppercase tracking-widest">PIN Code</label>
                      <input required type="text" pattern="[0-9]{6}" value={formData.pinCode} onChange={(e) => setFormData({...formData, pinCode: e.target.value})} className="w-full px-4 py-3.5 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl focus:bg-white focus:border-[#E27142] outline-none transition-colors text-[#183629] font-medium placeholder-[#183629]/30" placeholder="400001" />
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD SELECTION */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#183629]/5">
                <div className="flex items-center gap-3 mb-8 border-b border-[#183629]/5 pb-4">
                  <Wallet className="w-5 h-5 text-[#E27142]" />
                  <h2 className="text-xl font-bold text-[#183629]">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  {/* UPI Option */}
                  <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[#183629] bg-[#183629]/5' : 'border-[#183629]/10 hover:border-[#183629]/20 bg-white'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-[#183629] border-[#183629]/20 focus:ring-[#183629] cursor-pointer" />
                      <span className="font-bold text-[#183629]">UPI (GPay, PhonePe, Paytm)</span>
                    </div>
                    {paymentMethod === 'upi' && <CheckCircle className="w-6 h-6 text-[#E27142]" />}
                  </label>

                  {/* Card Option */}
                  <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#183629] bg-[#183629]/5' : 'border-[#183629]/10 hover:border-[#183629]/20 bg-white'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-[#183629] border-[#183629]/20 focus:ring-[#183629] cursor-pointer" />
                      <span className="font-bold text-[#183629]">Credit / Debit Card</span>
                    </div>
                    {paymentMethod === 'card' && <CheckCircle className="w-6 h-6 text-[#E27142]" />}
                  </label>

                  {/* COD Option */}
                  <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#183629] bg-[#183629]/5' : 'border-[#183629]/10 hover:border-[#183629]/20 bg-white'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-[#183629] border-[#183629]/20 focus:ring-[#183629] cursor-pointer" />
                      <span className="font-bold text-[#183629]">Cash on Delivery (COD)</span>
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle className="w-6 h-6 text-[#E27142]" />}
                  </label>
                </div>
              </div>

            </form>
          </div>

          {/* RIGHT: Order Summary & Pay */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#183629]/5 sticky top-28">
              <h2 className="text-xl font-bold text-[#183629] mb-8">Order Summary</h2>
              
              {/* Item List */}
              <div className="space-y-5 mb-8">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between items-start text-sm">
                    <span className="text-[#183629]/70 pr-4 font-medium leading-tight">{item.title}</span>
                    <span className="text-[#183629] font-bold whitespace-nowrap">₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Engine */}
              <div className="mb-8 pt-8 border-t border-[#183629]/10">
                <label className="flex items-center gap-2 text-xs font-bold text-[#183629]/50 uppercase tracking-widest mb-3">
                  <TicketPercent className="w-4 h-4 text-[#E27142]" />
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code" 
                    className="w-full px-4 py-3 bg-[#F9F8F4] border border-[#183629]/10 rounded-xl focus:bg-white focus:border-[#E27142] outline-none uppercase font-bold text-sm transition-colors text-[#183629]"
                  />
                  <button 
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="bg-[#183629] hover:bg-[#12291f] text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-50"
                  >
                    {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
                {couponStatus.msg && (
                  <p className={`text-xs font-bold mt-3 pl-1 uppercase tracking-wider ${couponStatus.type === 'success' ? 'text-[#183629]' : 'text-red-500'}`}>
                    {couponStatus.msg}
                  </p>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-5 text-sm font-medium text-[#183629]/70 mb-8 pb-8 border-b border-[#183629]/10 pt-8 border-t border-dashed border-[#183629]/20">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="text-[#183629] font-bold flex items-center"><IndianRupee className="w-3.5 h-3.5" />{subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Standard Shipping</span>
                  <span className="text-[#183629] font-bold flex items-center"><IndianRupee className="w-3.5 h-3.5" />{shipping}</span>
                </div>
                
                {/* Dynamic Discount Line */}
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-[#E27142] font-bold">
                    <span>Discount Applied</span>
                    <span className="flex items-center">- <IndianRupee className="w-3.5 h-3.5 ml-1" />{discountAmount}</span>
                  </div>
                )}
              </div>

              {/* Final Total */}
              <div className="flex justify-between items-center mb-10">
                <span className="text-lg font-bold text-[#183629]">Total to Pay</span>
                <span className="text-4xl font-black text-[#E27142] flex items-center tracking-tighter">
                  <IndianRupee className="w-8 h-8 mr-0.5 opacity-90" />{Math.max(0, total)}
                </span>
              </div>

              {/* Submit Form Button */}
              <button 
                form="checkout-form"
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-[#E27142] hover:bg-[#c45a31] text-white py-5 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-[#E27142]/20 hover:-translate-y-1 disabled:opacity-80"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    {paymentMethod === 'cod' ? 'Confirm Order' : 'Pay Securely'}
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-[#183629]/40 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                256-bit SSL Encrypted
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}