import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Lock, Search, FileUp, LogOut } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      toast({
        title: "Image uploaded",
        description: `Selected: ${file.name}`,
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "Successfully signed out",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            stego<span className="text-primary">X</span>
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="encode" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>

          <TabsContent value="encode">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="upload-image">Upload Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="upload-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => document.getElementById("upload-image")?.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Select Image
                    </Button>
                  </div>
                  {selectedImage && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedImage.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Secret Message</Label>
                  <Input
                    id="message"
                    placeholder="Enter your secret message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  Encode Message
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decode">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="decode-image">Upload Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="decode-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      onClick={() => document.getElementById("decode-image")?.click()}
                      className="w-full"
                    >
                      <FileUp className="mr-2 h-4 w-4" />
                      Select Image to Decode
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decode-password">Password</Label>
                  <Input
                    id="decode-password"
                    type="password"
                    placeholder="Enter password to decode"
                  />
                </div>

                <Button className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  Decode Message
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="search-key">Unique Key</Label>
                  <Input
                    id="search-key"
                    placeholder="Enter the unique key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search-password">Password</Label>
                  <Input
                    id="search-password"
                    type="password"
                    placeholder="Enter password"
                  />
                </div>

                <Button className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="text-center text-sm text-muted-foreground mt-8">
          © {new Date().getFullYear()} stegoX. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Index;
