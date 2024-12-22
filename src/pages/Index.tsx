import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { EncodeTab } from "@/components/EncodeTab";
import { DecodeTab } from "@/components/DecodeTab";
import { SearchTab } from "@/components/SearchTab";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "Successfully signed out",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] to-[#D946EF] p-6 relative">
      {/* Modern Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white" style={{ 
            textShadow: '0 0 10px rgba(255,255,255,0.3)' 
          }}>
            stego<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] to-[#D946EF]">X</span>
          </h1>
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="encode" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-lg p-1 gap-1">
            <TabsTrigger 
              value="encode" 
              className="text-white data-[state=active]:bg-white/20"
            >
              Encode
            </TabsTrigger>
            <TabsTrigger 
              value="decode"
              className="text-white data-[state=active]:bg-white/20"
            >
              Decode
            </TabsTrigger>
            <TabsTrigger 
              value="search"
              className="text-white data-[state=active]:bg-white/20"
            >
              Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encode">
            <Card className="bg-white/10 backdrop-blur-lg border-0">
              <CardContent className="space-y-4 pt-6">
                <EncodeTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decode">
            <Card className="bg-white/10 backdrop-blur-lg border-0">
              <CardContent className="space-y-4 pt-6">
                <DecodeTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Card className="bg-white/10 backdrop-blur-lg border-0">
              <CardContent className="space-y-4 pt-6">
                <SearchTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="text-center text-sm text-white/80 mt-8">
          © {new Date().getFullYear()} stegoX. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Index;