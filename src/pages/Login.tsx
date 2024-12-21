import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome!",
          description: "Successfully signed in",
        });
        navigate("/");
      }
      if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "Successfully signed out",
        });
      }
      if (event === "USER_UPDATED") {
        console.log("User was updated:", session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            stego<span className="text-primary">X</span>
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your secure messages
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <div className="mb-4 text-sm text-muted-foreground">
            <p>Important notes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Password must be at least 6 characters</li>
              <li>Use a valid email format</li>
              <li>If you're new, please sign up first</li>
            </ul>
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
          />
        </div>
      </div>
    </div>
  );
};

export default Login;