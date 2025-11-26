import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Star, Users, Building, MessageCircle } from "lucide-react";

const ExpertConnections = () => {
  const experts = [
    {
      name: "Dr. Sarah Kimani",
      specialty: "Crop Disease Specialist",
      rating: 4.9,
      location: "Nairobi, Kenya",
      experience: "15 years",
      phone: "+254 700 123 456",
      expertise: ["Maize", "Beans", "Tomatoes", "Pest Control"],
      avatar: "👩‍🔬"
    },
    {
      name: "Dr. James Mwangi",
      specialty: "Soil Specialist",
      rating: 4.8,
      location: "Nakuru, Kenya",
      experience: "12 years",
      phone: "+254 700 789 012",
      expertise: ["Soil Analysis", "Fertilizers", "Crop Rotation", "pH Testing"],
      avatar: "👨‍🔬"
    },
    {
      name: "Dr. Grace Wanjiku",
      specialty: "Veterinarian",
      rating: 4.9,
      location: "Eldoret, Kenya",
      experience: "18 years",
      phone: "+254 700 345 678",
      expertise: ["Cattle", "Poultry", "Disease Prevention", "Nutrition"],
      avatar: "👩‍⚕️"
    }
  ];

  const agrovets = [
    {
      name: "Green Valley Agrovet",
      location: "Kiambu, Kenya",
      distance: "2.5 km",
      rating: 4.7,
      services: ["Seeds", "Fertilizers", "Pesticides", "Animal Medicine"],
      phone: "+254 700 111 222"
    },
    {
      name: "Farmers Choice Supplies",
      location: "Thika, Kenya",
      distance: "5.1 km",
      rating: 4.6,
      services: ["Farm Equipment", "Seeds", "Veterinary Supplies", "Consulting"],
      phone: "+254 700 333 444"
    }
  ];

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Connect with Agricultural Experts
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get professional advice from certified specialists and find supplies at nearby agrovets.
          </p>
        </div>

        {/* Agricultural Experts */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 flex items-center">
            <Users className="mr-3 text-primary" />
            Agricultural Specialists
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experts.map((expert, index) => (
              <Card key={index} className="hover:shadow-elevated transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-3">{expert.avatar}</div>
                  <CardTitle className="text-lg">{expert.name}</CardTitle>
                  <CardDescription>{expert.specialty}</CardDescription>
                  
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Star className="w-4 h-4 text-accent fill-current" />
                    <span className="text-sm font-medium">{expert.rating}</span>
                    <span className="text-sm text-muted-foreground">({expert.experience})</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {expert.location}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {expert.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.location.href = `tel:${expert.phone}`}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.location.href = `sms:${expert.phone}`}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Nearby Agrovets */}
        <div>
          <h3 className="text-2xl font-bold mb-8 flex items-center">
            <Building className="mr-3 text-primary" />
            Nearby Agrovets
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agrovets.map((agrovet, index) => (
              <Card key={index} className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{agrovet.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {agrovet.location} • {agrovet.distance}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-accent fill-current mr-1" />
                      <span className="text-sm font-medium">{agrovet.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {agrovet.services.map((service) => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      className="flex-1"
                      onClick={() => window.location.href = `tel:${agrovet.phone}`}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(agrovet.location)}`, '_blank')}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertConnections;