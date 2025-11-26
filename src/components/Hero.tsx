import { Button } from "@/components/ui/button";
import { Camera, Leaf, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import kenyanFarmerImage from "@/assets/kenyan-farmer-app.jpg";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${kenyanFarmerImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          AI-Powered
          <span className="block bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
            Agricultural Assistant
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          Scan your crops, soil, and livestock with AI technology. Get instant expert advice 
          and connect with agricultural specialists in your region.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={() => navigate("/scan")}
          >
            <Camera className="mr-2" />
            Start Scanning
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            onClick={() => navigate("/profile")}
          >
            <Users className="mr-2" />
            Find Experts
          </Button>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <Leaf className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Crop Analysis</h3>
            <p className="text-sm opacity-90">Detect diseases and get pesticide recommendations</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              🌱
            </div>
            <h3 className="text-lg font-semibold mb-2">Soil Testing</h3>
            <p className="text-sm opacity-90">Analyze soil composition and get crop suggestions</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              🐄
            </div>
            <h3 className="text-lg font-semibold mb-2">Livestock Health</h3>
            <p className="text-sm opacity-90">Monitor animal health and get treatment advice</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;