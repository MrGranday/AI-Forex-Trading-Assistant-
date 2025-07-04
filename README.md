# AI-Powered Gold Trading Assistant

A modern React application with Node.js backend that provides AI-powered trading suggestions for gold (XAU/USD).

## Features

- **User Authentication**: Secure login system with JWT tokens
- **Live Gold Charts**: Real-time TradingView charts for XAU/USD
- **AI Trading Suggestions**: Get intelligent trading recommendations powered by Gemini AI
- **Historical Analysis**: View past suggestions and performance
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Professional dark theme optimized for trading

## Tech Stack

### Frontend
- React 18 with JavaScript (.jsx)
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- TradingView widgets for charts

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Gemini AI for trading suggestions
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- Gemini API key (optional, for AI features)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret for JWT tokens
   - `GEMINI_API_KEY`: Your Gemini API key (optional)

3. **Start MongoDB:**
   Make sure MongoDB is running locally or provide a cloud URI.

4. **Run the development servers:**
   
   **Frontend:**
   ```bash
   npm run dev
   ```
   
   **Backend:**
   ```bash
   npm run dev:server
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Demo Credentials

For testing purposes, you can use:
- **Email**: test@example.com
- **Password**: password123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Suggestions
- `GET /api/suggestions/latest` - Get latest AI suggestion
- `GET /api/suggestions` - Get all user suggestions
- `POST /api/suggestions/refresh` - Generate new AI suggestion

## Features Overview

### Dashboard
- Live gold price chart with TradingView integration
- AI-powered trading suggestions with confidence scores
- Entry points, targets, and stop-loss recommendations
- Historical suggestion tracking

### AI Analysis
- Market sentiment analysis
- Technical indicator evaluation
- Risk/reward ratio calculations
- Detailed reasoning for each suggestion

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Secure token storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.