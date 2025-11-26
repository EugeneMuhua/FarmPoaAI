import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ScanningDashboard from "@/components/ScanningDashboard";
import Marketplace from "@/components/Marketplace";
import ExpertConnections from "@/components/ExpertConnections";
import AgriChatbot from "@/components/AgriChatbot";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">🌱</span>
          </div>
          <p className="text-muted-foreground">Loading FarmPoa AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <div id="scanning">
          <ScanningDashboard />
        </div>
        <div id="marketplace">
          <Marketplace />
        </div>
        <div id="experts">
          <ExpertConnections />
        </div>
      </main>
      <AgriChatbot />
    </div>
  );
};

export default Index;
