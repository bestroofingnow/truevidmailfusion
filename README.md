# TrueVid Mail Fusion

A simple Node.js backend for a video email platform. This repository contains an Express server with MongoDB models and routes to register users, upload videos to Cloudinary and send notification emails. The implementation follows the guidelines provided in the project instructions.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your credentials.
3. Start the server:
   ```bash
   npm start
   ```

The server exposes routes under `/api/auth` for login and registration, and `/api/videos` for uploading and retrieving videos. Uploads are stored in Cloudinary and links are emailed to recipients using nodemailer.
