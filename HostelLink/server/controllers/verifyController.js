const Jimp = require('jimp');

// ── Helper: base64 to Jimp image ─────────────────────────────────────────
const base64ToJimp = async (base64String) => {
  const base64 = base64String.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');
  return await Jimp.read(buffer);
};

// ── Helper: resize image to standard size for comparison ─────────────────
const normalizeImage = (img) => {
  return img.clone().resize(100, 100).greyscale();
};

// ── Helper: detect if image has a face-like region ───────────────────────
const hasFaceRegion = (img) => {
  const resized = img.clone().resize(200, 200);
  const width = resized.bitmap.width;
  const height = resized.bitmap.height;

  let skinPixels = 0;
  let totalPixels = 0;

  const startX = Math.floor(width * 0.2);
  const endX = Math.floor(width * 0.8);
  const startY = Math.floor(height * 0.1);
  const endY = Math.floor(height * 0.9);

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const pixel = Jimp.intToRGBA(resized.getPixelColor(x, y));
      const r = pixel.r;
      const g = pixel.g;
      const b = pixel.b;

      const isSkin = (
        r > 60 && g > 40 && b > 20 &&
        r > g && r > b &&
        Math.abs(r - g) > 15 &&
        r - b > 20
      );

      if (isSkin) skinPixels++;
      totalPixels++;
    }
  }

  const skinRatio = skinPixels / totalPixels;
  return skinRatio > 0.08;
};

// ── Helper: crop center face region from image ────────────────────────────
const cropFaceRegion = (img) => {
  const width = img.bitmap.width;
  const height = img.bitmap.height;
  const cropX = Math.floor(width * 0.15);
  const cropY = Math.floor(height * 0.05);
  const cropW = Math.floor(width * 0.7);
  const cropH = Math.floor(height * 0.85);
  return img.clone().crop(cropX, cropY, cropW, cropH);
};

// ── Helper: compare two normalized images pixel by pixel ─────────────────
const compareImages = (img1, img2) => {
  const norm1 = normalizeImage(img1);
  const norm2 = normalizeImage(img2);

  const width = norm1.bitmap.width;
  const height = norm1.bitmap.height;

  let totalDiff = 0;
  const totalPixels = width * height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p1 = Jimp.intToRGBA(norm1.getPixelColor(x, y));
      const p2 = Jimp.intToRGBA(norm2.getPixelColor(x, y));
      totalDiff += Math.abs(p1.r - p2.r);
    }
  }

  const avgDiff = totalDiff / totalPixels;
  return Math.round(Math.max(0, Math.min(100, 100 - (avgDiff / 255) * 100)));
};

// ─────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-id
// ─────────────────────────────────────────────────────────────────────────
exports.verifyId = async (req, res) => {
  try {
    const { idImage } = req.body;
    if (!idImage) {
      return res.status(400).json({ success: false, message: 'ID image is required' });
    }

    const img = await base64ToJimp(idImage);
    const hasFace = hasFaceRegion(img);

    if (!hasFace) {
      return res.status(400).json({
        success: false,
        message: 'No face detected in the National ID. Please upload a clearer photo with good lighting.'
      });
    }

    return res.json({
      success: true,
      message: 'ID photo accepted successfully'
    });

  } catch (err) {
    console.error('verifyId error:', err.message);
    return res.status(500).json({ success: false, message: 'ID verification failed. Try again.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify-face
// ─────────────────────────────────────────────────────────────────────────
exports.verifyFace = async (req, res) => {
  try {
    const { idImage, selfieImage } = req.body;
    if (!idImage || !selfieImage) {
      return res.status(400).json({ success: false, message: 'Both ID and selfie images are required' });
    }

    const [idImg, selfieImg] = await Promise.all([
      base64ToJimp(idImage),
      base64ToJimp(selfieImage)
    ]);

    const idHasFace = hasFaceRegion(idImg);
    const selfieHasFace = hasFaceRegion(selfieImg);

    if (!idHasFace) {
      return res.status(400).json({
        success: false,
        message: 'No face found in National ID. Please upload a clearer photo.'
      });
    }

    if (!selfieHasFace) {
      return res.status(400).json({
        success: false,
        message: 'No face found in selfie. Make sure your face is clearly visible with good lighting.'
      });
    }

    const idFaceRegion = cropFaceRegion(idImg);
    const selfieFaceRegion = cropFaceRegion(selfieImg);
    const similarity = compareImages(idFaceRegion, selfieFaceRegion);

    const THRESHOLD = 40;
    const passed = similarity >= THRESHOLD;

    return res.json({
      success: true,
      matched: passed,
      score: similarity,
      message: passed
        ? 'Face verification successful'
        : `Face does not match ID (${similarity}% similarity). Try better lighting or a clearer photo.`
    });

  } catch (err) {
    console.error('verifyFace error:', err.message);
    return res.status(500).json({ success: false, message: 'Face comparison failed. Try again.' });
  }
};