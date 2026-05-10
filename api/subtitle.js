const axios = require('axios');

export default async function handler(req, res) {
    const { url } = req.query;
    try {
        const response = await axios.get(url);
        let srtData = response.data;
        
        // تحويل بسيط من SRT إلى VTT
        let vttData = "WEBVTT\n\n" + srtData.replace(/,/g, '.');
        
        res.setHeader('Content-Type', 'text/vtt');
        res.status(200).send(vttData);
    } catch (e) {
        res.status(500).send("خطأ في التحويل");
    }
}
