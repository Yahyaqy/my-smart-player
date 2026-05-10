const axios = require('axios');
const http = require('http');
const https = require('https');

export default async function handler(req, res) {
    let { url, ua } = req.query;

    if (!url) return res.status(400).send("الرابط مفقود");

    try {
        const targetUrl = decodeURIComponent(url);
        
        const response = await axios({
            method: 'get',
            url: targetUrl,
            responseType: 'stream',
            headers: { 
                'User-Agent': ua || 'And$MyTV',
                'Referer': new URL(targetUrl).origin 
            },
            // السماح بالاتصال بالروابط غير المشفرة
            httpAgent: new http.Agent({ keepAlive: true }),
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Access-Control-Allow-Origin', '*'); // للسماح بالتشغيل في أي مكان
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send("خطأ: تأكد أن رابط الفيديو يعمل في المتصفح أولاً");
    }
}
