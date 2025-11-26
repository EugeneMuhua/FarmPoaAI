import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  Star, 
  MessageCircle, 
  Phone,
  MapPin,
  Award,
  Clock
} from "lucide-react";

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  experience: string;
  available: boolean;
  avatar?: string;
  responseTime: string;
}

const ExpertConnections = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock specialists data
  const specialists: Specialist[] = [
    {
      id: "1",
      name: "Dr. James Kamau",
      specialty: "Crop Disease Specialist",
      rating: 4.8,
      reviews: 124,
      location: "Nairobi, Kenya",
      experience: "15+ years",
      available: true,
      responseTime: "Usually responds in 2 hours"
    },
    {
      id: "2",
      name: "Dr. Grace Wanjiru",
      specialty: "Soil Health Expert",
      rating: 4.9,
      reviews: 98,
      location: "Nakuru, Kenya",
      experience: "12+ years",
      available: true,
      responseTime: "Usually responds in 1 hour"
    },
    {
      id: "3",
      name: "Dr. Peter Ochieng",
      specialty: "Veterinary Specialist",
      rating: 4.7,
      reviews: 156,
      location: "Kisumu, Kenya",
      experience: "20+ years",
      available: false,
      responseTime: "Usually responds in 4 hours"
    },
    {
      id: "4",
      name: "Sarah Mwangi",
      specialty: "Agrovet & Pesticides Expert",
      rating: 4.6,
      reviews: 89,
      location: "Eldoret, Kenya",
      experience: "8+ years",
      available: true,
      responseTime: "Usually responds in 3 hours"
    }
  ];

  const filteredSpecialists = specialists.filter(specialist =>
    specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    specialist.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSpecialist = (specialist: Specialist) => {
    // Future: Navigate to chat or booking page
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Connect with Specialists
          </h1>
          <p className="text-sm text-muted-foreground">
            Get expert advice from agricultural professionals
          </p>
        </div>

        {/* Context from diagnosis */}
        {location.state?.fromDiagnosis && location.state?.diagnosisData && (
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Based on your diagnosis:
              </p>
              <p className="font-semibold text-foreground">
                {location.state.diagnosisData.diagnosis}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Specialists List */}
        <div className="space-y-4">
          {filteredSpecialists.map((specialist) => (
            <Card key={specialist.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={specialist.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {specialist.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {specialist.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {specialist.specialty}
                        </p>
                      </div>
                      {specialist.available && (
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          Available
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-warning text-warning" />
                        <span className="font-medium">{specialist.rating}</span>
                        <span>({specialist.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>{specialist.experience}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{specialist.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{specialist.responseTime}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleContactSpecialist(specialist)}
                        size="sm"
                        className="flex-1"
                        disabled={!specialist.available}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat Now
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        disabled={!specialist.available}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredSpecialists.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">
                  No specialists found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search criteria
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertConnections;
