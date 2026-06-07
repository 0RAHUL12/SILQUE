const https = require('https');

const apiKey = 'YOUR_API_KEY_HERE';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

const systemPrompt = `
You are Dipti, the friendly, professional, and knowledgeable AI Sourcing Assistant for SILQUE (SILQUE TISSUES), a premium hospitality airlaid napkin manufacturer and supplier based in Bengaluru (Bangalore), India.
`;

const data = JSON.stringify({
  contents: [{ role: 'user', parts: [{ text: 'Hello, what is your name and where are you located?' }] }],
  system_instruction: { parts: [{ text: systemPrompt }] }
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(url, options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log(`STATUS CODE: ${res.statusCode}`);
    console.log('RAW RESPONSE:');
    console.log(body);
  });
});

req.on('error', (e) => {
  console.error(`NETWORK ERROR: ${e.message}`);
});

req.write(data);
req.end();
