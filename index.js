const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const https = require('https');
const http = require('http');
const fs = require('fs');

const token = '5784579104:AAEnhhHiT8GD3Fra4fH6102kbhYl-X2P7pI';
const webAppUrl = 'https://roaring-lollipop-ab88b5.netlify.app/';

const bot = new TelegramBot(token, { polling: true });
const app = express();

// const certDir = `/etc/letsencrypt/live`;
// const domain = `webapptelegram.hopto.org`;
// const options = {
//   key: fs.readFileSync(`${certDir}/${domain}/privkey.pem`),
//   cert: fs.readFileSync(`${certDir}/${domain}/fullchain.pem`)
// };

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                inline_keyboard: [

                ]
            }
        })

        await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Сделать заказ', web_app: { url: webAppUrl } }]
                ]
            }
        })
    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)

            await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
            await bot.sendMessage(chatId, 'Операционная система: ' + data?.os);
            await bot.sendMessage(chatId, 'Показывать товары до: ' + data?.maxPrice);
            await bot.sendMessage(chatId, 'Показывать модели: ' + data?.model);

            // setTimeout(async () => {
            //     await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
            // }, 3000)
        } catch (e) {
            console.log(e);
        }
    }
});

// app.post('/web-filter', async (req, res) => {
//     const { queryId, os, maxPrice, model } = req.body;
//     bot.answerWebAppQuery(queryId, {
//         type: 'article',
//         id: queryId,
//         title: 'Вы выбрали',
//         input_message_content: {
//             message_text: ` Операционная система: ${os}, Максимальная цена: ${maxPrice}, Производитель: ${model}`
//         }

//     })
//     res.status(200).json({});
// })

app.post('/web-data', async (req, res) => {
    const { queryId, products = [], price } = req.body;
    bot.answerWebAppQuery(queryId, {
        type: 'article',
        id: queryId,
        title: 'Успешная покупка',
        input_message_content: {
            message_text: ` Поздравляю с вашим выбором, ${products.length}  на сумму ${price}`
        }       

    })
    bot.sendMessage('494388019', ` Хочет купить вот эти товары: ${products}`)
    res.status(200).json({});
})

const PORT = 8000;
// http.createServer(app).listen(8000);
// Create an HTTPS service identical to the HTTP service.
// https.createServer(options, app).listen(8443);

app.listen(PORT, () => console.log('server started on PORT ' + PORT))
