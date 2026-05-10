const axios = require('axios');

export default async function handler(req, res) {
    const { url, ua } = req.query;

    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream',
            headers: { 'User-Agent': ua || 'Mozilla/5.0' }
        });

        // تمرير الفيديو من السيرفر الأصلي إلى متصفحك مباشرة
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send("خطأ في جلب الفيديو");
    }
}
