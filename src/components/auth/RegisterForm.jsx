import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { handleApiError } from '../../utils/helpers';

const FACEAPI_CDN = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
const MODEL_URL   = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights';
const MAX_RETRIES = 3;
const MATCH_THRESHOLD = 0.5;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy:#0d1b3e; --blue:#1a3fa4; --orange:#e8501a;
    --text-dark:#111827; --text-mid:#4b5563; --card-radius:14px;
    --green:#16a34a; --red:#dc2626;
  }
  html,body,#root{height:100%;width:100%;overflow:hidden;font-family:'Manrope',sans-serif;}

  .rp-bar{position:fixed;top:0;left:0;right:0;z-index:500;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;background:rgba(8,18,48,0.97);backdrop-filter:blur(8px);box-shadow:0 2px 18px rgba(0,0,0,0.4);}
  .rp-bar-logo{display:flex;align-items:center;gap:9px;text-decoration:none;}
  .rp-bar-logo-img{width:36px;height:36px;border-radius:50%;overflow:hidden;flex-shrink:0;}
  .rp-bar-logo-img img{width:100%;height:100%;object-fit:cover;}
  .rp-bar-brand strong{display:block;color:#fff;font-size:0.9rem;font-weight:800;letter-spacing:1px;}
  .rp-bar-brand span{color:rgba(255,255,255,0.42);font-size:0.56rem;}
  .rp-bar-actions{display:flex;align-items:center;gap:0.6rem;}
  .rp-bar-login{color:rgba(255,255,255,0.78);font-size:0.82rem;font-weight:600;background:transparent;border:1.5px solid rgba(255,255,255,0.2);padding:0.36rem 0.95rem;border-radius:6px;cursor:pointer;text-decoration:none;transition:all 0.18s;display:flex;align-items:center;gap:5px;}
  .rp-bar-login:hover{border-color:rgba(255,255,255,0.55);color:#fff;}
  .rp-bar-signup{color:#fff;font-size:0.82rem;font-weight:700;background:var(--orange);border:none;padding:0.36rem 0.95rem;border-radius:6px;cursor:pointer;text-decoration:none;transition:opacity 0.18s;display:flex;align-items:center;gap:5px;}
  .rp-bar-signup:hover{opacity:0.88;}

  .rp-main{position:fixed;top:60px;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:#f4f6fb;overflow-y:auto;padding:1rem 0;}
  .rp-card{background:#fff;border-radius:var(--card-radius);box-shadow:0 8px 40px rgba(13,27,62,0.12);padding:1.6rem 1.7rem 1.4rem;width:420px;max-width:90%;max-height:90vh;overflow-y:auto;}
  .rp-card-hdr{text-align:center;margin-bottom:1.1rem;}
  .rp-card-hdr h2{font-size:1.28rem;font-weight:800;color:var(--navy);margin-bottom:0.15rem;}
  .rp-card-hdr p{color:var(--text-mid);font-size:0.75rem;}
  .rp-line{width:38px;height:3px;background:var(--orange);border-radius:2px;margin:0.45rem auto 0;}

  .rp-role-lbl{display:block;font-size:0.62rem;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.28rem;}
  .rp-role-row{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.75rem;}
  .rp-role-opt{position:relative;}
  .rp-role-opt input{position:absolute;opacity:0;width:0;height:0;}
  .rp-role-btn{display:flex;align-items:center;gap:0.4rem;padding:0.46rem 0.75rem;border:1.5px solid #e5e7eb;border-radius:7px;cursor:pointer;font-size:0.78rem;font-weight:600;color:var(--text-mid);background:#fafafa;transition:all 0.18s;user-select:none;font-family:'Manrope',sans-serif;}
  .rp-role-btn:hover{border-color:var(--blue);color:var(--blue);}
  .rp-role-opt input:checked+.rp-role-btn{border-color:var(--orange);color:var(--orange);background:#fff5f2;}

  .rp-sec{font-size:0.6rem;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:0.9px;margin:0.65rem 0 0.5rem;display:flex;align-items:center;gap:0.4rem;}
  .rp-sec::after{content:'';flex:1;height:1px;background:#ececec;}
  .rp-row{display:grid;grid-template-columns:1fr 1fr;gap:0.55rem;}
  .rp-grp{margin-bottom:0.55rem;}
  .rp-lbl{display:block;font-size:0.6rem;font-weight:700;color:var(--text-mid);text-transform:uppercase;letter-spacing:0.4px;margin-bottom:0.22rem;}
  .rp-wrap{position:relative;display:flex;align-items:center;}
  .rp-ico{position:absolute;left:0.68rem;color:var(--blue);font-size:0.68rem;pointer-events:none;}
  .rp-input{width:100%;border:1.5px solid #e5e7eb;border-radius:6px;padding:0.44rem 0.65rem 0.44rem 1.9rem;font-size:0.78rem;font-family:'Manrope',sans-serif;color:var(--text-dark);font-weight:500;background:#fafafa;outline:none;transition:border-color 0.18s,box-shadow 0.18s,background 0.18s;}
  .rp-input:focus{border-color:var(--blue);background:#fff;box-shadow:0 0 0 3px rgba(26,63,164,0.07);}
  .rp-input::placeholder{color:#c0c6d0;font-weight:400;}

  .rp-captcha{border:1.5px solid #e5e7eb;border-radius:6px;padding:0.55rem 0.75rem;background:#fafafa;display:flex;align-items:center;justify-content:space-between;margin-bottom:0.55rem;cursor:pointer;transition:border-color 0.18s;user-select:none;}
  .rp-captcha:hover{border-color:var(--blue);}
  .rp-cap-l{display:flex;align-items:center;gap:0.55rem;}
  .rp-cap-box{width:18px;height:18px;border:2px solid #9ca3af;border-radius:3px;display:flex;align-items:center;justify-content:center;transition:all 0.18s;flex-shrink:0;}
  .rp-cap-box.on{background:#2563eb;border-color:#2563eb;}
  .rp-cap-box.on::after{content:'✓';color:#fff;font-size:0.65rem;font-weight:700;}
  .rp-cap-txt{font-size:0.76rem;font-weight:600;color:var(--text-dark);}
  .rp-cap-txt.spin-mode{color:var(--text-mid);display:flex;align-items:center;gap:0.35rem;}
  .rp-spin{width:12px;height:12px;border:2px solid #e5e7eb;border-top-color:#2563eb;border-radius:50%;animation:rpspin 0.7s linear infinite;}
  @keyframes rpspin{to{transform:rotate(360deg);}}
  .rp-cap-r{display:flex;flex-direction:column;align-items:flex-end;gap:1px;}
  .rp-cap-note{font-size:0.47rem;color:#9ca3af;text-align:right;line-height:1.3;}

  .rp-terms{display:flex;align-items:flex-start;gap:0.4rem;margin-bottom:0.75rem;font-size:0.72rem;color:var(--text-mid);line-height:1.5;cursor:pointer;}
  .rp-terms input{width:12px;height:12px;margin-top:2px;cursor:pointer;accent-color:var(--orange);flex-shrink:0;}
  .rp-terms a{color:var(--blue);font-weight:600;text-decoration:none;}
  .rp-terms a:hover{color:var(--orange);}
  .rp-submit{width:100%;background:var(--orange);color:#fff;border:none;cursor:pointer;padding:0.62rem 1rem;border-radius:7px;font-size:0.84rem;font-weight:700;font-family:'Manrope',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;transition:opacity 0.18s,transform 0.14s;}
  .rp-submit:hover:not(:disabled){opacity:0.9;transform:translateY(-1px);}
  .rp-submit:disabled{opacity:0.6;cursor:not-allowed;}
  .rp-submit-spin{width:12px;height:12px;border:2px solid rgba(255,255,255,0.35);border-top-color:#fff;border-radius:50%;animation:rpspin 0.7s linear infinite;}
  .rp-login-link{text-align:center;margin-top:0.8rem;font-size:0.76rem;color:var(--text-mid);}
  .rp-login-link a{color:var(--orange);font-weight:700;text-decoration:none;}
  .rp-login-link a:hover{text-decoration:underline;}

  .fv-steps{display:flex;align-items:center;justify-content:center;margin-bottom:1.2rem;}
  .fv-step{display:flex;flex-direction:column;align-items:center;gap:4px;}
  .fv-step-circle{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:800;border:2px solid #e5e7eb;background:#f9fafb;color:#9ca3af;transition:all 0.3s;}
  .fv-step.active .fv-step-circle{border-color:var(--orange);background:var(--orange);color:white;}
  .fv-step.done .fv-step-circle{border-color:var(--green);background:var(--green);color:white;}
  .fv-step-label{font-size:0.55rem;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.4px;white-space:nowrap;}
  .fv-step.active .fv-step-label{color:var(--orange);}
  .fv-step.done .fv-step-label{color:var(--green);}
  .fv-step-line{width:40px;height:2px;background:#e5e7eb;margin-bottom:14px;transition:background 0.3s;}
  .fv-step-line.done{background:var(--green);}

  .fv-upload-zone{border:2px dashed #d1d5db;border-radius:10px;padding:1.2rem;text-align:center;cursor:pointer;transition:all 0.2s;background:#fafafa;margin-bottom:0.75rem;position:relative;}
  .fv-upload-zone:hover{border-color:var(--blue);background:#f0f4ff;}
  .fv-upload-zone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
  .fv-upload-icon{font-size:1.8rem;margin-bottom:0.4rem;}
  .fv-upload-txt{font-size:0.75rem;font-weight:600;color:var(--text-mid);}
  .fv-upload-sub{font-size:0.65rem;color:#9ca3af;margin-top:2px;}
  .fv-id-preview{width:100%;max-height:130px;object-fit:cover;border-radius:8px;border:2px solid var(--green);margin-bottom:0.75rem;display:block;}

  .fv-camera-wrap{position:relative;border-radius:10px;overflow:hidden;background:#000;margin-bottom:0.75rem;aspect-ratio:4/3;width:100%;}
  .fv-video{width:100%;height:100%;object-fit:cover;display:block;transform:scaleX(-1);}
  .fv-face-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;}
  .fv-face-oval{width:130px;height:170px;border:3px solid rgba(255,255,255,0.6);border-radius:50%;box-shadow:0 0 0 9999px rgba(0,0,0,0.45);transition:border-color 0.3s;}
  .fv-face-oval.detected{border-color:#4ade80;box-shadow:0 0 0 9999px rgba(0,0,0,0.45),0 0 20px rgba(74,222,128,0.5);}
  .fv-camera-hint{position:absolute;bottom:8px;left:0;right:0;text-align:center;font-size:0.65rem;color:rgba(255,255,255,0.85);font-weight:600;background:rgba(0,0,0,0.4);padding:4px 8px;}
  .fv-canvas{display:none;}

  .fv-result{border-radius:10px;padding:0.9rem 1rem;display:flex;align-items:flex-start;gap:0.75rem;margin-bottom:0.75rem;}
  .fv-result.success{background:#f0fdf4;border:1.5px solid #86efac;}
  .fv-result.fail{background:#fef2f2;border:1.5px solid #fca5a5;}
  .fv-result-icon{font-size:1.4rem;flex-shrink:0;}
  .fv-result-title{font-size:0.82rem;font-weight:800;margin-bottom:2px;}
  .fv-result.success .fv-result-title{color:var(--green);}
  .fv-result.fail .fv-result-title{color:var(--red);}
  .fv-result-msg{font-size:0.72rem;color:var(--text-mid);line-height:1.5;}

  .fv-retries{display:flex;align-items:center;gap:0.35rem;font-size:0.68rem;color:var(--text-mid);margin-bottom:0.75rem;font-weight:600;}
  .fv-retry-dot{width:10px;height:10px;border-radius:50%;border:1.5px solid #d1d5db;background:#f3f4f6;transition:all 0.2s;}
  .fv-retry-dot.used{background:var(--red);border-color:var(--red);}

  .fv-loader{display:flex;flex-direction:column;align-items:center;gap:0.6rem;padding:1.5rem;text-align:center;}
  .fv-loader-ring{width:36px;height:36px;border:3px solid #e5e7eb;border-top-color:var(--orange);border-radius:50%;animation:rpspin 0.7s linear infinite;}
  .fv-loader-txt{font-size:0.8rem;font-weight:700;color:var(--navy);}
  .fv-loader-sub{font-size:0.68rem;color:var(--text-mid);}
  .fv-progress{height:4px;background:#e5e7eb;border-radius:2px;width:100%;overflow:hidden;}
  .fv-progress-bar{height:100%;background:var(--orange);border-radius:2px;transition:width 0.3s ease;}

  .fv-btn{width:100%;padding:0.6rem 1rem;border-radius:7px;font-size:0.82rem;font-weight:700;font-family:'Manrope',sans-serif;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.18s;margin-bottom:0.5rem;}
  .fv-btn-primary{background:var(--navy);color:white;}
  .fv-btn-primary:hover:not(:disabled){background:var(--blue);}
  .fv-btn-primary:disabled{opacity:0.5;cursor:not-allowed;}
  .fv-btn-orange{background:var(--orange);color:white;}
  .fv-btn-orange:hover:not(:disabled){opacity:0.9;}
  .fv-btn-orange:disabled{opacity:0.5;cursor:not-allowed;}
  .fv-btn-ghost{background:transparent;color:var(--text-mid);border:1.5px solid #e5e7eb;}
  .fv-btn-ghost:hover{border-color:var(--navy);color:var(--navy);}

  .fv-blocked{background:#fef2f2;border:1.5px solid #fca5a5;border-radius:10px;padding:1.2rem;text-align:center;}
  .fv-blocked-icon{font-size:2.5rem;margin-bottom:0.5rem;}
  .fv-blocked-title{font-size:0.95rem;font-weight:800;color:var(--red);margin-bottom:0.4rem;}
  .fv-blocked-msg{font-size:0.75rem;color:var(--text-mid);line-height:1.6;}

  .fv-info{background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:8px;padding:0.75rem;margin-bottom:0.75rem;font-size:0.72rem;color:#1d4ed8;line-height:1.6;display:flex;gap:0.5rem;align-items:flex-start;}
  .fv-info i{flex-shrink:0;margin-top:1px;}

  .fv-score-bar{height:6px;border-radius:3px;background:#e5e7eb;margin:4px 0 8px;overflow:hidden;}
  .fv-score-fill{height:100%;border-radius:3px;transition:width 0.5s ease;}

  .fv-model-status{display:flex;align-items:center;gap:6px;font-size:0.65rem;font-weight:700;margin-bottom:0.6rem;padding:0.4rem 0.6rem;border-radius:6px;}
  .fv-model-status.loading{background:#fffbeb;color:#92400e;border:1px solid #fcd34d;}
  .fv-model-status.ready{background:#f0fdf4;color:var(--green);border:1px solid #86efac;}
  .fv-model-status.error{background:#fef2f2;color:var(--red);border:1px solid #fca5a5;}
  .fv-dot-pulse{width:7px;height:7px;border-radius:50%;background:currentColor;animation:pulse-dot 1.2s ease-in-out infinite;flex-shrink:0;}
  @keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:0.3}}

  @media(max-width:768px){
    .rp-bar{padding:0 1rem;}
    .rp-bar-brand{display:none;}
    .rp-row{grid-template-columns:1fr;}
    .rp-card{max-height:85vh;}
    .fv-step-line{width:24px;}
  }
`;

// Singleton loader — models load ONCE and are cached globally
let _modelLoadPromise = null;
let _modelsReady = false;

const ensureModelsLoaded = () => {
  if (_modelsReady) return Promise.resolve();
  if (_modelLoadPromise) return _modelLoadPromise;

  _modelLoadPromise = (async () => {
    if (!window.faceapi) {
      await new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${FACEAPI_CDN}"]`);
        if (existing) { resolve(); return; }
        const s = document.createElement('script');
        s.src = FACEAPI_CDN;
        s.onload = resolve;
        s.onerror = () => reject(new Error('Failed to load face-api.js'));
        document.head.appendChild(s);
      });
    }
    await Promise.all([
      window.faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    _modelsReady = true;
  })();

  return _modelLoadPromise;
};

// ─── FACE VERIFICATION COMPONENT ─────────────────────────────────────────
const FaceVerification = ({ onVerified }) => {
  const [step, setStep] = useState('upload');
  const [idImage, setIdImage] = useState(null);
  const [result, setResult] = useState(null);
  const [retriesUsed, setRetriesUsed] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [modelStatus, setModelStatus] = useState('loading');
  const [compareProgress, setCompareProgress] = useState(0);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionLoopRef = useRef(null);
  const idDescriptorRef = useRef(null);

  useEffect(() => {
    setModelStatus('loading');
    ensureModelsLoaded()
      .then(() => setModelStatus('ready'))
      .catch(() => setModelStatus('error'));
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setFaceDetected(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      detectionLoopRef.current = setInterval(async () => {
        if (!videoRef.current || !window.faceapi || !_modelsReady) return;
        try {
          const det = await window.faceapi.detectSingleFace(
            videoRef.current,
            new window.faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
          );
          setFaceDetected(!!det);
        } catch { }
      }, 300);
    } catch {
      setCameraError('Camera access denied. Please allow camera permission and try again.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (detectionLoopRef.current) clearInterval(detectionLoopRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const handleIdUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please upload an image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB.'); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      setIdImage(ev.target.result);
      if (_modelsReady) {
        try {
          const img = await window.faceapi.fetchImage(ev.target.result);
          const det = await window.faceapi
            .detectSingleFace(img, new window.faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
            .withFaceLandmarks()
            .withFaceDescriptor();
          idDescriptorRef.current = det || null;
          if (!det) toast.warning('No face found in ID photo. Please upload a clearer image.');
        } catch { idDescriptorRef.current = null; }
      }
    };
    reader.readAsDataURL(file);
  };

  const captureSelfie = async () => {
    if (!faceDetected) { toast.warning('No face detected. Position your face in the oval.'); return; }
    if (!_modelsReady) { toast.error('Models still loading. Please wait a moment.'); return; }

    setStep('comparing');
    setCompareProgress(10);
    stopCamera();

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
      setCompareProgress(30);

      let idDet = idDescriptorRef.current;
      if (!idDet) {
        const idImg = await window.faceapi.fetchImage(idImage);
        idDet = await window.faceapi
          .detectSingleFace(idImg, new window.faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
          .withFaceLandmarks()
          .withFaceDescriptor();
      }
      setCompareProgress(55);

      if (!idDet) {
        setResult({ success: false, reason: 'no_face_in_id', score: 0 });
        setStep('result'); return;
      }

      const selfieDet = await window.faceapi
        .detectSingleFace(canvas, new window.faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
        .withFaceLandmarks()
        .withFaceDescriptor();
      setCompareProgress(85);

      if (!selfieDet) {
        setResult({ success: false, reason: 'no_face_in_selfie', score: 0 });
        setStep('result'); return;
      }

      const distance = window.faceapi.euclideanDistance(idDet.descriptor, selfieDet.descriptor);
      const score = Math.max(0, Math.min(1, 1 - distance));
      const passed = distance < MATCH_THRESHOLD;
      setCompareProgress(100);
      setResult({ success: passed, score, distance });
      setStep('result');
    } catch (err) {
      console.error('Face comparison error:', err);
      toast.error('Comparison failed. Please try again.');
      setStep('camera');
      setTimeout(() => startCamera(), 300);
    }
  };

  const handleRetry = () => {
    const next = retriesUsed + 1;
    setRetriesUsed(next);
    if (next >= MAX_RETRIES) { setStep('blocked'); return; }
    setResult(null);
    setFaceDetected(false);
    setCompareProgress(0);
    setStep('camera');
    setTimeout(() => startCamera(), 300);
  };

  const StepIndicator = () => (
    <div className="fv-steps">
      <div className={`fv-step ${step==='upload'?'active':idImage?'done':''}`}>
        <div className="fv-step-circle">{idImage?'✓':'1'}</div>
        <div className="fv-step-label">Upload ID</div>
      </div>
      <div className={`fv-step-line ${idImage?'done':''}`} />
      <div className={`fv-step ${step==='camera'?'active':step==='comparing'||step==='result'?'done':''}`}>
        <div className="fv-step-circle">{step==='comparing'||step==='result'?'✓':'2'}</div>
        <div className="fv-step-label">Selfie</div>
      </div>
      <div className={`fv-step-line ${step==='result'||step==='comparing'?'done':''}`} />
      <div className={`fv-step ${step==='result'&&result?.success?'done':step==='result'?'active':''}`}>
        <div className="fv-step-circle">{step==='result'&&result?.success?'✓':'3'}</div>
        <div className="fv-step-label">Verify</div>
      </div>
    </div>
  );

  const ModelBadge = () => (
    <div className={`fv-model-status ${modelStatus}`}>
      <div className="fv-dot-pulse" />
      {modelStatus==='loading' && 'Loading face recognition models...'}
      {modelStatus==='ready'   && '⚡ Face recognition ready'}
      {modelStatus==='error'   && '⚠ Model load failed — check your connection'}
    </div>
  );

  if (step === 'blocked') return (
    <div>
      <StepIndicator />
      <div className="fv-blocked">
        <div className="fv-blocked-icon">🚫</div>
        <div className="fv-blocked-title">Verification Failed</div>
        <div className="fv-blocked-msg">
          You have used all {MAX_RETRIES} attempts. Registration has been blocked for security.<br /><br />
          Contact support if you believe this is an error.
        </div>
      </div>
      <button className="fv-btn fv-btn-ghost" style={{marginTop:'0.75rem'}}
        onClick={() => window.location.href='/contact'}>
        <i className="fa fa-envelope" /> Contact Support
      </button>
    </div>
  );

  if (step === 'upload') return (
    <div>
      <StepIndicator />
      <ModelBadge />
      <div className="fv-info">
        <i className="fa fa-info-circle" />
        <span>Upload your National ID photo with your face clearly visible, then take a selfie to verify your identity.</span>
      </div>
      <div className="rp-sec"><i className="fa fa-id-card" /> National ID Photo</div>
      {idImage ? (
        <>
          <img src={idImage} alt="National ID" className="fv-id-preview" />
          <div style={{fontSize:'0.7rem',color:'var(--green)',fontWeight:700,marginBottom:'0.75rem',display:'flex',alignItems:'center',gap:'5px'}}>
            <i className="fa fa-check-circle" /> ID uploaded successfully
          </div>
          <button className="fv-btn fv-btn-orange"
            disabled={modelStatus==='loading'}
            onClick={() => { setStep('camera'); setTimeout(() => startCamera(), 300); }}>
            {modelStatus==='loading'
              ? <><div className="rp-submit-spin" /> Preparing recognition...</>
              : <><i className="fa fa-camera" /> Continue to Selfie</>}
          </button>
          <button className="fv-btn fv-btn-ghost"
            onClick={() => { setIdImage(null); idDescriptorRef.current = null; }}>
            <i className="fa fa-redo" /> Use Different ID
          </button>
        </>
      ) : (
        <div className="fv-upload-zone">
          <input type="file" accept="image/*" onChange={handleIdUpload} />
          <div className="fv-upload-icon">🪪</div>
          <div className="fv-upload-txt">Click to upload your National ID</div>
          <div className="fv-upload-sub">JPG, PNG or WEBP · Max 10MB</div>
        </div>
      )}
      <canvas ref={canvasRef} className="fv-canvas" />
    </div>
  );

  if (step === 'camera') return (
    <div>
      <StepIndicator />
      <div className="fv-retries">
        <span>Attempts:</span>
        {Array.from({length:MAX_RETRIES}).map((_,i)=>(
          <div key={i} className={`fv-retry-dot ${i<retriesUsed?'used':''}`} />
        ))}
        <span style={{marginLeft:'4px'}}>{MAX_RETRIES-retriesUsed} left</span>
      </div>
      {cameraError ? (
        <div className="fv-result fail">
          <div className="fv-result-icon">📷</div>
          <div><div className="fv-result-title">Camera Error</div><div className="fv-result-msg">{cameraError}</div></div>
        </div>
      ) : (
        <div className="fv-camera-wrap">
          <video ref={videoRef} className="fv-video" muted playsInline />
          <div className="fv-face-overlay">
            <div className={`fv-face-oval ${faceDetected?'detected':''}`} />
          </div>
          <div className="fv-camera-hint">
            {faceDetected ? '✅ Face detected — ready to capture' : '👤 Position your face inside the oval'}
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="fv-canvas" />
      <button className="fv-btn fv-btn-orange" onClick={captureSelfie}
        disabled={!faceDetected || !!cameraError || modelStatus!=='ready'}>
        <i className="fa fa-camera" /> Capture & Verify
      </button>
      {cameraError && (
        <button className="fv-btn fv-btn-primary"
          onClick={() => { setCameraError(null); startCamera(); }}>
          <i className="fa fa-redo" /> Retry Camera
        </button>
      )}
    </div>
  );

  if (step === 'comparing') return (
    <div>
      <StepIndicator />
      <div className="fv-loader">
        <div className="fv-loader-ring" />
        <div className="fv-loader-txt">Comparing faces...</div>
        <div className="fv-loader-sub">Using facial recognition to verify your identity</div>
        <div className="fv-progress">
          <div className="fv-progress-bar" style={{width:`${compareProgress}%`}} />
        </div>
      </div>
      <canvas ref={canvasRef} className="fv-canvas" />
    </div>
  );

  if (step === 'result') {
    const score = result?.score || 0;
    const pct = Math.round(score * 100);
    const color = score > 0.65 ? '#16a34a' : score > 0.45 ? '#d97706' : '#dc2626';
    const failMsg = () => {
      if (result?.reason==='no_face_in_id') return 'No face detected in your National ID. Please upload a clearer photo.';
      if (result?.reason==='no_face_in_selfie') return 'No face detected in your selfie. Ensure good lighting and your face is fully visible.';
      return `Face similarity too low (${pct}%). Try better lighting or a clearer ID photo.`;
    };
    return (
      <div>
        <StepIndicator />
        {result?.success ? (
          <>
            <div className="fv-result success">
              <div className="fv-result-icon">✅</div>
              <div>
                <div className="fv-result-title">Identity Verified!</div>
                <div className="fv-result-msg">Your face matches the National ID. You can now complete registration.</div>
              </div>
            </div>
            <div style={{marginBottom:'0.75rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.68rem',color:'var(--text-mid)',fontWeight:600,marginBottom:'3px'}}>
                <span>Match Confidence</span><span style={{color}}>{pct}%</span>
              </div>
              <div className="fv-score-bar">
                <div className="fv-score-fill" style={{width:`${pct}%`,background:color}} />
              </div>
            </div>
            <button className="fv-btn fv-btn-orange" onClick={onVerified}>
              <i className="fa fa-check" /> Continue Registration
            </button>
          </>
        ) : (
          <>
            <div className="fv-result fail">
              <div className="fv-result-icon">❌</div>
              <div>
                <div className="fv-result-title">Verification Failed</div>
                <div className="fv-result-msg">{failMsg()}</div>
              </div>
            </div>
            {score > 0 && (
              <div style={{marginBottom:'0.75rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.68rem',color:'var(--text-mid)',fontWeight:600,marginBottom:'3px'}}>
                  <span>Match Confidence</span><span style={{color}}>{pct}%</span>
                </div>
                <div className="fv-score-bar">
                  <div className="fv-score-fill" style={{width:`${pct}%`,background:color}} />
                </div>
              </div>
            )}
            <div className="fv-retries">
              <span>Attempts used:</span>
              {Array.from({length:MAX_RETRIES}).map((_,i)=>(
                <div key={i} className={`fv-retry-dot ${i<=retriesUsed?'used':''}`} />
              ))}
              <span style={{marginLeft:'4px',color:MAX_RETRIES-retriesUsed-1<=0?'var(--red)':'inherit'}}>
                {MAX_RETRIES-retriesUsed-1} remaining
              </span>
            </div>
            <button className="fv-btn fv-btn-primary" onClick={handleRetry}>
              <i className="fa fa-redo" /> {retriesUsed+1<MAX_RETRIES ? 'Try Again' : 'Final Attempt'}
            </button>
          </>
        )}
      </div>
    );
  }

  return null;
};

// ─── MAIN REGISTER FORM ───────────────────────────────────────────────────
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName:'', lastName:'', email:'', phone:'',
    password:'', confirmPassword:'', role:'student', studentId:''
  });
  const [loading, setLoading] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'role') {
      setFaceVerified(false);
      setShowFaceVerification(false);
      // Start loading models silently the moment owner is selected
      if (value === 'owner') ensureModelsLoaded().catch(() => {});
    }
  };

  const handleCaptcha = () => {
    if (captchaChecked || captchaLoading) return;
    setCaptchaLoading(true);
    setTimeout(() => { setCaptchaLoading(false); setCaptchaChecked(true); }, 1200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaChecked) { toast.error('Please verify you are not a robot!'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match!'); return; }
    if (formData.role === 'student' && !formData.studentId) { toast.error('Student ID is required!'); return; }
    if (formData.role === 'owner' && !faceVerified) {
      toast.error('Face verification is required for hostel owners!');
      setShowFaceVerification(true);
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      await register(dataToSend);
      toast.success('Registration successful! Please login to continue.');
      setTimeout(() => navigate('/login'), 500);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  if (showFaceVerification && formData.role === 'owner') return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <nav className="rp-bar">
        <Link to="/" className="rp-bar-logo">
          <div className="rp-bar-logo-img"><img src="/PezaHostelLogo.png" alt="PezaHostel" /></div>
          <div className="rp-bar-brand"><span>OFF-CAMPUS ACCOMMODATION</span></div>
        </Link>
        <div className="rp-bar-actions">
          <Link to="/login" className="rp-bar-login"><i className="fa fa-sign-in-alt"></i> Login</Link>
        </div>
      </nav>
      <div className="rp-main">
        <div className="rp-card">
          <div className="rp-card-hdr">
            <h2>Identity Verification</h2>
            <p>Required for hostel owners — one-time verification</p>
            <div className="rp-line"></div>
          </div>
          <FaceVerification
            onVerified={() => {
              setFaceVerified(true);
              setShowFaceVerification(false);
              toast.success('Identity verified! Complete your registration.');
            }}
          />
          <button className="fv-btn fv-btn-ghost" style={{marginTop:'0.5rem'}}
            onClick={() => setShowFaceVerification(false)}>
            <i className="fa fa-arrow-left" /> Back to Form
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <nav className="rp-bar">
        <Link to="/" className="rp-bar-logo">
          <div className="rp-bar-logo-img"><img src="/PezaHostelLogo.png" alt="PezaHostel" /></div>
          <div className="rp-bar-brand"><span>OFF-CAMPUS ACCOMMODATION</span></div>
        </Link>
        <div className="rp-bar-actions">
          <Link to="/login" className="rp-bar-login"><i className="fa fa-sign-in-alt"></i> Login</Link>
          <Link to="/register" className="rp-bar-signup"><i className="fa fa-user-plus"></i> Sign Up</Link>
        </div>
      </nav>

      <div className="rp-main">
        <div className="rp-card">
          <div className="rp-card-hdr">
            <h2>Create Your Account</h2>
            <p>Fill in your details to get started</p>
            <div className="rp-line"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <span className="rp-role-lbl">I am a</span>
            <div className="rp-role-row">
              <div className="rp-role-opt">
                <input type="radio" id="rs" name="role" value="student"
                  checked={formData.role==='student'} onChange={handleChange} />
                <label className="rp-role-btn" htmlFor="rs">
                  <i className="fa fa-user-graduate"></i> Student
                </label>
              </div>
              <div className="rp-role-opt">
                <input type="radio" id="ro" name="role" value="owner"
                  checked={formData.role==='owner'} onChange={handleChange} />
                <label className="rp-role-btn" htmlFor="ro">
                  <i className="fa fa-building"></i> Hostel Owner
                </label>
              </div>
            </div>

            {formData.role === 'owner' && (
              <div onClick={() => setShowFaceVerification(true)} style={{
                display:'flex', alignItems:'center', gap:'0.6rem',
                padding:'0.6rem 0.75rem', borderRadius:'8px', cursor:'pointer',
                marginBottom:'0.75rem', transition:'all 0.2s',
                background: faceVerified ? '#f0fdf4' : '#fffbeb',
                border:`1.5px solid ${faceVerified ? '#86efac' : '#fcd34d'}`,
              }}>
                <span style={{fontSize:'1.2rem'}}>{faceVerified ? '✅' : '🪪'}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:'0.75rem',fontWeight:800,color:faceVerified?'#16a34a':'#92400e'}}>
                    {faceVerified ? 'Identity Verified' : 'Identity Verification Required'}
                  </div>
                  <div style={{fontSize:'0.65rem',color:'var(--text-mid)'}}>
                    {faceVerified ? 'Your National ID has been verified.' : 'Click to verify with your National ID'}
                  </div>
                </div>
                <i className={`fa ${faceVerified?'fa-check-circle':'fa-chevron-right'}`}
                  style={{color:faceVerified?'#16a34a':'#d97706',fontSize:'0.8rem'}} />
              </div>
            )}

            <div className="rp-sec"><i className="fa fa-user"></i> Personal Information</div>
            <div className="rp-row">
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="fn">First Name</label>
                <div className="rp-wrap"><i className="fa fa-user rp-ico"></i>
                  <input id="fn" className="rp-input" type="text" name="firstName"
                    value={formData.firstName} onChange={handleChange} placeholder="First name" required />
                </div>
              </div>
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="ln">Last Name</label>
                <div className="rp-wrap"><i className="fa fa-user rp-ico"></i>
                  <input id="ln" className="rp-input" type="text" name="lastName"
                    value={formData.lastName} onChange={handleChange} placeholder="Last name" required />
                </div>
              </div>
            </div>
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="em">Email Address</label>
              <div className="rp-wrap"><i className="fa fa-envelope rp-ico"></i>
                <input id="em" className="rp-input" type="email" name="email"
                  value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
              </div>
            </div>
            <div className="rp-grp">
              <label className="rp-lbl" htmlFor="ph">Phone Number</label>
              <div className="rp-wrap"><i className="fa fa-phone rp-ico"></i>
                <input id="ph" className="rp-input" type="tel" name="phone"
                  value={formData.phone} onChange={handleChange} placeholder="Enter phone number" required />
              </div>
            </div>
            {formData.role === 'student' && (
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="sid">Student ID</label>
                <div className="rp-wrap"><i className="fa fa-id-card rp-ico"></i>
                  <input id="sid" className="rp-input" type="text" name="studentId"
                    value={formData.studentId} onChange={handleChange} placeholder="Enter student ID" required />
                </div>
              </div>
            )}

            <div className="rp-sec"><i className="fa fa-lock"></i> Security</div>
            <div className="rp-row">
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="pw">Password</label>
                <div className="rp-wrap"><i className="fa fa-lock rp-ico"></i>
                  <input id="pw" className="rp-input" type="password" name="password"
                    value={formData.password} onChange={handleChange} placeholder="Create password" required />
                </div>
              </div>
              <div className="rp-grp">
                <label className="rp-lbl" htmlFor="cpw">Confirm</label>
                <div className="rp-wrap"><i className="fa fa-lock rp-ico"></i>
                  <input id="cpw" className="rp-input" type="password" name="confirmPassword"
                    value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm" required />
                </div>
              </div>
            </div>

            <div className="rp-captcha" onClick={handleCaptcha} role="button" tabIndex={0}>
              <div className="rp-cap-l">
                <div className={`rp-cap-box${captchaChecked?' on':''}`}></div>
                {captchaLoading
                  ? <span className="rp-cap-txt spin-mode"><div className="rp-spin"></div> Verifying...</span>
                  : <span className="rp-cap-txt">{captchaChecked ? 'Verified ✓' : "I'm not a robot"}</span>}
              </div>
              <div className="rp-cap-r">
                <i className="fa fa-shield-alt" style={{color:'#4285f4',fontSize:'1.15rem'}}></i>
                <div className="rp-cap-note">reCAPTCHA<br />Privacy · Terms</div>
              </div>
            </div>

            <label className="rp-terms">
              <input type="checkbox" required />
              <span>I agree to the <Link to="/terms">Terms &amp; Conditions</Link> and <Link to="/privacy">Privacy Policy</Link></span>
            </label>

            <button type="submit" className="rp-submit" disabled={loading}>
              {loading
                ? <><div className="rp-submit-spin"></div> Creating Account...</>
                : <><i className="fa fa-user-plus"></i> Create Account</>}
            </button>
          </form>

          <p className="rp-login-link">Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;