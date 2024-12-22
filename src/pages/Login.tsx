import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Shield, Lock, Search, Image, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] to-[#D946EF] relative overflow-hidden">
      {/* Modern Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-white hover:text-white/80"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-white animate-pulse mr-4" />
            <h1 className="text-6xl font-bold text-white" style={{ 
              textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)' 
            }}>
              stego<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] to-[#D946EF]">X</span>
            </h1>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white" style={{ 
            textShadow: '0 0 10px rgba(255,255,255,0.3)' 
          }}>
            Welcome Back to the Future of Privacy
          </h2>
          <p className="text-white/90 text-xl max-w-2xl mx-auto">
            Sign in to continue your journey with advanced steganography
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 transform transition-all hover:scale-105">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-[#9b87f5] to-[#D946EF] rounded-full">
                <Image className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Encode</h3>
              <p className="text-white/80">
                Hide messages within images using advanced steganography
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 transform transition-all hover:scale-105">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-[#9b87f5] to-[#D946EF] rounded-full">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Decode</h3>
              <p className="text-white/80">
                Extract hidden messages with password protection
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 transform transition-all hover:scale-105">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-[#9b87f5] to-[#D946EF] rounded-full">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Search</h3>
              <p className="text-white/80">
                Easily manage and find your encoded messages
              </p>
            </div>
          </div>
        </div>

        {/* Auth Section */}
        <div className="max-w-md mx-auto">
          <Card className="p-8 bg-white/10 backdrop-blur-lg border-0">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">Welcome to stegoX</h2>
              <p className="text-white/80">
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
                      brand: '#9b87f5',
                      brandAccent: '#D946EF',
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