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

const { fetch } = require('undici')
const Moysklad = require('moysklad');
const { response } = require('express');
const ms = Moysklad({ fetch })

require('dotenv').config();

let g_products = []




app.use(express.json());
app.use(cors());


const productsCollection = ms.GET('/report/stock/all')
productsCollection.then(function (result) {
    g_products.push(result)        
})


app.get('/products', async (req, res) => {
    let nonNullSalePriceProducts = []
    for (const item in g_products[0].rows) {
        if (Object.hasOwnProperty.call(g_products[0].rows, item)) {
            const element = g_products[0].rows[item];
            if (element.salePrice != 0) {
                nonNullSalePriceProducts.push(element)
            }
        }
    }
    res.status(200).json(nonNullSalePriceProducts)
})


// Сертификат
// const certDir = `/etc/letsencrypt/live`;
// const domain = `webapptelegram.hopto.org`;
// const options = {
//   key: fs.readFileSync(`${certDir}/${domain}/privkey.pem`),
//   cert: fs.readFileSync(`${certDir}/${domain}/fullchain.pem`)
// };


// Через Авито
// const osmosis = require('osmosis');

// osmosis
//     .get('https://www.avito.ru/user/5b326dfd4bf0d9606d4931a107859f56/profile?id=2840424375&src=item&page_from=100from_item_card&iid=2840424375')
//     .find('#botstuff')
//     .set({'related': ['.card-section .brs_col p a']})
//     .data(function(data) {
//         console.log(data);
//     })


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

        } catch (e) {
            console.log(e);
        }
    }
});

app.post('/products', async (req, res) => {
    // let res_product = []

    // res.end(JSON.stringify(res_product)) 

})

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

app.listen(PORT, () => console.log('server started on PORT ' + PORT))
