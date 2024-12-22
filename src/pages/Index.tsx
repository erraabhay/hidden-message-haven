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
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white" style={{ textShadow: '2px 2px 0px #FF6B6B, 4px 4px 0px #4ECDC4' }}>
            stego<span className="text-[#FF6B6B]">X</span>
          </h1>
          <Button variant="outline" onClick={handleLogout} className="bg-white/90 hover:bg-white border-2 border-[#FF6B6B] text-[#FF6B6B] font-bold">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="encode" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/90 p-1 gap-1">
            <TabsTrigger 
              value="encode" 
              className="data-[state=active]:bg-[#FF6B6B] data-[state=active]:text-white"
            >
              Encode
            </TabsTrigger>
            <TabsTrigger 
              value="decode"
              className="data-[state=active]:bg-[#4ECDC4] data-[state=active]:text-white"
            >
              Decode
            </TabsTrigger>
            <TabsTrigger 
              value="search"
              className="data-[state=active]:bg-[#FF6B6B] data-[state=active]:text-white"
            >
              Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encode">
            <Card className="border-4 border-[#FF6B6B] bg-white/90">
              <CardContent className="space-y-4 pt-6">
                <EncodeTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decode">
            <Card className="border-4 border-[#4ECDC4] bg-white/90">
              <CardContent className="space-y-4 pt-6">
                <DecodeTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Card className="border-4 border-[#FF6B6B] bg-white/90">
              <CardContent className="space-y-4 pt-6">
                <SearchTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="text-center text-sm text-white mt-8">
          © {new Date().getFullYear()} stegoX. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Index;