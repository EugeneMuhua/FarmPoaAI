import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut, User, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🌱</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FarmPoa AI</h1>
              <p className="text-xs text-muted-foreground">Smart Farming Assistant</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection('scanning')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Scanning
            </button>
            <button 
              onClick={() => scrollToSection('marketplace')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Marketplace
            </button>
            <button 
              onClick={() => scrollToSection('experts')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Experts
            </button>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome back!
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="hero" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection('scanning')}
                className="text-left text-foreground hover:text-primary transition-colors py-2"
              >
                Scanning
              </button>
              <button 
                onClick={() => scrollToSection('marketplace')}
                className="text-left text-foreground hover:text-primary transition-colors py-2"
              >
                Marketplace
              </button>
              <button 
                onClick={() => scrollToSection('experts')}
                className="text-left text-foreground hover:text-primary transition-colors py-2"
              >
                Experts
              </button>
              {user ? (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground py-1">
                    Welcome back!
                  </div>
                  <Button variant="outline" size="sm" className="self-start" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="hero" className="self-start">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;