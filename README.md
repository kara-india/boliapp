Mumbai Prototype - Listing & Bidding (with PDF preview)
======================================================

What is inside:
- src/App.jsx : main React app (prototype).
- src/main.jsx
- src/index.css (placeholder)
- public/sample-docs/*.pdf : sample PDFs used by the prototype.
- index.html, package.json

Quick start (recommended - Vite):
1. Ensure Node.js (16+) and npm are installed.
2. In a terminal, run:
   npm create vite@latest mumbai-prototype -- --template react
   cd mumbai-prototype
3. Replace the generated src/App.jsx with the file from this bundle (src/App.jsx).
   Also replace src/main.jsx and src/index.css if necessary.
4. Copy the 'public/sample-docs' folder from this bundle into your project's public folder.
5. Install deps and run:
   npm install
   npm run dev
6. Open the dev URL (usually http://localhost:5173) to view the prototype.

Deploy to Vercel / Netlify:
- Vercel: Connect the Git repo to Vercel (or drag-and-drop the project folder). Vercel auto-detects Vite/React and deploys.
- Netlify: Connect the Git repo; set build command: `npm run build` and publish directory: `dist`.

Important notes:
- This is a demo prototype. All payments are simulated. DO NOT accept live funds or claim agent status until legal gating (MahaRERA registration, escrow bank, KYC) is completed.
- For a production build, integrate Tailwind (recommended), KYC, eSign, and a real escrow/payment flow.
