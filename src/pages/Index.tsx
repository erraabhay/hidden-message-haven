import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Lock, Search, FileUp, LogOut, Download } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import crypto from 'crypto-js';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [searchPassword, setSearchPassword] = useState("");
  const [encodedImage, setEncodedImage] = useState<string | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [normalizedPreview, setNormalizedPreview] = useState<string | null>(null);
  const [decodedMessage, setDecodedMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isForDecode: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              setOriginalPreview(canvas.toDataURL());
              
              // Create normalized preview
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] = Math.floor(imageData.data[i] / 16) * 16;
                imageData.data[i + 1] = Math.floor(imageData.data[i + 1] / 16) * 16;
                imageData.data[i + 2] = Math.floor(imageData.data[i + 2] / 16) * 16;
              }
              ctx.putImageData(imageData, 0, 0);
              setNormalizedPreview(canvas.toDataURL());
            }
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      if (!isForDecode) {
        toast({
          title: "Image uploaded",
          description: `Selected: ${file.name}`,
        });
      }
    }
  };

  const encodeMessage = async () => {
    if (!selectedImage || !message || !password) {
      toast({
        title: "Error",
        description: "Please provide an image, message, and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert message to binary
      const binaryMessage = message.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
      ).join('');

      // Add message length at the beginning
      const messageLength = binaryMessage.length.toString(2).padStart(32, '0');
      const fullBinaryMessage = messageLength + binaryMessage;

      // Encode message
      let bitIndex = 0;
      for (let i = 0; i < data.length && bitIndex < fullBinaryMessage.length; i += 4) {
        for (let j = 0; j < 3 && bitIndex < fullBinaryMessage.length; j++) {
          const bit = parseInt(fullBinaryMessage[bitIndex]);
          data[i + j] = (data[i + j] & 0xFE) | bit;
          bitIndex++;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const encodedDataUrl = canvas.toDataURL('image/png');
      setEncodedImage(encodedDataUrl);

      // Generate unique key
      const uniqueKey = crypto.SHA256(message + password + Date.now()).toString().substr(0, 10);

      // Upload images to Supabase Storage
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("No session");

      const originalBlob = await fetch(originalPreview!).then(r => r.blob());
      const encodedBlob = await fetch(encodedDataUrl).then(r => r.blob());

      const originalPath = `${session.session.user.id}/${uniqueKey}_original.png`;
      const encodedPath = `${session.session.user.id}/${uniqueKey}_encoded.png`;

      await supabase.storage.from('images').upload(originalPath, originalBlob);
      await supabase.storage.from('images').upload(encodedPath, encodedBlob);

      // Store metadata in database
      const { error } = await supabase.from('stego_data').insert({
        user_id: session.session.user.id,
        original_image_path: originalPath,
        encoded_image_path: encodedPath,
        message: message,
        password_hash: crypto.SHA256(password).toString(),
        unique_key: uniqueKey,
        file_name: selectedImage.name,
        file_size: selectedImage.size
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Image encoded successfully! Your unique key is: ${uniqueKey}`,
      });
    } catch (error) {
      console.error('Encoding error:', error);
      toast({
        title: "Error",
        description: "Failed to encode message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const decodeMessage = async () => {
    if (!selectedImage || !password) {
      toast({
        title: "Error",
        description: "Please provide an image and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Extract message length first (32 bits)
      let binaryLength = '';
      let bitIndex = 0;
      
      for (let i = 0; i < data.length && bitIndex < 32; i += 4) {
        for (let j = 0; j < 3 && bitIndex < 32; j++) {
          binaryLength += data[i + j] & 1;
          bitIndex++;
        }
      }

      const messageLength = parseInt(binaryLength, 2);
      let binaryMessage = '';
      
      for (let i = 0; i < data.length && bitIndex < 32 + messageLength; i += 4) {
        for (let j = 0; j < 3 && bitIndex < 32 + messageLength; j++) {
          binaryMessage += data[i + j] & 1;
          bitIndex++;
        }
      }

      // Convert binary to text
      const message = binaryMessage.match(/.{8}/g)?.map(byte => 
        String.fromCharCode(parseInt(byte, 2))
      ).join('');

      if (message) {
        setDecodedMessage(message);
        toast({
          title: "Success",
          description: "Message decoded successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: "No message found in image",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Decoding error:', error);
      toast({
        title: "Error",
        description: "Failed to decode message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchStegoData = async () => {
    if (!searchKey || !searchPassword) {
      toast({
        title: "Error",
        description: "Please provide both key and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stego_data')
        .select('*')
        .eq('unique_key', searchKey)
        .eq('password_hash', crypto.SHA256(searchPassword).toString())
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data found');

      // Get image URLs
      const { data: originalUrl } = supabase.storage
        .from('images')
        .getPublicUrl(data.original_image_path);

      const { data: encodedUrl } = supabase.storage
        .from('images')
        .getPublicUrl(data.encoded_image_path);

      setOriginalPreview(originalUrl.publicUrl);
      setEncodedImage(encodedUrl.publicUrl);
      setMessage(data.message);

      toast({
        title: "Success",
        description: "Data retrieved successfully!",
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to find data with provided key and password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const downloadEncodedImage = () => {
    if (encodedImage) {
      const link = document.createElement('a');
      link.href = encodedImage;
      link.download = 'encoded_image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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

        <canvas ref={canvasRef} className="hidden" />

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
                      onChange={(e) => handleImageUpload(e)}
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

                {originalPreview && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Original</Label>
                      <img src={originalPreview} alt="Original" className="w-full rounded-lg" />
                    </div>
                    <div>
                      <Label>Normalized</Label>
                      <img src={normalizedPreview!} alt="Normalized" className="w-full rounded-lg" />
                    </div>
                    {encodedImage && (
                      <div>
                        <Label>Encoded</Label>
                        <img src={encodedImage} alt="Encoded" className="w-full rounded-lg" />
                      </div>
                    )}
                  </div>
                )}

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

                <div className="flex gap-4">
                  <Button className="w-full" onClick={encodeMessage} disabled={loading}>
                    <Lock className="mr-2 h-4 w-4" />
                    Encode Message
                  </Button>
                  {encodedImage && (
                    <Button onClick={downloadEncodedImage}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>
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
                      onChange={(e) => handleImageUpload(e, true)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button className="w-full" onClick={decodeMessage} disabled={loading}>
                  <Lock className="mr-2 h-4 w-4" />
                  Decode Message
                </Button>

                {decodedMessage && (
                  <div className="p-4 bg-secondary rounded-lg">
                    <Label>Decoded Message:</Label>
                    <p className="mt-2">{decodedMessage}</p>
                  </div>
                )}
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
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search-password">Password</Label>
                  <Input
                    id="search-password"
                    type="password"
                    placeholder="Enter password"
                    value={searchPassword}
                    onChange={(e) => setSearchPassword(e.target.value)}
                  />
                </div>

                <Button className="w-full" onClick={searchStegoData} disabled={loading}>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>

                {originalPreview && encodedImage && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Original Image</Label>
                      <img src={originalPreview} alt="Original" className="w-full rounded-lg" />
                    </div>
                    <div>
                      <Label>Encoded Image</Label>
                      <img src={encodedImage} alt="Encoded" className="w-full rounded-lg" />
                    </div>
                  </div>
                )}
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