import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Leaf, Heart, Mountain, Camera, ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { supabase } from "@/integrations/supabase/client";

type ScanType = 'produce' | 'animal' | 'soil' | null;
type ScanStep = 'select-type' | 'select-crop' | 'camera' | 'results';

const Scan = () => {
  const navigate = useNavigate();
  const [scanType, setScanType] = useState<ScanType>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<ScanStep>('select-type');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  const scanOptions = [
    {
      id: 'produce' as const,
      title: 'Produce Scan',
      description: 'Diagnose crop diseases and get treatment advice',
      icon: Leaf,
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600',
      features: ['Disease detection', 'Pest identification', 'Treatment plans', 'Growth tips']
    },
    {
      id: 'animal' as const,
      title: 'Animal Scan',
      description: 'Monitor livestock health and get veterinary advice',
      icon: Heart,
      gradient: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600',
      features: ['Health assessment', 'Disease diagnosis', 'Nutrition advice', 'Treatment plans']
    },
    {
      id: 'soil' as const,
      title: 'Soil Scan',
      description: 'Analyze soil composition and get crop recommendations',
      icon: Mountain,
      gradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-600',
      features: ['Nutrient analysis', 'pH detection', 'Crop suitability', 'Fertilizer tips']
    }
  ];

  const cropTypes = [
    { value: 'maize', label: 'Maize' },
    { value: 'beans', label: 'Beans' },
    { value: 'tomatoes', label: 'Tomatoes' },
    { value: 'potatoes', label: 'Potatoes' },
    { value: 'kale', label: 'Kale (Sukuma Wiki)' },
    { value: 'cabbage', label: 'Cabbage' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'tea', label: 'Tea' },
    { value: 'sugarcane', label: 'Sugarcane' },
    { value: 'rice', label: 'Rice' },
    { value: 'bananas', label: 'Bananas' },
    { value: 'other', label: 'Other Crop' }
  ];

  const handleScanTypeSelect = (type: ScanType) => {
    setScanType(type);
    if (type === 'produce') {
      setCurrentStep('select-crop');
    } else {
      setCurrentStep('camera');
    }
  };

  const handleCropSelect = () => {
    if (!selectedCrop) {
      toast({
        title: "Select Crop Type",
        description: "Please select the type of crop you want to scan",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('camera');
  };

  const handleTakePhoto = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const image = await CapacitorCamera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
        });
        
        if (image.dataUrl) {
          setCapturedImage(image.dataUrl);
          analyzeImage(image.dataUrl);
        }
      } else {
        // Web fallback - trigger file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const imageData = event.target?.result as string;
              setCapturedImage(imageData);
              analyzeImage(imageData);
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const handleUploadPhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          setCapturedImage(imageData);
          analyzeImage(imageData);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    setCurrentStep('results');

    try {
      // Map scanType to analysisType for the edge function
      const analysisTypeMapping = {
        'produce': 'crop',
        'animal': 'livestock',
        'soil': 'soil'
      };
      const analysisType = analysisTypeMapping[scanType as keyof typeof analysisTypeMapping] || scanType;
      
      const { data, error } = await supabase.functions.invoke('enhanced-crop-analysis', {
        body: { 
          imageData,
          analysisType,
          cropType: selectedCrop || undefined
        }
      });

      if (error) throw error;

      if (data.error === 'non_agricultural') {
        toast({
          title: "Invalid Image",
          description: data.message || "This doesn't appear to be agricultural content.",
          variant: "destructive",
        });
        handleReset();
        return;
      }

      setAnalysisResult(data);
      toast({
        title: "Analysis Complete",
        description: "AI analysis finished successfully",
      });

      // Navigate to diagnosis result page
      setTimeout(() => {
        navigate('/diagnosis-result', {
          state: {
            ...data,
            capturedImage: imageData,
            scanType,
            cropType: selectedCrop
          }
        });
      }, 1500);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze image. Please try again.",
        variant: "destructive",
      });
      handleReset();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setScanType(null);
    setSelectedCrop("");
    setCurrentStep('select-type');
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Header */}
        <div className="mb-6">
          {currentStep !== 'select-type' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          )}
          <h1 className="text-2xl font-bold text-foreground mb-2">AI Scanner</h1>
          <p className="text-sm text-muted-foreground">
            {currentStep === 'select-type' && 'Choose what you want to scan'}
            {currentStep === 'select-crop' && 'Select your crop type'}
            {currentStep === 'camera' && 'Capture or upload an image'}
            {currentStep === 'results' && 'Analysis results'}
          </p>
        </div>

        {/* Step 1: Select Scan Type */}
        {currentStep === 'select-type' && (
          <div className="space-y-4">
            {scanOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card
                  key={option.id}
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => handleScanTypeSelect(option.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${option.gradient} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {option.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {option.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {option.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Step 2: Select Crop Type (Produce only) */}
        {currentStep === 'select-crop' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Select Crop Type
              </CardTitle>
              <CardDescription>
                Choose the type of crop you're scanning for more accurate results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a crop type" />
                </SelectTrigger>
                <SelectContent>
                  {cropTypes.map((crop) => (
                    <SelectItem key={crop.value} value={crop.value}>
                      {crop.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleCropSelect}
                className="w-full"
                size="lg"
                disabled={!selectedCrop}
              >
                Continue to Camera
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Camera/Upload */}
        {currentStep === 'camera' && !capturedImage && (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <Camera className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready to Scan
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Take a clear photo or upload an existing image
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={handleTakePhoto}
                    size="lg"
                    className="w-full"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Take Photo
                  </Button>
                  
                  <Button
                    onClick={handleUploadPhoto}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload from Gallery
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Ensure good lighting conditions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Focus on the affected area clearly
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Keep the camera steady and close
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Include multiple angles if possible
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Results */}
        {currentStep === 'results' && (
          <div className="space-y-4">
            {capturedImage && (
              <Card>
                <CardContent className="p-4">
                  <img
                    src={capturedImage}
                    alt="Scanned image"
                    className="w-full rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {isAnalyzing && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Analyzing Image...
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    AI is processing your {scanType} scan
                  </p>
                </CardContent>
              </Card>
            )}

            {analysisResult && !isAnalyzing && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{analysisResult.type}</CardTitle>
                    <Badge variant="secondary">
                      {Math.round(analysisResult.confidence * 100)}% confident
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Diagnosis</h4>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.diagnosis}
                    </p>
                  </div>

                  {analysisResult.severity && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Severity</h4>
                      <Badge
                        variant={
                          analysisResult.severity === 'High'
                            ? 'destructive'
                            : analysisResult.severity === 'Medium'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {analysisResult.severity}
                      </Badge>
                    </div>
                  )}

                  {analysisResult.recommendations && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Recommendations</h4>
                      <ul className="space-y-2">
                        {analysisResult.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.treatments && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Treatment Options</h4>
                      <ul className="space-y-2">
                        {analysisResult.treatments.map((treatment: string, idx: number) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{treatment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button onClick={handleReset} className="w-full" size="lg">
                    Scan Again
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scan;
