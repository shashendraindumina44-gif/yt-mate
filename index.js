const express = require('express');
const axios = require('axios');
const qs = require('qs'); // Form data යැවීමට
const ytSearch = require('yt-search');
const app = express();

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => res.json({ status: 'Custom Y2Mate Scraper Live!' }));

app.get(['/ytdl', '/api/ytmp3'], async (req, res) => {
    const query = req.query.name;
    if (!query) return res.status(400).json({ error: 'සින්දුවේ නම ඇතුළත් කරන්න.' });

    try {
        // 1. YouTube සෙවීම
        const search = await ytSearch(query);
        const video = search.videos[0];
        if (!video) return res.json({ success: false, message: 'වීඩියෝව හමු නොවීය.' });

        const videoUrl = video.url;

        // 2. Y2Mate Analyze - වීඩියෝ ලින්ක් එක Y2Mate එකට දීලා ID එකක් ගන්නවා
        const analyzeData = qs.stringify({
            'k_query': videoUrl,
            'k_page': 'home',
            'hl': 'en',
            'q_auto': '0'
        });

        const analyzeRes = await axios.post('https://www.y2mate.com/mates/en/analyzeV2/ajax', analyzeData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        });

        // 3. Y2Mate Convert - ලබාගත්ත ID එක පාවිච්චි කරලා MP3 ලින්ක් එක ඉල්ලනවා
        // මෙහි 'fbtid' සහ 'k' අගයන් analyzeRes එකෙන් ලබාගන්නවා
        const kValue = analyzeRes.data.links.mp3['mp3128'].k; 
        const vidId = analyzeRes.data.vid;

        const convertData = qs.stringify({
            'vid': vidId,
            'k': kValue
        });

        const convertRes = await axios.post('https://www.y2mate.com/mates/en/convertV2/index', convertData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        });

        // 4. අවසාන Download Link එක ලබා දීම
        if (convertRes.data.status === 'ok') {
            res.json({
                success: true,
                title: video.title,
                thumbnail: video.thumbnail,
                download_url: convertRes.data.dlink, // Y2Mate එකෙන් ලැබෙන සෘජු ලින්ක් එක
                duration: video.timestamp
            });
        } else {
            throw new Error('Y2Mate Conversion Failed');
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: 'Y2Mate Scraper Error: ' + error.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Scraper running on port ${PORT}`));
