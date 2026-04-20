require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const PROLEARNING_DATASET = [
    { name: "Google Project Management Certificate", type: "Certificate", provider: "Coursera", cost: "free trial", url: "https://www.coursera.org/professional-certificates/google-project-management", tags: ["project management", "business", "professional"] },
    { name: "Google Data Analytics Certificate", type: "Certificate", provider: "Coursera", cost: "free trial", url: "https://www.coursera.org/professional-certificates/google-data-analytics", tags: ["data", "analytics", "tech"] },
    { name: "IBM Data Science Certificate", type: "Certificate", provider: "Coursera", cost: "free trial", url: "https://www.coursera.org/professional-certificates/ibm-data-science", tags: ["data science", "AI", "tech"] },
    { name: "Meta Front-End Developer Certificate", type: "Certificate", provider: "Coursera", cost: "free trial", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer", tags: ["web", "frontend", "tech"] },
    { name: "AWS Cloud Practitioner", type: "Certificate", provider: "AWS", cost: "paid", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/", tags: ["cloud", "tech", "infrastructure"] },
    { name: "Taproot Plus Volunteering", type: "Volunteering", provider: "Taproot", cost: "free", url: "https://taprootplus.org", tags: ["volunteering", "nonprofit", "skills", "professional"] },
    { name: "IEEE Membership & Communities", type: "Community", provider: "IEEE", cost: "paid", url: "https://www.ieee.org/membership/", tags: ["engineering", "tech", "networking", "professional"] },
    { name: "AI Community of Practice", type: "Community", provider: "Various", cost: "free", url: "https://www.meetup.com/topics/artificial-intelligence/", tags: ["AI", "machine learning", "networking"] },
    { name: "Toastmasters International", type: "Community", provider: "Toastmasters", cost: "paid", url: "https://www.toastmasters.org", tags: ["communication", "leadership", "professional"] },
    { name: "freeCodeCamp", type: "Course", provider: "freeCodeCamp", cost: "free", url: "https://www.freecodecamp.org", tags: ["coding", "web", "tech", "free"] },
    { name: "Harvard CS50 (Free)", type: "Course", provider: "edX", cost: "free", url: "https://cs50.harvard.edu/x/", tags: ["coding", "computer science", "tech", "free"] },
    { name: "Coursera Financial Markets (Yale)", type: "Course", provider: "Coursera", cost: "free trial", url: "https://www.coursera.org/learn/financial-markets-global", tags: ["finance", "business", "investing"] },
    { name: "LinkedIn Learning", type: "Course", provider: "LinkedIn", cost: "paid", url: "https://www.linkedin.com/learning/", tags: ["professional", "business", "tech", "leadership"] },
    { name: "MLH Hackathons", type: "Meetup", provider: "Major League Hacking", cost: "free", url: "https://mlh.io", tags: ["hackathon", "coding", "tech", "networking", "student"] },
    { name: "Eventbrite Professional Workshops", type: "Workshop", provider: "Eventbrite", cost: "varies", url: "https://www.eventbrite.com", tags: ["workshops", "professional", "networking", "local"] },
];

app.post('/recommend', async (req, res) => {
    const { goal, level, location, budget, activityTypes } = req.body;
    const youtubeRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${goal}+tutorial+career&type=video&maxResults=3&key=${process.env.YOUTUBE_API_KEY}`
    );
    let videos = [];
    try {
        const youtubeRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${goal}+tutorial+career&type=video&maxResults=3&key=${process.env.YOUTUBE_API_KEY}`);
        const youtubeData = await youtubeRes.json();
        videos = youtubeData.items.map(item => ({
            name: item.snippet.title,
            type: "Video",
            provider: item.snippet.channelTitle,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            cost: "free"
        }));
        console.log(`YouTube returned ${videos.length} videos`);

    } catch (err) {
        console.error("Error fetching YouTube data:", err);
    }
    const allActivities = [...PROLEARNING_DATASET, ...videos];

    const prompt = `
        You are a ProLearning recommendation engine for LearnHaus.

        A user is looking for real-world learning activities to help them grow professionally.

        User Profile:
        - Career Goal: ${goal}
        - Current Level: ${level}
        - Location: ${location}
        - Budget: $${budget}
        - Preferred Activity Types: ${activityTypes.join(', ')}

        Here are the available ProLearning activities:
        ${JSON.stringify(allActivities, null, 2)}

        Return ONLY a JSON array of the top 5 most relevant activities for this user.
        At least 1 result MUST be a Video type from the list.
        Each object must have these exact fields:
        - name
        - type
        - provider
        - url
        - cost
        - why (1-2 sentences explaining why this matches the user's goal)

        Do not invent any activities. Only use what is in the list above.
        Do not include any text outside the JSON array.`;
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    const claudeData = await claudeRes.json();
    const raw = claudeData.content[0].text.replace(/```json|```/g, '').trim();
    const recommendations = JSON.parse(raw);
    res.json(recommendations);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});