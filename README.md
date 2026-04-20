# ProLearning Finder

A search and recommendation tool that helps ProLearners find real-world learning activities aligned with their career goals.

Built as part of the LearnHaus Technical ProLearning Project (Option D: Search / Results Interface).

---

## What I Built

A full-stack web application where a user inputs their career goal, experience level, location, budget, and preferred activity types. The app combines a curated dataset of ProLearning activities with live YouTube video results, then uses the Claude API to intelligently rank and explain the top 5 recommendations.

## What I Focused On

I focused on the end-to-end search and results experience — specifically the recommendation logic. The core value is that Claude reads both the user's profile and the full activity dataset together, then produces ranked results with personalized explanations for why each activity matches that specific user.

## What Works

- Intake form with career goal, level, location, budget slider, and activity type filters
- Live YouTube Data API integration pulling relevant tutorial videos
- Claude API ranking and explaining the top 5 results from a combined pool
- Results view with activity cards showing type, explanation, cost, and source link
- Back button to search again

## What Is Incomplete

- Dataset is seeded/curated (15 activities) rather than a live normalized database
- No persistent storage or user accounts
- Location is passed to Claude as context but not used for geo-filtering (future: Eventbrite API for local events)
- No freshness or verification timestamps on seeded data

## Assumptions Made

- Seeded dataset of real activities with real URLs is acceptable as the internal activity index
- Claude acts as the ranking/matching engine (heuristic + semantic hybrid — it reasons over the dataset using the user's profile)
- YouTube API supplements the curated data with live video content relevant to the user's goal
- Budget slider maps to a 0–500 dollar range passed as context to Claude
- Missing fields (exact pricing, eligibility) are left as general descriptions rather than fabricated values

## Architecture
Browser (HTML/CSS/JS)
↓ POST /recommend
Node/Express Server (server.js)
├── YouTube Data API v3 → live video results
├── Seeded dataset (15 curated ProLearning activities)
└── Claude API (claude-sonnet-4-20250514) → ranked JSON with explanations
↓ JSON response
Browser renders result cards

## How to Run

**Requirements:** Node.js, npm, Anthropic API key, YouTube Data API v3 key

**Setup:**
```bash
git clone <your-repo-url>
cd prolearning
npm install
```

Create a `.env` file in the root:
ANTHROPIC_API_KEY=your_key_here
YOUTUBE_API_KEY=your_key_here

**Start:**
```bash
node server.js
```

Visit `http://localhost:3000`

## Demo Path

1. Open `http://localhost:3000`
2. Enter a career goal (e.g. "Become a software engineer")
3. Select your level (e.g. Student)
4. Enter your location (e.g. Sacramento, CA)
5. Set your budget using the slider
6. Check your preferred activity types
7. Click "Find ProLearning Activities"
8. View ranked results with explanations and source links

## What I'd Build Next

- Normalize the dataset into a proper database (PostgreSQL) with freshness and verification fields
- Add Eventbrite API for real local events filtered by location
- Add Coursera/edX API integrations for live course data
- Implement semantic search over the activity index rather than passing the full dataset to Claude
- Add source confidence scores and verification timestamps to each result

## Time Spent

Approximately 3–4 hours (built in one evening)

## AI Tool Usage

I used AI tools to build this README file as well as the stylesheets for the UI. 