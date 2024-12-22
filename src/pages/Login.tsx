import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Shield, Lock, Search, Image } from "lucide-react";
import { Card } from "@/components/ui/card";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] relative overflow-hidden">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="container mx-auto px-4 py-8 relative">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-white animate-pulse mr-4" />
            <h1 className="text-6xl font-bold text-white" style={{ textShadow: '3px 3px 0px #FF6B6B, 6px 6px 0px #4ECDC4' }}>
              stego<span className="text-[#FF6B6B]">X</span>
            </h1>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white" style={{ textShadow: '2px 2px 0px #FF6B6B' }}>
            Secure Your Messages with Advanced Steganography
          </h2>
          <p className="text-white text-xl max-w-2xl mx-auto">
            Hide your confidential messages within images using cutting-edge steganography techniques.
            Protect your privacy with military-grade encryption.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-neon transition-all duration-300 bg-white/90 border-4 border-[#FF6B6B]">
            <div className="flex flex-col items-center text-center">
              <Image className="h-12 w-12 text-[#FF6B6B] mb-4" />
              <h3 className="text-xl font-bold mb-2 text-[#FF6B6B]">Encode</h3>
              <p className="text-gray-700">
                Seamlessly hide your messages within images using advanced steganography
              </p>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-neon transition-all duration-300 bg-white/90 border-4 border-[#4ECDC4]">
            <div className="flex flex-col items-center text-center">
              <Lock className="h-12 w-12 text-[#4ECDC4] mb-4" />
              <h3 className="text-xl font-bold mb-2 text-[#4ECDC4]">Decode</h3>
              <p className="text-gray-700">
                Securely extract hidden messages with password protection
              </p>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-neon transition-all duration-300 bg-white/90 border-4 border-[#FF6B6B]">
            <div className="flex flex-col items-center text-center">
              <Search className="h-12 w-12 text-[#FF6B6B] mb-4" />
              <h3 className="text-xl font-bold mb-2 text-[#FF6B6B]">Search</h3>
              <p className="text-gray-700">
                Easily manage and find your encoded messages
              </p>
            </div>
          </Card>
        </div>

        {/* Auth Section */}
        <div className="max-w-md mx-auto">
          <Card className="p-8 bg-white/90 border-4 border-[#4ECDC4] shadow-neon">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2 text-[#4ECDC4]">Welcome to stegoX</h2>
              <p className="text-gray-700">
                Sign in or create an account to get started
              </p>
            </div>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#4ECDC4',
                      brandAccent: '#FF6B6B',
                    },
                  },
                },
                className: {
                  container: 'w-full',
                  button: 'w-full px-4 py-2 rounded-md',
                  input: 'w-full px-3 py-2 rounded-md border',
                }
              }}
              providers={[]}
              theme="dark"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;