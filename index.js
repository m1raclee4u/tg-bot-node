const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const https = require('https');
const http = require('http');
const fs = require('fs');

const token = '5784579104:AAEnhhHiT8GD3Fra4fH6102kbhYl-X2P7pI';
const webAppUrl = 'https://marvelous-bunny-035f81.netlify.app/';

const bot = new TelegramBot(token, {polling: true});
const app = express();

const certDir = `/etc/letsencrypt/live`;
const domain = `webapptelegram.hopto.org`;
const options = {
  key: fs.readFileSync(`${certDir}/${domain}/privkey.pem`),
  cert: fs.readFileSync(`${certDir}/${domain}/fullchain.pem`)
};


app.use(express.json());
app.use(cors());

http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);


app.listen(PORT, () => console.log('server started on PORT ' + PORT))
