import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import EncodeTab from "@/components/EncodeTab";
import DecodeTab from "@/components/DecodeTab";
import SearchTab from "@/components/SearchTab";
import { LogOut } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: "Please try again",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] to-[#D946EF] p-4 sm:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">stegoX Dashboard</h1>
          <Button 
            variant="secondary" 
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-white/90"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
          <Tabs defaultValue="encode" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
              <TabsTrigger value="search">Search</TabsTrigger>
            </TabsList>
            <TabsContent value="encode">
              <EncodeTab />
            </TabsContent>
            <TabsContent value="decode">
              <DecodeTab />
            </TabsContent>
            <TabsContent value="search">
              <SearchTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;