# GreenGo - ESG Educational App

## Overview

GreenGo (綠捷) is a mobile-first ESG (Environmental, Social, and Governance) educational application designed specifically for metro commuters in Taiwan. The app gamifies environmental learning through interactive quizzes, progress tracking, and a rewards system to encourage sustainable behaviors and knowledge acquisition.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React-based single-page application with TypeScript
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Build System**: Vite for frontend bundling and esbuild for server compilation

## Key Components

### Frontend Architecture
- **React Router**: Uses wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: Comprehensive shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom ESG-themed color palette
- **Mobile-First Design**: Responsive design optimized for mobile devices with bottom navigation

### Backend Architecture
- **Express.js Server**: RESTful API with middleware for logging and error handling
- **Database Layer**: PostgreSQL with Drizzle ORM using Neon serverless database
- **Storage Interface**: DatabaseStorage implementation for all data operations
- **Session Management**: Express session handling with PostgreSQL store

### Data Models
- **Users**: User profiles with levels, points, and experience tracking
- **Quiz System**: Categories, questions, and progress tracking
- **Achievements**: Gamification system with unlockable badges
- **Rewards**: Point-based reward system for user engagement
- **Daily Tips**: Educational content delivery system

## Data Flow

1. **User Authentication**: Basic user system with default user for demo purposes
2. **Quiz Flow**: 
   - Fetch quiz categories and questions
   - Track user progress and scores
   - Update user points and experience
3. **Progress Tracking**: Real-time updates of user achievements and learning progress
4. **Rewards System**: Points accumulation and redemption workflow

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **express**: Web application framework

### UI Dependencies
- **@radix-ui/***: Comprehensive set of UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Dependencies
- **vite**: Frontend build tool
- **typescript**: Type safety
- **tsx**: TypeScript execution for development

## Deployment Strategy

The application is configured for deployment on Replit with the following characteristics:

- **Development Mode**: Uses Vite dev server with HMR for frontend and tsx for backend
- **Production Build**: 
  - Frontend: Vite builds to `dist/public`
  - Backend: esbuild compiles to `dist/index.js`
- **Environment Variables**: Requires `DATABASE_URL` for PostgreSQL connection
- **Static Assets**: Served from the built frontend directory

The application uses a mobile container design pattern to simulate a native mobile app experience within a web browser, complete with status bar and bottom navigation.

## Changelog

- July 02, 2025 - Initial setup with React-based mobile web application
- July 02, 2025 - Integrated PostgreSQL database with Drizzle ORM
- July 02, 2025 - Migrated from in-memory storage to persistent database storage
- July 02, 2025 - Added comprehensive QR code scanning functionality with real camera access
- July 02, 2025 - Enhanced home screen with sustainable island SVG and gamification features

## User Preferences

Preferred communication style: Simple, everyday language.