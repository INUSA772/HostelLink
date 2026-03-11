const axios = require('axios');

const VISION_API = 'https://vision.googleapis.com/v1/images:annotate';
const API_KEY = process.env.GOOGLE_VISION_API_KEY;

const callVision = async (base64Image, features) => {
  const { data } = await axios.post(`${VISION_API}?key=${API_KEY}`, {
    requests: [{
      image: { content: base64Image },
      features
    }]
  });
  return data.responses[0];
};

// POST /api/auth/verify-id
exports.verifyId = async (req, res) => {
  try {
    const { idImage } = req.body;
    if (!idImage) return res.status(400).json({ success: false, message: 'ID image is required' });

    const base64 = idImage.replace(/^data:image\/\w+;base64,/, '');

    const result = await callVision(base64, [
      { type: 'TEXT_DETECTION' },
      { type: 'FACE_DETECTION', maxResults: 1 }
    ]);

    const text = result.textAnnotations?.[0]?.description || '';
    const hasFace = (result.faceAnnotations?.length || 0) > 0;
    const faceData = result.faceAnnotations?.[0] || null;

    if (!hasFace) {
      return res.status(400).json({
        success: false,
        message: 'No face detected in the National ID. Please upload a clearer photo.'
      });
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    return res.json({
      success: true,
      idData: {
        rawText: text,
        lines,
        hasFace: true,
        faceConfidence: faceData.detectionConfidence,
        faceBoundingBox: faceData.boundingPoly
      }
    });

  } catch (err) {
    console.error('verifyId error:', err?.response?.data || err.message);
    return res.status(500).json({ success: false, message: 'ID verification failed. Try again.' });
  }
};

// POST /api/auth/verify-face
exports.verifyFace = async (req, res) => {
  try {
    const { idImage, selfieImage } = req.body;
    if (!idImage || !selfieImage) {
      return res.status(400).json({ success: false, message: 'Both ID and selfie images are required' });
    }

    const idBase64 = idImage.replace(/^data:image\/\w+;base64,/, '');
    const selfieBase64 = selfieImage.replace(/^data:image\/\w+;base64,/, '');

    const [idResult, selfieResult] = await Promise.all([
      callVision(idBase64, [{ type: 'FACE_DETECTION', maxResults: 1 }]),
      callVision(selfieBase64, [{ type: 'FACE_DETECTION', maxResults: 1 }])
    ]);

    const idFace = idResult.faceAnnotations?.[0];
    const selfieFace = selfieResult.faceAnnotations?.[0];

    if (!idFace) {
      return res.status(400).json({
        success: false,
        message: 'No face found in National ID. Please upload a clearer photo.'
      });
    }

    if (!selfieFace) {
      return res.status(400).json({
        success: false,
        message: 'No face found in selfie. Make sure your face is clearly visible.'
      });
    }

    const idLandmarks = idFace.landmarks || [];
    const selfieLandmarks = selfieFace.landmarks || [];

    const idMap = {};
    const selfieMap = {};
    idLandmarks.forEach(l => { idMap[l.type] = l.position; });
    selfieLandmarks.forEach(l => { selfieMap[l.type] = l.position; });

    const commonTypes = Object.keys(idMap).filter(t => selfieMap[t]);

    let similarityScore = 0;

    if (commonTypes.length > 0) {
      const idBox = idFace.boundingPoly.vertices;
      const selfieBox = selfieFace.boundingPoly.vertices;
      const idWidth = (idBox[1]?.x || 100) - (idBox[0]?.x || 0);
      const selfieWidth = (selfieBox[1]?.x || 100) - (selfieBox[0]?.x || 0);
      const idHeight = (idBox[2]?.y || 100) - (idBox[0]?.y || 0);
      const selfieHeight = (selfieBox[2]?.y || 100) - (selfieBox[0]?.y || 0);

      let totalDiff = 0;
      commonTypes.forEach(type => {
        const ip = idMap[type];
        const sp = selfieMap[type];
        const normIdX = ip.x / idWidth;
        const normIdY = ip.y / idHeight;
        const normSpX = sp.x / selfieWidth;
        const normSpY = sp.y / selfieHeight;
        const diff = Math.sqrt(Math.pow(normIdX - normSpX, 2) + Math.pow(normIdY - normSpY, 2));
        totalDiff += diff;
      });

      const avgDiff = totalDiff / commonTypes.length;
      similarityScore = Math.max(0, Math.min(100, Math.round((1 - avgDiff * 2) * 100)));
    } else {
      similarityScore = Math.round(
        ((idFace.detectionConfidence + selfieFace.detectionConfidence) / 2) * 60
      );
    }

    const poseSimilarity = 100 - Math.abs(
      (idFace.panAngle || 0) - (selfieFace.panAngle || 0)
    );

    const finalScore = Math.round(similarityScore * 0.8 + poseSimilarity * 0.2);
    const THRESHOLD = 55;
    const passed = finalScore >= THRESHOLD;

    return res.json({
      success: true,
      matched: passed,
      score: finalScore,
      message: passed
        ? 'Face verification successful'
        : `Face does not match ID (${finalScore}% similarity). Try better lighting.`
    });

  } catch (err) {
    console.error('verifyFace error:', err?.response?.data || err.message);
    return res.status(500).json({ success: false, message: 'Face comparison failed. Try again.' });
  }
};