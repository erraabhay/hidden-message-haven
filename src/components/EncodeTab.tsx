import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Lock, Download } from "lucide-react";
import { ImagePreview } from "./ImagePreview";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import crypto from 'crypto-js';

export const EncodeTab = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [encodedImage, setEncodedImage] = useState<string | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [normalizedPreview, setNormalizedPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      toast({
        title: "Image uploaded",
        description: `Selected: ${file.name}`,
      });
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
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />
      
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

      <ImagePreview
        originalPreview={originalPreview}
        normalizedPreview={normalizedPreview}
        encodedImage={encodedImage}
      />

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
    </div>
  );
};