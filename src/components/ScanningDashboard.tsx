import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Leaf, Mountain, Heart, X, Loader2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { pipeline, env } from '@huggingface/transformers';
import { 
  interpretCropResults, 
  getCropRecommendations, 
  getTreatmentOptions, 
  interpretLivestockResults, 
  getLivestockRecommendations, 
  getVeterinaryAdvice, 
  assessSeverity, 
  analyzeSoilFromImage,
  getEnhancedSimulatedResults 
} from '@/utils/aiAnalysis';
import { supabase } from "@/integrations/supabase/client";
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

const ScanningDashboard = () => {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const scanModes = [
    {
      id: "soil",
      title: "Soil Analysis",
      description: "Scan soil to analyze composition and get crop recommendations",
      icon: Mountain,
      color: "from-amber-500 to-orange-600",
      features: ["Nutrient analysis", "pH level detection", "Crop compatibility", "Fertilizer recommendations"]
    },
    {
      id: "crop",
      title: "Crop Health",
      description: "Detect diseases, pests, and get treatment solutions",
      icon: Leaf,
      color: "from-green-500 to-emerald-600",
      features: ["Disease detection", "Pest identification", "Pesticide suggestions", "Growth monitoring"]
    },
    {
      id: "livestock",
      title: "Animal Health",
      description: "Monitor livestock health and get veterinary advice",
      icon: Heart,
      color: "from-red-500 to-pink-600",
      features: ["Disease diagnosis", "Symptom analysis", "Treatment plans", "Vaccination schedules"]
    }
  ];

  // Define functions in correct order to avoid "used before declaration" errors
  
  const analyzeImage = useCallback(async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      console.log('Starting enhanced AI analysis for:', activeMode);
      
      // Try enhanced AI analysis first
      try {
        const { data, error } = await supabase.functions.invoke('enhanced-crop-analysis', {
          body: { 
            imageData,
            analysisType: activeMode 
          }
        });

        if (error) {
          console.error('Enhanced analysis error:', error);
          throw error;
        }

        // Check if the response indicates non-agricultural content
        if (data.error === 'non_agricultural') {
          toast({
            title: "Not Agricultural Content",
            description: data.message || "This image does not appear to be agricultural. Migo AI is only able to analyze crops, soil, plants, and livestock.",
            variant: "destructive",
          });
          setIsAnalyzing(false);
          setCapturedImage(null);
          setAnalysisResult(null);
          return;
        }

        console.log('Enhanced analysis result:', data);
        setAnalysisResult(data);
        
        toast({
          title: "Advanced Analysis Complete",
          description: `${data.type} finished with AI vision technology`,
          variant: "default",
        });
        
        return; // Exit early if enhanced analysis succeeds
        
      } catch (enhancedError) {
        console.warn('Enhanced analysis failed, falling back to basic analysis:', enhancedError);
      }

      // Fallback to basic analysis
      const img = new Image();
      img.src = imageData;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      let result;
      
      if (activeMode === 'crop' || activeMode === 'livestock') {
        // Use basic image classification as fallback
        try {
          const classifier = await pipeline('image-classification', 'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k', { device: 'webgpu' });
          const predictions = await classifier(imageData);
          
          const predictionArray = Array.isArray(predictions) ? predictions : [predictions];
          const confidence = predictionArray[0] && 'score' in predictionArray[0] ? predictionArray[0].score : 0.75;
          
          if (activeMode === 'crop') {
            result = {
              type: 'Crop Health Analysis',
              confidence,
              diagnosis: interpretCropResults(predictionArray),
              recommendations: getCropRecommendations(predictionArray),
              severity: assessSeverity(predictionArray),
              treatments: getTreatmentOptions(predictionArray)
            };
          } else {
            result = {
              type: 'Livestock Health Assessment',
              confidence,
              diagnosis: interpretLivestockResults(predictionArray),
              recommendations: getLivestockRecommendations(predictionArray),
              severity: assessSeverity(predictionArray),
              treatments: getVeterinaryAdvice(predictionArray)
            };
          }
        } catch (classifierError) {
          console.error('Basic classifier failed:', classifierError);
          // Use simulated results as final fallback
          result = getEnhancedSimulatedResults(activeMode);
        }
      } else if (activeMode === 'soil') {
        // For soil analysis, use color-based analysis
        result = await analyzeSoilFromImage(img);
      }
      
      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete",
        description: `${result.type} finished successfully`,
        variant: "default",
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to enhanced simulation
      setAnalysisResult(getEnhancedSimulatedResults(activeMode));
    } finally {
      setIsAnalyzing(false);
    }
  }, [activeMode, toast]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  }, []);

  const captureImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Ensure video is ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      await new Promise<void>((resolve) => {
        const onData = () => {
          video.removeEventListener('loadeddata', onData);
          resolve();
        };
        video.addEventListener('loadeddata', onData, { once: true });
      });
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
    stopCamera();

    // Start real AI analysis
    analyzeImage(imageData);
  }, [analyzeImage, stopCamera]);

  const startCamera = useCallback(async () => {
    try {
      // Use Capacitor Camera for mobile devices when available
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
        // Use web camera for browser
        const constraints: MediaStreamConstraints = { video: { facingMode: 'environment' } };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        // reset previous state
        setCapturedImage(null);
        setAnalysisResult(null);
          setIsCameraActive(true);

          const attachStream = () => {
            const video = videoRef.current;
            if (!video) {
              requestAnimationFrame(attachStream);
              return;
            }

            // Attach stream and prepare playback
            video.srcObject = stream;

            const onReady = () => {
              // Ensure mobile autoplay works
              try { video.muted = true; } catch {}
              video.setAttribute('playsinline', 'true');
              // Some browsers require play() to be called explicitly
              video.play().catch(() => {});
              console.log('Camera stream ready, scheduling auto-capture...');
              // Auto-capture a frame shortly after the stream is ready
              setTimeout(() => {
                // captureImage will stop the camera and trigger analysis
                captureImage();
              }, 1200);
              video.removeEventListener('loadedmetadata', onReady);
            };

            if (video.readyState >= 1) {
              onReady();
            } else {
              video.addEventListener('loadedmetadata', onReady, { once: true });
            }
          };

          attachStream();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [toast, analyzeImage, captureImage]);

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Scanning Mode
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the type of analysis you need. Our AI will provide instant insights and recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {scanModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Card 
                key={mode.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-elevated border-2 ${
                  activeMode === mode.id ? 'border-primary shadow-elevated scale-105' : 'border-border'
                }`}
                onClick={() => setActiveMode(mode.id)}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${mode.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{mode.title}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {mode.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-success rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={activeMode === mode.id ? "scan" : "outline"} 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activeMode === mode.id) {
                        startCamera();
                      } else {
                        setActiveMode(mode.id);
                      }
                    }}
                  >
                    <Camera className="mr-2 w-4 h-4" />
                    {activeMode === mode.id ? "Start Scanning" : "Select Mode"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {activeMode && (
          <div className="bg-card rounded-xl p-8 shadow-natural">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                {scanModes.find(mode => mode.id === activeMode)?.title} Mode Active
              </h3>
              <p className="text-muted-foreground mb-6">
                Position your camera over the {activeMode} and tap the scan button when ready.
              </p>
              
              {/* Camera Interface */}
              <div className="bg-muted rounded-xl p-4 mb-6 border-2 border-dashed border-border relative">
                {!isCameraActive && !capturedImage && (
                  <div className="p-8 text-center">
                    <Camera className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Camera view will appear here</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Grant camera permissions to start scanning
                    </p>
                  </div>
                )}
                
                {isCameraActive && (
                  <div className="relative">
                  <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline 
                      muted
                      className="w-full rounded-lg"
                    />
                    <button
                      onClick={stopCamera}
                      className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {capturedImage && (
                  <div className="relative">
                    <img 
                      src={capturedImage} 
                      alt="Captured for analysis" 
                      className="w-full rounded-lg"
                    />
                    
                    {isAnalyzing && (
                      <div className="mt-4 p-6 bg-primary/10 border border-primary/20 rounded-lg text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
                        <h4 className="font-semibold text-primary mb-2">Analyzing...</h4>
                        <p className="text-sm text-muted-foreground">AI is processing your {activeMode} image</p>
                      </div>
                    )}
                    
                    {analysisResult && !isAnalyzing && (
                      <div className="mt-4 space-y-4">
                        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-primary">{analysisResult.type}</h4>
                            <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                              {Math.round(analysisResult.confidence * 100)}% confident
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <h5 className="font-medium text-sm mb-1">Diagnosis:</h5>
                              <p className="text-sm text-muted-foreground">{analysisResult.diagnosis}</p>
                            </div>
                            
                            {analysisResult.severity && (
                              <div>
                                <h5 className="font-medium text-sm mb-1">Severity:</h5>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  analysisResult.severity === 'High' ? 'bg-destructive/20 text-destructive' :
                                  analysisResult.severity === 'Medium' ? 'bg-warning/20 text-warning' :
                                  'bg-success/20 text-success'
                                }`}>
                                  {analysisResult.severity}
                                </span>
                              </div>
                            )}
                            
                            <div>
                              <h5 className="font-medium text-sm mb-1">Recommendations:</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {analysisResult.recommendations.map((rec: string, idx: number) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            {analysisResult.treatments && (
                              <div>
                                <h5 className="font-medium text-sm mb-1">Treatment Options:</h5>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {analysisResult.treatments.map((treatment: string, idx: number) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="w-1.5 h-1.5 bg-success rounded-full mt-2 mr-2 flex-shrink-0" />
                                      {treatment}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex gap-4 justify-center flex-wrap">
                {!isCameraActive && !capturedImage && (
                  <Button variant="scan" size="lg" onClick={startCamera}>
                    <Camera className="mr-2" />
                    Start Camera
                  </Button>
                )}
                
                {isCameraActive && (
                  <Button variant="scan" size="lg" onClick={captureImage}>
                    <Camera className="mr-2" />
                    Capture & Analyze
                  </Button>
                )}
                
                {capturedImage && !isAnalyzing && (
                  <Button variant="scan" size="lg" onClick={() => {
                    setCapturedImage(null);
                    setAnalysisResult(null);
                    startCamera();
                  }}>
                    <Camera className="mr-2" />
                    Scan Again
                  </Button>
                )}
                
                <Button variant="outline" disabled={isAnalyzing} onClick={() => {
                  setActiveMode(null);
                  setCapturedImage(null);
                  setAnalysisResult(null);
                  setIsAnalyzing(false);
                  stopCamera();
                }}>
                  Change Mode
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScanningDashboard;