# Anime & Manga Quiz Backend

This is the Node.js/Express backend for the Anime & Manga Quiz application. It provides API endpoints for generating quiz questions using the DeepSeek AI model through OpenRouter.

## 🚀 Features

- **AI-Generated Quizzes**: Dynamic quiz generation using DeepSeek AI
- **Multiple Question Types**: MCQ, True/False, Fill in the Blanks, Image-based
- **Difficulty Levels**: Easy, Medium, Hard
- **Secure API**: Environment-based API key management
- **CORS Support**: Ready for frontend integration
- **Error Handling**: Comprehensive error handling and validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenRouter API key (for DeepSeek access)

## 🛠️ Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API key:
   ```
   DEEPSEEK_API_KEY=your_openrouter_api_key_here
   PORT=3001
   ```

4. **Get your OpenRouter API key**
   - Visit [OpenRouter.ai](https://openrouter.ai/)
   - Create an account and get your API key
   - Add credits to your account (DeepSeek model is very affordable)

## 🔧 Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001`

## 📚 API Endpoints

### Generate Quiz
**POST** `/api/quiz`

Generates a new quiz with AI-powered questions.

**Request Body:**
```json
{
  "difficulty": "medium",     // "easy" | "medium" | "hard"
  "questionCount": 5,         // Number of questions (1-10)
  "topics": ["Naruto", "One Piece"]  // Optional: specific anime/manga series
}
```

**Response:**
```json
{
  "id": "quiz_1234567890",
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "difficulty": "medium",
      "question": "Who is the main character of Naruto?",
      "options": ["Sasuke", "Naruto", "Sakura", "Kakashi"],
      "correctAnswer": 1,
      "explanation": "Naruto Uzumaki is the main protagonist...",
      "timeLimit": 30
    }
  ],
  "difficulty": "medium",
  "timeLimit": 150,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Health Check
**GET** `/api/health`

Returns server status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 Question Types

### Multiple Choice (MCQ)
- 4 options provided
- `correctAnswer` is the index (0-3) of correct option

### True/False
- Boolean questions
- `correctAnswer` is 0 (false) or 1 (true)

### Fill in the Blank
- Text input questions
- `correctAnswer` is the exact string answer

### Image-based (Future)
- Questions with accompanying images
- Mixed with other question types

## 🔒 Security

- API keys are stored in environment variables
- CORS configured for frontend integration
- Input validation and sanitization
- Error handling without exposing sensitive data

## 🐛 Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400`: Bad Request (invalid parameters)
- `500`: Internal Server Error (API issues, parsing errors)

Example error response:
```json
{
  "error": "Failed to generate quiz",
  "message": "Invalid JSON response from AI"
}
```

## 🚀 Deployment

### Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start server.js --name "anime-quiz-api"
pm2 startup
pm2 save
```

### Using Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📊 API Usage & Costs

- **DeepSeek Model**: Very affordable, approximately $0.0001 per request
- **Rate Limiting**: 100 requests per 15 minutes per IP (configurable)
- **Caching**: Consider implementing Redis for frequent requests

## 🔄 Integration with Frontend

The frontend should call the quiz API like this:

```javascript
const response = await fetch('http://localhost:3001/api/quiz', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    difficulty: 'medium',
    questionCount: 5
  })
});

const quiz = await response.json();
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.