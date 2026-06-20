<div align="center">
  <h1>🚦 FlowGuard Traffic Intelligence Platform</h1>
  <p><strong>AI-Powered Traffic Management & Event Response System</strong></p>
  <p>
    <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat&logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=flat&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-8.0.16-646CFF?style=flat&logo=vite" alt="Vite">
    <img src="https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=flat&logo=google" alt="Gemini AI">
    <img src="https://img.shields.io/badge/Express-4.21.2-000000?style=flat&logo=express" alt="Express">
  </p>
</div>

---

## 🎯 Problem Statement

Political rallies, festivals, sports events, construction activities, and sudden gatherings create localized traffic breakdowns. **FlowGuard** uses historical and real-time traffic data to forecast event-related congestion and recommend optimal manpower deployment, barricading strategies, and diversion plans.

Built using real **Bengaluru Traffic Police incident data** for analysis and decision support.

---

## 📋 Overview

**FlowGuard** is an AI-powered traffic intelligence platform that predicts and manages event-driven congestion and orchestrates real-time diversion routes, resource deployments, and policing coordination. Built with modern React and powered by Google's Gemini AI, FlowGuard provides a tactical command center for traffic administrators, field officers, and logistics managers.

### ✨ Key Features

- 🗺️ **Interactive Map Visualization** - Real-time traffic event mapping with severity indicators
- 🤖 **AI-Powered Insights** - Gemini AI chat advisor for predictive traffic analysis
- 📊 **Real Data Analytics** - Built on actual Bengaluru Traffic Police dataset (March 2023 - March 2024)
- 🚨 **Event Management System** - Create, update, and track traffic disruption events
- 🚧 **Resource Optimization** - Deploy officers and barricades efficiently
- 🛣️ **Diversion Planner** - Generate alternative routes during events
- 📈 **Historical Analysis** - Traffic hotspot identification and pattern recognition
- 🔔 **Real-time Notifications** - Alert system for critical events
- 👥 **Role-based Access** - Admin, Officer, and Manager roles with appropriate permissions

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flowguard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory (or rename `.env.example`):
   ```bash
   cp .env.example .env
   ```
   
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The application will start on `http://localhost:3000` (or the port specified by the server).

5. **Open in browser**
   
   Navigate to the local server URL displayed in your terminal.

---

## � Demo Credentials

The application includes role-based authentication. Use these demo accounts:

- **Admin Account**
  - Email: `admin@flowguard.city`
  - Password: `admin123`
  - Role: Traffic Administrator (Full system access)

- **Field Officer Account**
  - Email: `officer@flowguard.city`
  - Password: `officer123`
  - Role: Field Officer (Event monitoring, resource management)

- **Logistics Manager Account**
  - Email: `manager@flowguard.city`
  - Password: `manager123`
  - Role: Logistics Manager (Resource allocation, route planning)

---

## �📦 Available Scripts

| Command           | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Start the development server with hot reload          |
| `npm run build`   | Build the production application (frontend + backend) |
| `npm run preview` | Preview the production build locally                  |
| `npm run lint`    | Run TypeScript type checking                          |
| `npm start`       | Start the production server                           |
| `npm run clean`   | Clean the dist directory                              |

---

## 🏗️ Project Structure

```
flowguard/
├── src/
│   ├── components/          # React components
│   │   ├── AIInsightsPanel.tsx       # Gemini AI chat interface
│   │   ├── AuthPage.tsx              # Login/authentication
│   │   ├── DiversionPlanner.tsx      # Route planning tool
│   │   ├── EventCrud.tsx             # Event management
│   │   ├── HistoricalView.tsx        # Historical data analysis
│   │   ├── InteractiveMap.tsx        # Map visualization
│   │   ├── LandingPage.tsx           # Landing page
│   │   ├── OnboardingOverlay.tsx     # User onboarding
│   │   ├── RealDataDashboard.tsx     # Analytics dashboard
│   │   └── ResourcePanel.tsx         # Resource management
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── types.ts             # TypeScript type definitions
│   ├── index.css            # Global styles
│   └── bangalore_traffic_dataset.json  # Real traffic data
├── assets/                  # Static assets
├── dist/                    # Production build output
├── scratch/                 # Analysis and utility scripts
├── server.ts                # Express backend server (TypeScript)
├── server.cjs               # Express backend server (compiled)
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Project dependencies
└── README.md                # This file
```

---

## 🎯 Usage

### Core Workflows

1. **View Dashboard** - Monitor active events and system statistics
2. **Create Event** - Add new traffic disruption events with location and severity
3. **Manage Resources** - Deploy officers and barricades to events
4. **Plan Diversions** - Generate alternative routes for affected areas
5. **AI Advisor** - Chat with Gemini AI for traffic predictions and insights
6. **Analytics** - Review hotspot data and historical patterns

---

## 🧠 AI Features

FlowGuard integrates Google's Gemini AI to provide:

- **Predictive Traffic Analysis** - Forecast congestion based on event data
- **Smart Route Suggestions** - AI-recommended diversion routes
- **Pattern Recognition** - Identify recurring traffic issues
- **Natural Language Queries** - Ask questions about traffic patterns
- **Real-time Recommendations** - Dynamic resource allocation suggestions

---

## 📊 Real Data Integration

The platform is built using actual traffic incident data from **Bengaluru Traffic Police** for analysis and decision support:

- **Time Period**: March 2023 - March 2024
- **Coverage**: Multiple police stations and traffic zones
- **Analysis**: Major corridors and hotspot identification
- **Use Case**: Historical pattern analysis and predictive modeling

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 8** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **Framer Motion** - Animations

### Backend
- **Express.js** - Web server
- **Node.js** - Runtime environment
- **Google Gemini AI** - AI/ML capabilities
- **dotenv** - Environment configuration

### Build Tools
- **esbuild** - Fast JavaScript bundler
- **tsx** - TypeScript execution
- **Autoprefixer** - CSS post-processing

---

## 🔒 Environment Variables

Create a `.env` file with the following:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_api_key_here

# Optional: Server Configuration
PORT=3000
NODE_ENV=development
```

Get your Gemini API key from [Google AI Studio](https://ai.google.dev/).

---

## 🌐 Deployment

### Production Build

```bash
npm run build
npm start
```

### Deploy to Cloud Platforms

The application can be deployed to:
- **Vercel** - Frontend hosting with serverless functions
- **Render** - Full-stack deployment
- **Railway** - Container-based deployment

Ensure environment variables are configured in your deployment platform.

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill the process using port 3000 (or your configured port)
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

**Dependencies not installed**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Gemini API errors**
- Verify your API key is correct in `.env`
- Check your API quota and billing status
- Ensure you're using a valid Gemini API endpoint

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is part of a prototype demonstration and is provided as-is for educational and development purposes.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powering intelligent traffic predictions
- **Bengaluru Traffic Police** - For providing real-world traffic data
- **React & Vite Communities** - For excellent tooling and documentation

---

## 📧 Support

For questions, issues, or feedback, please open an issue in the repository or contact the development team.

---

<div align="center">
  <p>Built with ❤️ for smarter traffic management</p>
  <p><strong>FlowGuard</strong> - Tactical Traffic Intelligence Engine</p>
</div>
