import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Star, Settings, Clock, TrendingUp, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SpecialistDashboard = () => {
  const navigate = useNavigate();

  // Mock data - in production, this would come from the database
  const pendingConsultations = [
    {
      id: "1",
      farmerName: "John Kamau",
      issue: "Tomato Blight Diagnosis",
      timestamp: "2 hours ago",
      urgent: true
    },
    {
      id: "2",
      farmerName: "Mary Wanjiru",
      issue: "Soil pH Consultation",
      timestamp: "5 hours ago",
      urgent: false
    },
    {
      id: "3",
      farmerName: "Peter Ochieng",
      issue: "Livestock Health Check",
      timestamp: "1 day ago",
      urgent: false
    }
  ];

  const averageRating = 4.8;
  const totalConsultations = 47;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background px-4 pt-8 pb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Specialist Dashboard</h1>
          <p className="text-muted-foreground text-sm">Connect with farmers and provide expert advice</p>
        </div>

        <div className="px-4 space-y-6 mt-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <p className="text-2xl font-bold text-foreground">{averageRating}</p>
                    <p className="text-xs text-muted-foreground">{totalConsultations} consultations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-xs text-muted-foreground">+3 from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Consultation Requests */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Pending Consultation Requests
                </h2>
                <p className="text-sm text-muted-foreground">Farmers waiting for your expertise</p>
              </div>
              <Badge variant="destructive" className="text-sm">
                {pendingConsultations.length} New
              </Badge>
            </div>

            <div className="space-y-3">
              {pendingConsultations.map((consultation) => (
                <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{consultation.farmerName}</h3>
                          {consultation.urgent && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{consultation.issue}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {consultation.timestamp}
                        </div>
                      </div>
                      <Button size="sm" variant="default">
                        Respond
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Manage Expertise & Availability */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-foreground">Manage Expertise & Availability</CardTitle>
                  <CardDescription>Update your specializations and working hours</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                <Settings className="w-4 h-4 mr-2" />
                Update Profile Settings
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/expert-connections")}>
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-base">My Clients</CardTitle>
                <CardDescription>View farmer connections</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/marketplace")}>
              <CardHeader>
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <CardTitle className="text-base">Product Catalog</CardTitle>
                <CardDescription>Manage agrivet products</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistDashboard;
