# 🚀 Backend Setup Guide

Follow these steps to set up the Anime & Manga Quiz backend server with DeepSeek AI integration.

## Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **OpenRouter API Key** - [Get it here](https://openrouter.ai/)

## Quick Setup

### 1. Install Node.js (if not already installed)
```bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, download from https://nodejs.org/
```

### 2. Set up the Backend Server
```bash
# Open a new terminal window/tab
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Get Your OpenRouter API Key
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for a free account
3. Go to "Keys" section in your dashboard
4. Create a new API key
5. Add some credits to your account (very affordable - DeepSeek costs ~$0.0001 per request)

### 4. Configure Environment
Edit the `.env` file in the backend folder:

```env
# Your OpenRouter API key
DEEPSEEK_API_KEY=your_openrouter_api_key_here

# Server settings
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

### 5. Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# OR production mode
npm start
```

You should see:
```
Server running on port 3001
Health check: http://localhost:3001/api/health
```

### 6. Test the Setup
The frontend will automatically detect when the backend is running. You should see:
- ✅ **API Status**: Online in the sidebar
- 🧠 **Quiz Mode**: AI Generated

## Troubleshooting

### Common Issues

**Backend server not starting:**
- Make sure Node.js is installed: `node --version`
- Check if port 3001 is available
- Verify your .env file has the correct API key

**API key issues:**
- Ensure you copied the key correctly (no extra spaces)
- Make sure you have credits in your OpenRouter account
- Verify the key has the correct permissions

**CORS errors:**
- Make sure both frontend (port 8080) and backend (port 3001) are running
- Check the FRONTEND_URL in your .env file

### Testing the API Manually

```bash
# Test health check
curl http://localhost:3001/api/health

# Test quiz generation
curl -X POST http://localhost:3001/api/quiz \
  -H "Content-Type: application/json" \
  -d '{"difficulty": "medium", "questionCount": 3}'
```

## Production Deployment

For production deployment, consider:
- Using PM2 for process management
- Setting up nginx as a reverse proxy
- Using environment variables for sensitive data
- Implementing rate limiting and caching

See the full `backend/README.md` for detailed production setup instructions.

## Cost Information

DeepSeek through OpenRouter is very affordable:
- **Cost per quiz**: ~$0.0001 (1/100th of a cent)
- **100 quizzes**: ~$0.01 (1 cent)
- **10,000 quizzes**: ~$1.00

Perfect for development and even production use!

## Need Help?

If you encounter any issues:
1. Check the console logs in both frontend and backend
2. Verify your API key and account credits
3. Make sure both servers are running on the correct ports
4. Test the API endpoints manually using curl or Postman

The app works great in offline mode with mock data, so you can always develop and test without the backend running!