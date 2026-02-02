const express = require('express');
const ytSearch = require('yt-search');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.json({ status: 'API Online 🚀', endpoints: ['/ytdl', '/api/ytmp3'] });
});

app.get(['/ytdl', '/api/ytmp3'], async (req, res) => {
    const query = req.query.name;
    if (!query) return res.status(400).json({ success: false, error: 'Query name is required' });

    try {
        // 1. YouTube Search
        const search = await ytSearch(query);
        const video = search.videos[0];
        if (!video) return res.json({ success: false, message: 'Video not found' });

        // 2. Download Link එක ලබා ගැනීම (Stable Y2Mate API)
        // අපි මෙතනදී api.giftedtech.my.id පාවිච්චි කරමු, ඒක ගොඩක් ස්ථාවරයි.
        const dlRes = await axios.get(`https://api.giftedtech.my.id/api/download/dlmp3?url=${encodeURIComponent(video.url)}&apikey=gifted`);
        
        if (dlRes.data && dlRes.data.success) {
            return res.json({
                success: true,
                title: video.title,
                thumbnail: video.thumbnail,
                download_url: dlRes.data.result.download_url,
                duration: video.timestamp
            });
        } else {
            // Backup API - එකක් වැඩ නැති වුණොත් මේක බලනවා
            const backupRes = await axios.get(`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(video.url)}`);
            const dlUrl = backupRes.data.result.download.url || backupRes.data.result.url;
            
            return res.json({
                success: true,
                title: video.title,
                thumbnail: video.thumbnail,
                download_url: dlUrl,
                duration: video.timestamp
            });
        }

    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ success: false, error: 'Download servers are busy. Try again!' });
    }
});

app.listen(PORT, () => console.log(`✅ Server is running on port ${PORT}`));
