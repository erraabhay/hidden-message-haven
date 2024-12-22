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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-5xl font-bold">
              stego<span className="text-primary">X</span>
            </h1>
          </div>
          <h2 className="text-3xl font-semibold mb-4">
            Secure Your Messages with Advanced Steganography
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hide your confidential messages within images using cutting-edge steganography techniques.
            Protect your privacy with military-grade encryption.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <Image className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Encode</h3>
              <p className="text-muted-foreground">
                Seamlessly hide your messages within images using advanced steganography
              </p>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <Lock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Decode</h3>
              <p className="text-muted-foreground">
                Securely extract hidden messages with password protection
              </p>
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <Search className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-muted-foreground">
                Easily manage and find your encoded messages
              </p>
            </div>
          </Card>
        </div>

        {/* Auth Section */}
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold mb-2">Welcome to stegoX</h2>
              <p className="text-muted-foreground">
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
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary))',
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