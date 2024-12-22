import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Shield } from "lucide-react";

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
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-between min-h-screen">
        {/* Hero Section */}
        <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <Shield className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-5xl font-bold">
              stego<span className="text-primary">X</span>
            </h1>
          </div>
          <h2 className="text-3xl font-semibold mb-4">
            Secure Your Messages with Steganography
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Hide your confidential messages within images using advanced steganography techniques.
            Protect your privacy with military-grade encryption.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-card rounded-lg shadow-lg">
              <h3 className="font-semibold mb-2">Encode</h3>
              <p className="text-sm text-muted-foreground">Hide messages securely within images</p>
            </div>
            <div className="p-4 bg-card rounded-lg shadow-lg">
              <h3 className="font-semibold mb-2">Decode</h3>
              <p className="text-sm text-muted-foreground">Extract hidden messages safely</p>
            </div>
            <div className="p-4 bg-card rounded-lg shadow-lg">
              <h3 className="font-semibold mb-2">Search</h3>
              <p className="text-sm text-muted-foreground">Find your encoded messages</p>
            </div>
          </div>
        </div>

        {/* Auth Section */}
        <div className="lg:w-5/12">
          <div className="bg-card p-8 rounded-lg shadow-xl">
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
                      brand: 'rgb(var(--primary))',
                      brandAccent: 'rgb(var(--primary))',
                    },
                  },
                },
              }}
              providers={[]}
              theme="dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;