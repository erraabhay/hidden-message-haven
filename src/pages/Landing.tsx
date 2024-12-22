import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Lock, Search, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] to-[#D946EF] relative overflow-hidden">
      {/* Modern Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulse ${2 + i}s infinite`,
              opacity: 0.3,
            }}
          >
            <Sparkles className="text-white w-8 h-8" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-20 w-20 text-white animate-pulse mr-4" />
            <h1 className="text-7xl font-bold text-white tracking-tight" style={{ 
              textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)' 
            }}>
              stego<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] to-[#D946EF]">X</span>
            </h1>
          </div>
          <h2 className="text-5xl font-bold mb-6 text-white max-w-4xl mx-auto leading-tight" style={{ 
            textShadow: '0 0 10px rgba(255,255,255,0.3)' 
          }}>
            Next-Gen Steganography for the Modern Age
          </h2>
          <p className="text-white/90 text-xl max-w-2xl mx-auto leading-relaxed">
            Hide your messages within images using cutting-edge technology. 
            Military-grade encryption meets intuitive design.
          </p>
          <Button 
            onClick={() => navigate("/login")}
            className="bg-white text-[#9b87f5] hover:bg-white/90 font-semibold text-lg px-8 py-6 rounded-full transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 transform transition-all hover:scale-105">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-[#9b87f5] to-[#D946EF] rounded-full">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Secure Encoding</h3>
              <p className="text-white/80">
                Advanced steganography techniques to hide your messages securely
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 transform transition-all hover:scale-105">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-[#9b87f5] to-[#D946EF] rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Private Decoding</h3>
              <p className="text-white/80">
                Extract hidden messages with password protection
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 transform transition-all hover:scale-105">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-[#9b87f5] to-[#D946EF] rounded-full">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Smart Search</h3>
              <p className="text-white/80">
                Easily manage and find your encoded messages
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;