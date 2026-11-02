# BrandAI – AI Brand Intelligence Platform

A full-stack web app that generates slogans, captions and hashtags for brands using AI models, and lets you compare the outputs of different models.

## Features
- Generates slogans, captions and hashtags from brand details
- Uses DeepSeek and GPT OSS models through the OpenRouter API
- Compares and evaluates outputs from different AI models
- Interactive dashboard to view generated content and results

## Tech Stack
- **Frontend:** React.js (Vite)
- **Backend:** Node.js
- **AI:** OpenRouter API (DeepSeek, GPT OSS)

## Screenshots
[add screenshots here]

## How to Run

1. Clone the repository
   ```
   git clone https://github.com/reena2002-08/BrandAI.git
   cd BrandAI
   ```

2. Start the server
   ```
   cd server
   npm install
   ```
   Create a `.env` file in the `server` folder:
   ```
   OPENROUTER_API_KEY=your_key_here
   ```
   Then run: `node server.js`

3. Start the client (in a new terminal)
   ```
   cd client
   npm install
   npm run dev
   ```

## Author
M Reena – [LinkedIn](https://www.linkedin.com/in/reena-murari-2a911a2ba)
