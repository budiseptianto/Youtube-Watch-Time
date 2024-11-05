const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const randomUserAgent = require('random-useragent');
const fs = require('fs');
const readline = require('readline');

// Fungsi untuk membaca proxy dari file
function loadProxies(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return data.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
        console.error('Error reading proxy file:', error);
        return [];
    }
}

// Load proxies dari proxy.txt
const proxiesList = loadProxies('proxy.txt');

// Fungsi untuk membuat konfigurasi proxy menggunakan https-proxy-agent
function createProxyConfig(proxy) {
    return {
        httpsAgent: new HttpsProxyAgent(proxy),
        proxy: false // Nonaktifkan opsi proxy bawaan axios
    };
}

// Fungsi untuk menonton video
async function watchVideo(videoUrl) {
    if (proxiesList.length === 0) {
        console.log("Proxy list is empty. Please check the proxy.txt file.");
        return;
    }

    // Pilih proxy secara acak dari daftar
    const proxy = proxiesList[Math.floor(Math.random() * proxiesList.length)];
    const userAgent = randomUserAgent.getRandom();

    const config = {
        url: videoUrl,
        method: 'get',
        headers: {
            'User-Agent': userAgent,
        },
        timeout: 10000, // Timeout dalam milidetik (10 detik)
        ...createProxyConfig(proxy),
    };

    try {
        const response = await axios(config);
        console.log(`Video accessed with proxy: ${proxy} and user-agent: ${userAgent}`);
        console.log('Status code:', response.status);
        console.log('Watching video... (simulating full duration)');

        // Simulate watching full video duration of at least 15 minutes
        const watchDuration = Math.floor(Math.random() * (1800 - 900 + 1)) + 900; // Durasi antara 900-1800 detik (15-30 menit)
        console.log(`Watching for ${watchDuration} seconds...`);
        await new Promise(resolve => setTimeout(resolve, watchDuration * 1000));
        console.log('Finished watching.');

    } catch (error) {
        console.error(`Failed to access ${videoUrl} using proxy ${proxy}. Error:`, error.message);
    }
}

// Membuat antarmuka readline untuk input dari pengguna
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Meminta input URL video
rl.question('Enter the YouTube video URL: ', (videoUrl) => {
    console.log("Starting video watch loop... Press Ctrl+C to stop.");
    // Loop tak terbatas untuk menonton video dengan proxy acak
    (async () => {
        while (true) {
            await watchVideo(videoUrl);
            const delay = Math.floor(Math.random() * (30 - 15 + 1)) + 15; // Delay antara 15-30 detik
            console.log(`Waiting ${delay} seconds before next request...`);
            await new Promise(resolve => setTimeout(resolve, delay * 1000));
        }
    })();
});
