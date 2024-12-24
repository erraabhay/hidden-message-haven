import { Button } from "@/components/ui/button";
import { Shield, Lock, Search, Image } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-5xl font-bold">
              stego<span className="text-primary">X</span>
            </h1>
          </div>
          <h2 className="text-3xl font-semibold mb-4">
            Secure Your Messages with Advanced Steganography
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Hide your confidential messages within images using cutting-edge steganography techniques.
            Protect your privacy with military-grade encryption.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <Image className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Encode</h3>
              <p className="text-muted-foreground">
                Seamlessly hide your messages within images using advanced steganography
              </p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <Lock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Decode</h3>
              <p className="text-muted-foreground">
                Securely extract hidden messages with password protection
              </p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <Search className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-muted-foreground">
                Easily manage and find your encoded messages
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;