# SkyExplorer AI

SkyExplorer AI is an interactive astronomical exploration tool that allows users to traverse the Sloan Digital Sky Survey (SDSS) through a refined, high-performance interface. Powered by Aladin Lite and Gemini AI, it provides real-time object analysis, intelligent caching, and deep cosmic insights.

## Features

- **Interactive Sky Plate**: Explore the cosmos using the Aladin Lite v3 API with DSS2 Color surveys.
- **AI-Powered Analysis**: Get instant, professional astronomical summaries of any object or coordinate using Gemini 3.1 Flash.
- **Persistent Caching**: Intelligent Firestore-based caching ensures that previously analyzed objects load instantly for all users.
- **Coordinate Navigation**: Jump to any specific Right Ascension (RA) and Declination (Dec) with precision.
- **Seed Database**: A curated collection of 50 primary galaxies to jumpstart your exploration.
- **Google Authentication**: Secure access and personalized history via Firebase Auth.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4.
- **Animations**: Motion (framer-motion).
- **Icons**: Lucide React.
- **Database & Auth**: Firebase (Firestore, Authentication).
- **AI**: Google Gemini API (@google/genai).
- **Astronomy**: Aladin Lite v3, SDSS Data.
- **Markdown Rendering**: React-Markdown with LaTeX support (remark-math, rehype-katex).

## Getting Started

1. **Connect**: Sign in with your Google account to access the explorer.
2. **Explore**: Click anywhere on the sky plate to select an object.
3. **Search**: Enter RA/Dec coordinates in the sidebar to jump to a specific location.
4. **Learn**: Read the AI-generated summaries for deep insights into celestial bodies.

## Configuration

The application requires the following environment variables:

- `GEMINI_API_KEY`: Your Google Gemini API key.
- `APP_URL`: The hosted URL of the application.

Firebase configuration is managed via `firebase-applet-config.json`.
