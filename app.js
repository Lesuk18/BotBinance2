const Binance = require('node-binance-api');
const Binance1 = require('binance-api-node').default

const binance = new Binance().options({
    APIKEY: 'buc0SrqYOirxhJf57DFPDaBU3dnvMSNOn3UwotC4zpm5DrVkTzQfWbVg6qXYDNmh',
    APISECRET: '7m3ODnsi7pI8nm85cKcH1fyg6i0yEI4KV7EEerXuVipZDFRolRrJjFH3cwUmcmSy'
});

const client = Binance1({
    apiKey: 'buc0SrqYOirxhJf57DFPDaBU3dnvMSNOn3UwotC4zpm5DrVkTzQfWbVg6qXYDNmh',
    apiSecret: '7m3ODnsi7pI8nm85cKcH1fyg6i0yEI4KV7EEerXuVipZDFRolRrJjFH3cwUmcmSy',
})

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

var pair = ''
var i = 0;
var side = '';
var amount = 65;
var sumDic = []
price = ''


count()
setTimeout(run, 3000);


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////


async function count() {
    Prices = await client.futuresPrices()
    //console.log(await client.futuresAccountBalance());
    balance = 0.5
    //console.log(balance);
    for (var symbol in Prices) {
        if (symbol === 'YFIUSDT') {
            sumDic[symbol] = balance * 20.0 / parseFloat(Prices[symbol])
            sumDic[symbol] = sumDic[symbol].toFixed(3);
        } else {
            sumDic[symbol] = parseInt(balance * 20.0 / parseFloat(Prices[symbol]))
        }
    }
    console.log(sumDic);
}


async function run(user_message_text = '#EOS buy') {

    if (user_message_text.includes('limit') || user_message_text.includes('many') || user_message_text.includes('consolidation zone') || user_message_text.includes('Still')
        || user_message_text.includes('still') || user_message_text.includes('Many') || user_message_text.includes('Limit') || user_message_text.includes('term') || user_message_text.includes('Wait')
        || user_message_text.includes('wait') || user_message_text.includes('LIMIT') || user_message_text.includes('like') || user_message_text.includes('close') || user_message_text.includes('Close')
        || user_message_text.includes('exit') || user_message_text.includes('Exit') || user_message_text.includes('short term')) {
        side = 'Nan'
    }


    str = user_message_text.split('#')
    pair = str[1][0] + str[1][1] + str[1][2]
    if (str[1][3] != ' ' && str[1][3] != '/') {
        pair += str[1][3]
        if (str[1][4] != ' ' && str[1][4] != '/') {
            pair += str[1][4]
        }
    }
    pair += 'USDT'

    if ((user_message_text.includes('SHORT') || user_message_text.includes('sell') || user_message_text.includes('Sell') || user_message_text.includes('SELL') || user_message_text.includes('Short')) && side !== 'Nan') {
        console.info(await binance.futuresMarketSell(pair, sumDic[pair]));
        side = 'SELL'
    } else if ((user_message_text.includes('LONG') || user_message_text.includes('Buy') || user_message_text.includes('long') || user_message_text.includes('BUY') || user_message_text.includes('BUy') || user_message_text.includes('buy') || user_message_text.includes('Long')
        || user_message_text.includes('Bought') || user_message_text.includes('bought')) && side !== 'Nan') {
        console.info(await binance.futuresMarketBuy(pair, sumDic[pair]));
        side = 'BUY'
    } else {
        side = 'Nan'
    }

    if (side == 'BUY') {
        side = 'SELL'
    } else if (side == 'SELL') {
        side = 'BUY'
    }
    position = await binance.futuresPositionRisk();
    entryPrice = 0;
    activePosNum = -1;
    for (var activePos in position) {
        if (position[activePos]['symbol'] === pair) {
            entryPrice = position[activePos]['entryPrice']
            activePosNum = activePos
            break
        }

    }

    while (entryPrice > 0) {
        position = await binance.futuresPositionRisk();
        if (parseFloat(position[activePosNum]['unRealizedProfit']) < -0.01) {
            if (side == 'SELL') {
                console.info(await binance.futuresMarketSell(pair, sumDic[pair]));
            } else {
                console.info(await binance.futuresMarketBuy(pair, sumDic[pair]));
            }
            break
        }
        if (parseFloat(position[activePosNum]['unRealizedProfit']) > 0.01) {
            if (side == 'SELL') {
                console.info(await binance.futuresMarketSell(pair, sumDic[pair]));
            } else {
                console.info(await binance.futuresMarketBuy(pair, sumDic[pair]));
            }
            break
        }
        console.log(position[activePosNum]['unRealizedProfit']);
        entryPrice = position[activePosNum]['entryPrice'];

    }
}

module.exports = {run}