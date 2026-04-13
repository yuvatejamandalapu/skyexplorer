# SkyExplorer AI
SkyExplorer AI is an interactive astronomical exploration tool that allows users to traverse the Sloan Digital Sky Survey (SDSS) through a refined, high-performance interface. Powered by Aladin Lite and Gemini AI, it provides real-time object analysis, intelligent caching, and deep cosmic insights.
## Features
- **Interactive Sky Plate**: Explore the cosmos using the Aladin Lite v3 API with DSS2 Color surveys.
- **AI-Powered Analysis**: Get instant, professional astronomical summaries of any object or coordinate using Gemini 3.1 Flash.
- **Relational Database (Supabase/PostgreSQL)**:
    - **Structured Caching**: AI-generated summaries and user queries are stored in a PostgreSQL database with JSONB support.
    - **Data Integrity**: Leverages SQL constraints and ACID compliance for reliable astronomical data management.
- **Coordinate Navigation**: Jump to any specific Right Ascension (RA) and Declination (Dec) with precision.
- **Seed Database**: A curated collection of 50 primary galaxies to jumpstart your exploration.
## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS 4.
- **Animations**: Motion (framer-motion).
- **Icons**: Lucide React.
- **Database**: Supabase (PostgreSQL).
- **AI**: Google Gemini API (@google/genai).
- **Astronomy**: Aladin Lite v3, SDSS Data.
- **Markdown Rendering**: React-Markdown with LaTeX support (remark-math, rehype-katex).
## Getting Started
1. **Enter**: Click the "Enter" button on the landing page to access the explorer.
2. **Explore**: Click anywhere on the sky plate to select an object.
3. **Search**: Enter RA/Dec coordinates in the sidebar to jump to a specific location.
4. **Learn**: Read the AI-generated summaries for deep insights into celestial bodies.

 
