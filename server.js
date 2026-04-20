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
    { name: "Coursera Legal Studies Courses", type: "Course", provider: "Coursera", cost: "free trial", url: "https://www.coursera.org/search?query=legal+studies", tags: ["law", "legal", "professional"] },
{ name: "MasterClass — Writing", type: "Course", provider: "MasterClass", cost: "paid", url: "https://www.masterclass.com/categories/writing", tags: ["writing", "author", "creative", "storytelling"] },
{ name: "Gotham Writers Workshop", type: "Workshop", provider: "Gotham Writers", cost: "paid", url: "https://www.writingclasses.com", tags: ["writing", "fiction", "creative writing", "author"] },
{ name: "Toastmasters International", type: "Community", provider: "Toastmasters", cost: "paid", url: "https://www.toastmasters.org", tags: ["communication", "public speaking", "leadership"] },
{ name: "Coursera Psychology & Mental Health", type: "Course", provider: "Coursera", cost: "free trial", url: "https://www.coursera.org/search?query=psychology", tags: ["psychology", "mental health", "counseling"] },
{ name: "HubSpot Marketing Certifications", type: "Certificate", provider: "HubSpot", cost: "free", url: "https://academy.hubspot.com", tags: ["marketing", "business", "sales", "content"] },
{ name: "Skillshare Creative Classes", type: "Course", provider: "Skillshare", cost: "paid", url: "https://www.skillshare.com", tags: ["design", "illustration", "creative", "art", "writing"] },
{ name: "Khan Academy", type: "Course", provider: "Khan Academy", cost: "free", url: "https://www.khanacademy.org", tags: ["math", "science", "humanities", "education", "free"] },
{ name: "Coursera Business Foundations", type: "Certificate", provider: "Coursera/Wharton", cost: "free trial", url: "https://www.coursera.org/specializations/wharton-business-foundations", tags: ["business", "entrepreneurship", "finance", "management"] },
{ name: "National Novel Writing Month (NaNoWriMo)", type: "Community", provider: "NaNoWriMo", cost: "free", url: "https://nanowrimo.org", tags: ["writing", "author", "fiction", "community"] },
{ name: "Coursera Biology & Life Sciences", type: "Course", provider: "Coursera", cost: "free trial", url: "https://www.coursera.org/search?query=biology", tags: ["biology", "science", "pre-med", "research"] },
{ name: "Khan Academy Biology", type: "Course", provider: "Khan Academy", cost: "free", url: "https://www.khanacademy.org/science/biology", tags: ["biology", "science", "free", "education"] },
{ name: "Cold Spring Harbor Laboratory DNA Learning Center", type: "Course", provider: "CSHL", cost: "free", url: "https://dnalc.cshl.edu", tags: ["biology", "genetics", "DNA", "research"] },
{ name: "American Society for Microbiology", type: "Community", provider: "ASM", cost: "paid", url: "https://asm.org", tags: ["microbiology", "biology", "research", "professional"] },
{ name: "Volunteering with Local Research Labs (Taproot/VolunteerMatch)", type: "Volunteering", provider: "VolunteerMatch", cost: "free", url: "https://www.volunteermatch.org", tags: ["biology", "research", "science", "volunteering"] },
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