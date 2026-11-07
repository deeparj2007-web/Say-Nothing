import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, RefreshCw, Upload, AlertCircle, CheckCircle2, Zap, Image as ImageIcon } from 'lucide-react';

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onQuickSimulate?: () => void;
  isScanningActive: boolean;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onQuickSimulate,
  isScanningActive
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorchSupport, setHasTorchSupport] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Play satisfying success chime on QR scan
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // ignore audio errors
    }
  };

  // Start Camera Stream
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    stopCamera();
    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('Camera access is not supported by this browser. Please use gallery upload or quick scan.');
      setHasCameraPermission(false);
      return;
    }

    try {
      // Mobile-optimized constraints (works reliably on both iOS Safari and Android Chrome)
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (firstErr) {
        // Fallback constraint if high-res failed
        console.warn('Fallback to basic video constraint', firstErr);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: false
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS Safari
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        videoRef.current.muted = true;
        await videoRef.current.play();
      }

      // Check torch capability
      const track = stream.getVideoTracks()[0];
      const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as any;
      setHasTorchSupport(!!capabilities.torch);

      setHasCameraPermission(true);
      scanFrame();
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setHasCameraPermission(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera permission was denied. Please allow camera access in browser settings, or use the Upload Image / Quick Scan button below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera device found on this system. You can test via Upload Image or Quick Scan.');
      } else {
        setErrorMessage(`Camera unavailable (${err.message || 'Error'}). You can scan an image file or test with Quick Scan.`);
      }
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  // Continuous Camera Scanning Loop
  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        handleSuccessfulScan(code.data);
        return; // stop loop once scanned
      }
    }

    if (streamRef.current) {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
    }
  };

  const handleSuccessfulScan = (data: string) => {
    playBeep();
    setScannedResult(data);
    setIsProcessing(true);
    stopCamera();
    onScan(data);
  };

  // Switch between Rear (environment) and Front (user) camera
  const toggleFacingMode = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  // Toggle Torch on supported mobile phones
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      const nextTorch = !isTorchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextTorch }]
      });
      setIsTorchOn(nextTorch);
    } catch (e) {
      console.warn('Torch toggle failed', e);
    }
  };

  // Decode QR code from uploaded photo/screenshot
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          handleSuccessfulScan(code.data);
        } else {
          setErrorMessage('No valid QR code detected in this image. Please upload a clear QR photo.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isScanningActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isScanningActive]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input for gallery upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Viewfinder Window */}
      <div className="relative w-full max-w-sm aspect-square bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl flex items-center justify-center">
        {/* The Live Video Element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />

        {/* Viewfinder Overlay Targeting Reticle */}
        <div className="relative z-10 w-64 h-64 border-2 border-cyan-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          {/* Laser Sweep Bar Animation */}
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#22d3ee] animate-bounce" />

          {/* Corner Guides */}
          <div className="flex justify-between">
            <div className="w-6 h-6 border-t-4 border-l-4 border-cyan-300 rounded-tl-lg" />
            <div className="w-6 h-6 border-t-4 border-r-4 border-cyan-300 rounded-tr-lg" />
          </div>
          <div className="flex justify-between">
            <div className="w-6 h-6 border-b-4 border-l-4 border-cyan-300 rounded-bl-lg" />
            <div className="w-6 h-6 border-b-4 border-r-4 border-cyan-300 rounded-br-lg" />
          </div>
        </div>

        {/* Camera Permission / Error Fallback Overlay */}
        {hasCameraPermission === false && (
          <div className="absolute inset-0 z-20 bg-slate-950/95 p-6 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">Camera Stream Inactive</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4 max-w-xs">
              {errorMessage || 'Camera access not permitted. You can scan using an image upload or one-tap quick scan.'}
            </p>
            <div className="flex flex-col space-y-2 w-full max-w-xs">
              <button
                onClick={() => startCamera(facingMode)}
                className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Camera Permission</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition-all"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Upload QR Image from Phone</span>
              </button>
            </div>
          </div>
        )}

        {/* Success Flash Overlay */}
        {scannedResult && (
          <div className="absolute inset-0 z-30 bg-emerald-950/90 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 mb-3 animate-pulse">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-base font-extrabold text-white mb-1">QR Code Scanned!</h4>
            <p className="text-xs text-emerald-200 font-mono">
              Intake Verified • Loading Medical Report...
            </p>
          </div>
        )}
      </div>

      {/* Control Buttons Under Scanner */}
      <div className="w-full max-w-sm mt-3 flex items-center justify-between gap-2">
        {/* Camera Switch (Front/Back) */}
        <button
          onClick={toggleFacingMode}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
          title="Switch Front / Rear Camera"
        >
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>{facingMode === 'environment' ? 'Rear Cam' : 'Front Cam'}</span>
        </button>

        {/* Torch Button (if supported) */}
        {hasTorchSupport && (
          <button
            onClick={toggleTorch}
            className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center space-x-1 transition-colors ${
              isTorchOn 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Flashlight"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Torch</span>
          </button>
        )}

        {/* Gallery / File Upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
          title="Upload image or screenshot of QR code"
        >
          <ImageIcon className="w-3.5 h-3.5 text-brand-400" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Quick Simulate Option for Seamless Testing */}
      {onQuickSimulate && (
        <div className="w-full max-w-sm mt-3 pt-3 border-t border-slate-800/80 text-center">
          <button
            onClick={onQuickSimulate}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-600/40 via-cyan-600/40 to-teal-600/40 hover:from-brand-600/60 hover:to-teal-600/60 border border-cyan-500/30 text-cyan-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.98]"
          >
            <span>⚡ Instant Scan: Use Current Patient QR Pass</span>
          </button>
          <p className="text-[10px] text-slate-500 mt-1">
            Tap to test instantly without pointing physical camera
          </p>
        </div>
      )}
    </div>
  );
};
