const express = require('express');
const ytSearch = require('yt-search');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 8000;

// Home Route
app.get('/', (req, res) => {
    res.json({ status: 'Y2Mate Downloader API is Live! 🚀' });
});

// Endpoint: /ytdl?name=සින්දුවේ_නම
app.get('/ytdl', async (req, res) => {
    const query = req.query.name;
    if (!query) return res.status(400).json({ error: 'කරුණාකර නම ලබා දෙන්න.' });

    try {
        // 1. YouTube එකේ සෙවීම
        const search = await ytSearch(query);
        const video = search.videos[0];

        if (!video) {
            return res.json({ success: false, message: 'වීඩියෝව හමු නොවීය.' });
        }

        const videoUrl = video.url;

        // 2. Y2Mate තාක්ෂණය පාවිච්චි කරන API එකකින් ලින්ක් එක ලබා ගැනීම
        // අපි මෙතනදී ඉතාමත් වේගවත් API එකක් පාවිච්චි කරනවා
        const resDl = await axios.get(`https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(videoUrl)}`);
        
        const downloadData = resDl.data.result;

        // 3. ප්‍රතිඵලය JSON එකක් විදිහට ලබා දීම
        res.json({
            success: true,
            title: video.title,
            thumbnail: video.thumbnail,
            download_url: downloadData.download.url || downloadData.url,
            duration: video.timestamp,
            views: video.views,
            author: video.author.name,
            videoId: video.videoId
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'වීඩියෝව ලබාගත නොහැකි විය. පසුව උත්සාහ කරන්න.' 
        });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
