import { Label } from "@/components/ui/label";

interface ImagePreviewProps {
  originalPreview: string | null;
  normalizedPreview: string | null;
  encodedImage: string | null;
}

export const ImagePreview = ({ originalPreview, normalizedPreview, encodedImage }: ImagePreviewProps) => {
  if (!originalPreview) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label>Original</Label>
        <img src={originalPreview} alt="Original" className="w-full rounded-lg" />
      </div>
      {normalizedPreview && (
        <div>
          <Label>Normalized</Label>
          <img src={normalizedPreview} alt="Normalized" className="w-full rounded-lg" />
        </div>
      )}
      {encodedImage && (
        <div>
          <Label>Encoded</Label>
          <img src={encodedImage} alt="Encoded" className="w-full rounded-lg" />
        </div>
      )}
    </div>
  );
};