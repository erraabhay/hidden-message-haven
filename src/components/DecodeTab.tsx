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
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let binaryMessage = '';
      let messageLength = 0;
      let index = 0;

      // First, get the message length (first 32 bits)
      for (let i = 0; i < 32; i++) {
        const pixelIndex = i * 4;
        const bit = data[pixelIndex] & 1;
        binaryMessage += bit;
      }
      messageLength = parseInt(binaryMessage, 2) * 8;
      binaryMessage = '';

      // Then get the actual message
      for (let i = 32; i < 32 + messageLength; i++) {
        const pixelIndex = i * 4;
        if (pixelIndex < data.length) {
          const bit = data[pixelIndex] & 1;
          binaryMessage += bit;
          index++;
        }
      }

      // Convert binary to text
      let message = '';
      for (let i = 0; i < binaryMessage.length; i += 8) {
        const byte = binaryMessage.substr(i, 8);
        const charCode = parseInt(byte, 2);
        message += String.fromCharCode(charCode);
      }

      // Decrypt the message
      try {
        const decrypted = CryptoJS.AES.decrypt(message, password).toString(CryptoJS.enc.Utf8);
        if (decrypted) {
          setDecodedMessage(decrypted);
          toast({
            title: "Success",
            description: "Message decoded successfully!",
          });
        } else {
          toast({
            title: "Error",
            description: "Invalid password or corrupted message",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to decrypt message. Invalid password or corrupted data.",
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