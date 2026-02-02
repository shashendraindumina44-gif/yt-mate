const express = require('express');
const ytSearch = require('yt-search');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.json({ status: 'API is Live! 🚀', message: 'Use /ytdl or /api/ytmp3' });
});

// මෙන්න මේ Routes දෙකම දාන්න, එතකොට 404 එන්නේ නැහැ
const downloadHandler = async (req, res) => {
    const query = req.query.name;
    if (!query) return res.status(400).json({ error: 'නම ලබා දෙන්න.' });

    try {
        const search = await ytSearch(query);
        const video = search.videos[0];
        if (!video) return res.json({ success: false, message: 'හමු නොවීය.' });

        // y2mate සර්වර් පාවිච්චි කරන API එක
        const resDl = await axios.get(`https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(video.url)}`);
        const downloadUrl = resDl.data.result.download.url || resDl.data.result.url;

        res.json({
            success: true,
            title: video.title,
            thumbnail: video.thumbnail,
            download_url: downloadUrl,
            videoId: video.videoId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

app.get('/ytdl', downloadHandler);
app.get('/api/ytmp3', downloadHandler); // බොට් එක මේක සර්ච් කළොත් දැන් වැඩ

app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
