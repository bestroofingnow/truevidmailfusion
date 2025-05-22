const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Video = require('../models/Video');
const auth = require('../middleware/auth');
const { sendVideoEmail } = require('../utils/emailService');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

router.post('/upload', auth, upload.single('video'), async (req, res) => {
  try {
    const { title, recipients } = req.body;
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'video-emails' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const video = new Video({
      userId: req.userId,
      title,
      videoUrl: result.secure_url,
      thumbnailUrl: result.secure_url.replace(/\.[^/.]+$/, '.jpg'),
      duration: result.duration,
      recipients: recipients.split(',').map(e => ({ email: e.trim() })),
      shareableLink: generateLink()
    });

    await video.save();
    for (const r of video.recipients) await sendVideoEmail(r.email, video);
    res.json({ success: true, video });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-videos', auth, async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/view/:shareableLink', async (req, res) => {
  try {
    const video = await Video.findOne({ shareableLink: req.params.shareableLink });
    if (!video) return res.status(404).json({ error: 'Video not found' });

    if (req.query.recipientEmail) {
      const recipient = video.recipients.find(r => r.email === req.query.recipientEmail);
      if (recipient) {
        recipient.viewCount += 1;
        recipient.viewedAt = new Date();
        await video.save();
      }
    }

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function generateLink() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = router;
