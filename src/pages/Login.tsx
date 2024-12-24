import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Shield, Lock, Search, Image } from "lucide-react";
import { Card } from "@/components/ui/card";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/app");
      }
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/app");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="block text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-5xl font-bold">
              stego<span className="text-primary">X</span>
            </h1>
          </div>
        </Link>

        {/* Auth Section */}
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
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