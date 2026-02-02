const express = require('express');
const ytSearch = require('yt-search');
const axios = require('axios');
const qs = require('qs');
const app = express();

const PORT = process.env.PORT || 8000;

// ලින්ක් එක වැඩද කියලා බලන්න බ්‍රවුසර් එකේ නිකම්ම ලෝඩ් කරලා බලන්න පුළුවන්
app.get('/', (req, res) => {
    res.send("<h1>Server is Live! 🚀</h1><p>Try: /ytdl?name=faded</p>");
});

app.get(['/ytdl', '/api/ytmp3'], async (req, res) => {
    const query = req.query.name;
    if (!query) return res.status(400).json({ error: 'සින්දුවේ නම දෙන්න.' });

    try {
        const search = await ytSearch(query);
        const video = search.videos[0];
        if (!video) return res.json({ success: false, message: 'හමු නොවීය.' });

        // Y2Mate Scraping Process
        const analyzeRes = await axios.post('https://www.y2mate.com/mates/en/analyzeV2/ajax', qs.stringify({
            k_query: video.url, k_page: 'home', hl: 'en', q_auto: '0'
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        const kValue = analyzeRes.data.links.mp3.mp3128.k;
        const vidId = analyzeRes.data.vid;

        const convertRes = await axios.post('https://www.y2mate.com/mates/en/convertV2/index', qs.stringify({
            vid: vidId, k: kValue
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        res.json({
            success: true,
            title: video.title,
            download_url: convertRes.data.dlink,
            thumbnail: video.thumbnail
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, error: "Y2Mate Error: " + e.message });
    }
});

app.listen(PORT, () => console.log(`✅ API Server is running on port ${PORT}`));
