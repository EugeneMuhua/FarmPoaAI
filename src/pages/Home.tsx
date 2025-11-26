import Hero from "@/components/Hero";
import ExpertConnections from "@/components/ExpertConnections";
import AgriChatbot from "@/components/AgriChatbot";

const Home = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Hero />
      <div className="px-4 py-8">
        <ExpertConnections />
      </div>
      <AgriChatbot />
    </div>
  );
};

export default Home;
