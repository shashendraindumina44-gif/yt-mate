const express = require('express');
const ytSearch = require('yt-search');
const app = express();

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('TubeAPI Downloader is Running! 🚀');
});

app.get('/ytdl', async (req, res) => {
    const query = req.query.name;
    if (!query) return res.status(400).json({ error: 'සින්දුවේ නම ලබා දෙන්න.' });

    try {
        // 1. YouTube සෙවීම
        const search = await ytSearch(query);
        const video = search.videos[0];

        if (!video) return res.json({ success: false, message: 'වීඩියෝව හමු නොවීය.' });

        // 2. TubeAPI එකට අදාළ ඩවුන්ලෝඩ් පේජ් එකේ ලින්ක් එක සැකසීම
        // බොට් එක මේ ලින්ක් එක යැව්වම යූසර්ට ඒක ක්ලික් කරලා සින්දුව බාගත හැකියි.
        const downloadPage = `https://tubeapi.org/button#${video.videoId}`;

        res.json({
            success: true,
            title: video.title,
            thumbnail: video.thumbnail,
            videoId: video.videoId,
            download_url: downloadPage, // මෙතනදී අපි එවන්නේ TubeAPI එකේ ඩවුන්ලෝඩ් ලින්ක් එක
            duration: video.timestamp,
            author: video.author.name
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error එකක් සිදු විය.' });
    }
});

app.listen(PORT, () => console.log(`✅ Server live on port ${PORT}`));const express = require('express');
const ytSearch = require('yt-search');
const app = express();

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('TubeAPI Downloader is Running! 🚀');
});

app.get('/ytdl', async (req, res) => {
    const query = req.query.name;
    if (!query) return res.status(400).json({ error: 'සින්දුවේ නම ලබා දෙන්න.' });

    try {
        // 1. YouTube සෙවීම
        const search = await ytSearch(query);
        const video = search.videos[0];

        if (!video) return res.json({ success: false, message: 'වීඩියෝව හමු නොවීය.' });

        // 2. TubeAPI එකට අදාළ ඩවුන්ලෝඩ් පේජ් එකේ ලින්ක් එක සැකසීම
        // බොට් එක මේ ලින්ක් එක යැව්වම යූසර්ට ඒක ක්ලික් කරලා සින්දුව බාගත හැකියි.
        const downloadPage = `https://tubeapi.org/button#${video.videoId}`;

        res.json({
            success: true,
            title: video.title,
            thumbnail: video.thumbnail,
            videoId: video.videoId,
            download_url: downloadPage, // මෙතනදී අපි එවන්නේ TubeAPI එකේ ඩවුන්ලෝඩ් ලින්ක් එක
            duration: video.timestamp,
            author: video.author.name
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error එකක් සිදු විය.' });
    }
});

app.listen(PORT, () => console.log(`✅ Server live on port ${PORT}`));
