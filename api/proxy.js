const axios = require('axios');

export default async function handler(req, res) {
    const { url, ua } = req.query;
    if (!url) return res.status(400).send("Url missing");

    try {
        const targetUrl = decodeURIComponent(url);
        const range = req.headers.range; // هنا السحر: استقبال طلب القطع من المتصفح

        const headers = {
            'User-Agent': ua || 'And$MyTV',
            'Referer': new URL(targetUrl).origin,
        };

        if (range) {
            headers['Range'] = range; // تمرير طلب القطعة للسيرفر الأصلي
        }

        const response = await axios({
            method: 'get',
            url: targetUrl,
            responseType: 'stream',
            headers: headers,
            timeout: 15000
        });

        // إرسال الترويسات التي تطلبها المتصفحات (مثل سفاري وكروم) لتشغيل الفيديو
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Access-Control-Allow-Origin', '*');

        if (response.headers['content-range']) {
            res.setHeader('Content-Range', response.headers['content-range']);
            res.status(206); // إخبار المتصفح أن هذه "قطعة" من الفيديو وليست الملف كاملاً
        }

        response.data.pipe(res);
    } catch (e) {
        res.status(500).send("Error: " + e.message);
    }
}
