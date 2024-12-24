import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImagePreview } from "./ImagePreview";
import crypto from 'crypto-js';

export const SearchTab = () => {
  const [searchKey, setSearchKey] = useState("");
  const [searchPassword, setSearchPassword] = useState("");
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [encodedImage, setEncodedImage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    setOriginalPreview(null);
    setEncodedImage(null);
    setMessage("");

    try {
      console.log("Searching with key:", searchKey);
      const { data, error } = await supabase
        .from('stego_data')
        .select()
        .eq('unique_key', searchKey)
        .eq('password_hash', crypto.SHA256(searchPassword).toString())
        .single();

      if (error) {
        console.error('Search error:', error);
        toast({
          title: "Error",
          description: "Invalid unique key or password",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        toast({
          title: "Error",
          description: "No data found with provided key and password",
          variant: "destructive",
        });
        return;
      }

      console.log("Found stego data:", data);

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
        description: "Invalid unique key or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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
        {loading ? "Searching..." : "Search"}
      </Button>

      <ImagePreview
        originalPreview={originalPreview}
        normalizedPreview={null}
        encodedImage={encodedImage}
      />

      {message && (
        <div className="p-4 bg-secondary rounded-lg">
          <Label>Hidden Message:</Label>
          <p className="mt-2">{message}</p>
        </div>
      )}
    </div>
  );
};