# Proce - Strategic Growth Management Platform

A comprehensive platform for managing company strategy, KPIs, OKRs, and team collaboration with AI-powered insights.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

**Local Development**: http://localhost:5176/

## 📦 Tech Stack

- **Frontend**: React 19, Vite 7, TypeScript 5.9
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **State Management**: TanStack Query v5
- **Code Quality**: ESLint (flat config) + Prettier (+ Tailwind plugin)

## 🎨 Design System

- **Primary Color**: `#3D3EFF`
- **Border Radius**: rounded-2xl
- **Animation**: Soft, smooth transitions
- **Components**: Located in `src/components/ui`

## 🏗️ Project Structure

```
src/
├── app/                    # Application pages
│   ├── auth/              # Authentication (login, signup)
│   ├── dashboard/         # Main dashboard
│   ├── okr/              # OKR management
│   ├── projects/         # Project management
│   └── ai-recommendations/ # AI insights
├── components/            # Reusable components
│   └── ui/               # UI primitives
├── services/             # API and business logic
│   ├── ai/              # AI recommendation engine
│   ├── analytics/       # Pattern analysis
│   └── api/             # Backend API clients
├── providers/            # Context providers
└── utils/               # Utility functions
```

## ✨ Key Features

### 🎯 Strategic Management
- Company Strategy & Vision Management
- KPI (Key Performance Indicators) Tracking
- OKR (Objectives & Key Results) System
- Project & Task Management

### 🤖 AI-Powered Insights
- Automated Performance Analysis
- Success Pattern Recognition
- Risk & Opportunity Detection
- Next Quarter Goal Recommendations
- Resource Optimization Suggestions

### 👥 Team Collaboration
- Department & Role Management
- Inter-departmental Dependency Tracking
- Real-time Progress Updates
- Team Performance Analytics

### 📊 Analytics & Reporting
- Executive Dashboards
- Performance Metrics
- Custom Reports
- Data Visualization

## 🔐 Authentication

### Company Signup
1. Email verification
2. Company information
3. Admin account setup

### Employee Signup
1. Email + Invite Code verification
2. Employee information
3. Department & role assignment

## 📝 Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Type-check and build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

## 🌐 Deployment

Automatically deployed to AWS S3 via GitHub Actions on push to `main` branch.

**Production URL**: Configured via AWS S3 static hosting

## 📚 Documentation

Detailed documentation available in `/docs`:

- `EMPLOYEE_SIGNUP_INVITE_CODE.md` - Employee signup implementation
- `STRATEGIC_GROWTH_SYSTEM_PLANNING_KO.md` - Strategic growth system (Korean)
- `STRATEGIC_GROWTH_SYSTEM_TECHNICAL_KO.md` - Technical documentation (Korean)
- `BUSINESS_MODEL.md` - Business model & pricing strategy

## 🔧 Environment Variables

Create `.env` file based on `.env.example`:

```bash
VITE_API_BASE_URL=http://3.36.126.154:4000/api/v1
```

## 📄 License

Proprietary - YigoLab Development Team

## 👥 Team

**Organization**: yigolabdev  
**Repository**: proce  
**Last Updated**: January 2026
