import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileUp, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CryptoJS from 'crypto-js';

export const DecodeTab = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [decodedMessage, setDecodedMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
            }
          }
          setImagePreview(img.src);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
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
      if (!canvas) {
        throw new Error("Canvas not initialized");
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Get message length from first 32 bits
      let binaryLength = '';
      for (let i = 0; i < 32; i++) {
        const pixelIndex = i * 4;
        const bit = data[pixelIndex] & 1;
        binaryLength += bit;
      }
      
      const messageLength = parseInt(binaryLength, 2) * 8;
      console.log("Detected message length:", messageLength);

      // Validate message length
      if (messageLength <= 0) {
        throw new Error("No hidden message detected in this image");
      }
      
      if (messageLength > (data.length - 128)) { // Leave space for header
        throw new Error("Invalid message length - the image appears to be corrupted");
      }

      let binaryMessage = '';
      // Extract the message bits
      for (let i = 32; i < 32 + messageLength; i++) {
        const pixelIndex = i * 4;
        if (pixelIndex < data.length) {
          const bit = data[pixelIndex] & 1;
          binaryMessage += bit;
        }
      }

      // Convert binary to text
      let message = '';
      for (let i = 0; i < binaryMessage.length; i += 8) {
        const byte = binaryMessage.substr(i, 8);
        const charCode = parseInt(byte, 2);
        message += String.fromCharCode(charCode);
      }

      // Attempt to decrypt
      try {
        const decrypted = CryptoJS.AES.decrypt(message, password).toString(CryptoJS.enc.Utf8);
        if (!decrypted) {
          throw new Error("Incorrect password");
        }
        setDecodedMessage(decrypted);
        toast({
          title: "Success",
          description: "Message decoded successfully!",
        });
      } catch (error) {
        console.error("Decryption error:", error);
        toast({
          title: "Error",
          description: "Incorrect password or corrupted message",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Decoding error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to decode message",
        variant: "destructive",
      });
      setDecodedMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="space-y-2">
        <Label htmlFor="decode-image">Upload Image</Label>
        <div className="flex items-center gap-4">
          <Input
            id="decode-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
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

      {imagePreview && (
        <div className="mt-4">
          <Label>Selected Image</Label>
          <img src={imagePreview} alt="Selected" className="mt-2 max-w-full h-auto rounded-lg" />
        </div>
      )}

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

      <Button 
        className="w-full" 
        onClick={decodeMessage} 
        disabled={loading || !selectedImage || !password}
      >
        <Lock className="mr-2 h-4 w-4" />
        {loading ? "Decoding..." : "Decode Message"}
      </Button>

      {decodedMessage && (
        <div className="p-4 bg-secondary rounded-lg">
          <Label>Decoded Message:</Label>
          <p className="mt-2 whitespace-pre-wrap">{decodedMessage}</p>
        </div>
      )}
    </div>
  );
};