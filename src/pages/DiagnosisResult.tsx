import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  UserCheck,
  Share2,
  BookmarkPlus,
  Sprout,
  Droplet,
  Mountain,
  TrendingDown,
  ShoppingBag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiagnosisData {
  type: string;
  diagnosis: string;
  confidence: number;
  severity?: string;
  recommendations?: string[];
  treatments?: string[];
  capturedImage?: string;
  scanType?: string;
  cropType?: string;
  // Soil-specific fields
  soilData?: {
    pH?: number | string;
    texture?: string;
    nutrientDeficiency?: string;
    fertilizer?: string;
  };
}

const DiagnosisResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const diagnosisData = location.state as DiagnosisData;

  // If no data, redirect back
  if (!diagnosisData) {
    navigate('/scan');
    return null;
  }

  const getSeverityConfig = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return {
          icon: AlertCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
          label: 'High Risk'
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          label: 'Moderate Risk'
        };
      default:
        return {
          icon: CheckCircle2,
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          label: 'Low Risk'
        };
    }
  };

  const severityConfig = getSeverityConfig(diagnosisData.severity);
  const SeverityIcon = severityConfig.icon;

  const handleConnectSpecialist = () => {
    // Navigate to expert connections with diagnosis context
    navigate('/expert-connections', { 
      state: { 
        diagnosisData,
        fromDiagnosis: true 
      } 
    });
  };

  const handleSaveDiagnosis = () => {
    // Future: Save to history
    toast({
      title: "Saved",
      description: "Diagnosis saved to your history",
    });
  };

  const handleShare = () => {
    // Future: Share functionality
    toast({
      title: "Share",
      description: "Share functionality coming soon",
    });
  };

  // Determine scan type
  const isSoilScan = diagnosisData.scanType === 'soil';
  const isAnimalScan = diagnosisData.scanType === 'animal';
  const isProduceScan = diagnosisData.scanType === 'produce';

  // Get appropriate title
  const getTitle = () => {
    if (isSoilScan) return 'Soil Analysis Results';
    if (isAnimalScan) return 'Livestock Health Assessment';
    if (isProduceScan) return 'Crop Health Diagnosis';
    return 'Diagnosis Results';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/scan')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scanner
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {getTitle()}
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-powered analysis complete
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSaveDiagnosis}
              >
                <BookmarkPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Scanned Image */}
          {diagnosisData.capturedImage && (
            <Card>
              <CardContent className="p-4">
                <img
                  src={diagnosisData.capturedImage}
                  alt="Scanned image"
                  className="w-full rounded-lg"
                />
                {diagnosisData.cropType && isProduceScan && (
                  <div className="mt-3 flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Crop Type: <span className="font-medium text-foreground capitalize">{diagnosisData.cropType}</span>
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Soil Scan Specific View */}
          {isSoilScan && diagnosisData.soilData ? (
            <>
              {/* Soil Data Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* pH Level Card */}
                <Card className="border-2 border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-primary">
                      <Droplet className="w-5 h-5" />
                      <CardTitle className="text-base">pH Level</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {diagnosisData.soilData.pH || 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {typeof diagnosisData.soilData.pH === 'number' && diagnosisData.soilData.pH < 6.5 
                        ? 'Slightly acidic'
                        : typeof diagnosisData.soilData.pH === 'number' && diagnosisData.soilData.pH > 7.5
                        ? 'Slightly alkaline'
                        : 'Neutral range'}
                    </p>
                  </CardContent>
                </Card>

                {/* Texture Card */}
                <Card className="border-2 border-amber-500/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-amber-600">
                      <Mountain className="w-5 h-5" />
                      <CardTitle className="text-base">Soil Texture</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-1 capitalize">
                      {diagnosisData.soilData.texture || 'Unknown'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Estimated composition
                    </p>
                  </CardContent>
                </Card>

                {/* Nutrient Deficiency Card */}
                <Card className="border-2 border-destructive/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-destructive">
                      <TrendingDown className="w-5 h-5" />
                      <CardTitle className="text-base">Key Deficiency</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-1 capitalize">
                      {diagnosisData.soilData.nutrientDeficiency || 'None detected'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Primary concern
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Confidence Score */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Analysis Confidence
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {Math.round(diagnosisData.confidence * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all"
                      style={{ width: `${diagnosisData.confidence * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on AI image analysis and soil database
                  </p>
                </CardContent>
              </Card>

              {/* Recommended Fertilizer */}
              {diagnosisData.soilData.fertilizer && (
                <Card className="bg-gradient-to-br from-success/10 via-success/5 to-background border-success/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      Recommended Treatment
                    </CardTitle>
                    <CardDescription>
                      Based on your soil analysis results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                      <h4 className="font-semibold text-foreground mb-2">
                        Suggested Fertilizer/Additive
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {diagnosisData.soilData.fertilizer}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {diagnosisData.recommendations && diagnosisData.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Soil Improvement Steps</CardTitle>
                    <CardDescription>
                      Follow these recommendations to optimize your soil
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {diagnosisData.recommendations.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-foreground pt-0.5">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}

              {/* Find Agrovet CTA */}
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
                <CardContent className="p-6 text-center">
                  <ShoppingBag className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Need Fertilizers or Soil Amendments?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Connect with nearby agrovets to purchase the recommended products 
                    and get expert advice on soil management.
                  </p>
                  <Button 
                    onClick={handleConnectSpecialist}
                    size="lg"
                    className="w-full"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Find an Agrovet
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : isProduceScan ? (
            /* Crop/Produce Scan View */
            <>
              {/* Main Diagnosis Card */}
              <Card className={`border-2 ${severityConfig.borderColor}`}>
                <CardHeader className={severityConfig.bgColor}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <SeverityIcon className={`w-5 h-5 ${severityConfig.color}`} />
                        <Badge 
                          variant={diagnosisData.severity?.toLowerCase() === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {severityConfig.label}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {diagnosisData.diagnosis}
                      </CardTitle>
                      <CardDescription>
                        Crop Disease & Pest Analysis
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Confidence Score */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Diagnosis Confidence
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {Math.round(diagnosisData.confidence * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all"
                        style={{ width: `${diagnosisData.confidence * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Based on AI crop disease recognition model
                    </p>
                  </div>

                  {/* Severity Alert */}
                  {diagnosisData.severity && diagnosisData.severity.toLowerCase() === 'high' && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Urgent action required.</strong> This crop disease may spread rapidly 
                        and significantly reduce yield if left untreated.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Treatment Plan */}
              {diagnosisData.recommendations && diagnosisData.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-primary" />
                      Treatment Plan
                    </CardTitle>
                    <CardDescription>
                      Step-by-step actions to treat your crops
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {diagnosisData.recommendations.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-foreground pt-0.5">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}

              {/* Pesticides & Fungicides */}
              {diagnosisData.treatments && diagnosisData.treatments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommended Products</CardTitle>
                    <CardDescription>
                      Pesticides, fungicides, and treatments for this condition
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {diagnosisData.treatments.map((treatment, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <Droplet className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <p className="text-sm text-foreground">
                            {treatment}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Find Agrovet CTA */}
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
                <CardContent className="p-6 text-center">
                  <ShoppingBag className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Get Treatment Products
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Connect with agricultural specialists to purchase the recommended pesticides 
                    and fungicides for treating your crops.
                  </p>
                  <Button 
                    onClick={handleConnectSpecialist}
                    size="lg"
                    className="w-full"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Find an Agrovet
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : isAnimalScan ? (
            /* Animal/Livestock Scan View */
            <>
              {/* Main Diagnosis Card */}
              <Card className={`border-2 ${severityConfig.borderColor}`}>
                <CardHeader className={severityConfig.bgColor}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <SeverityIcon className={`w-5 h-5 ${severityConfig.color}`} />
                        <Badge 
                          variant={diagnosisData.severity?.toLowerCase() === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {severityConfig.label}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {diagnosisData.diagnosis}
                      </CardTitle>
                      <CardDescription>
                        Livestock Health Assessment
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Confidence Score */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Assessment Confidence
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {Math.round(diagnosisData.confidence * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all"
                        style={{ width: `${diagnosisData.confidence * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Based on AI veterinary assessment model
                    </p>
                  </div>

                  {/* Severity Alert */}
                  {diagnosisData.severity && diagnosisData.severity.toLowerCase() === 'high' && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Veterinary attention recommended.</strong> This condition requires 
                        immediate professional assessment to prevent complications.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Care Instructions */}
              {diagnosisData.recommendations && diagnosisData.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      Care Instructions
                    </CardTitle>
                    <CardDescription>
                      Immediate steps to care for your livestock
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {diagnosisData.recommendations.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-foreground pt-0.5">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}

              {/* Veterinary Treatments */}
              {diagnosisData.treatments && diagnosisData.treatments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Veterinary Treatments</CardTitle>
                    <CardDescription>
                      Medications and treatments that may be required
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {diagnosisData.treatments.map((treatment, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <p className="text-sm text-foreground">
                            {treatment}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Connect with Veterinarian CTA */}
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
                <CardContent className="p-6 text-center">
                  <UserCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Consult a Veterinarian
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Connect with licensed veterinarians and animal health specialists 
                    for professional diagnosis and treatment recommendations.
                  </p>
                  <Button 
                    onClick={handleConnectSpecialist}
                    size="lg"
                    className="w-full"
                  >
                    <UserCheck className="w-5 h-5 mr-2" />
                    Find a Veterinarian
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : null}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/scan')}
              className="w-full"
            >
              New Scan
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/farmer')}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResult;
