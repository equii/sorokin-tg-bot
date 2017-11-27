const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const _ = require('underscore');

// replace the value below with the Telegram token you receive from @BotFather
const token = '';


const options = {
  webHook: {
    // Port to which you should bind is assigned to $PORT variable
    // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
    port: process.env.PORT
    // you do NOT need to set up certificates since Heroku provides
    // the SSL certs already (https://<app-name>.herokuapp.com)
    // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
  }
};

const url = process.env.APP_URL || '';
const bot = new TelegramBot(token, options);

bot.setWebHook(`${url}/bot${token}`);

var text = fs.readFileSync(__dirname + '/text.jsonl', "utf8");

var result = text.split(/\n/).map(x => {
    try {
        var res = JSON.parse(x);

        if(res.from && res.from.print_name === 'Jenya_Kigai') {
            res.from.username = 'kigai';
        }

        if(res.from && res.from.print_name === 'Taleyran') {
            res.from.username = 'taleyran';
        }

        if(res.from && res.from.print_name === 'Iurii_Vasylenko') {
            res.from.username = 'rascko';
        }

        if(res.from && res.from.print_name === 'Kateryna_Igolkina') {
            res.from.username = 'katia';
        }
        
        return res;
    }
    catch(e) {
       console.log(e);
       console.log(x);
    }
}).filter(x => !!x);

function _getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function _getRandomQuote(username) {
    var filtered = result.filter(x => x.text);

    if(username) {
        filtered = result.filter(x => x.from.username === username);
    }
    
    var rand = _getRandomArbitrary(0, filtered.length);

    var quote = filtered[rand];

    if(quote) {
        return quote.from.username +  ": " + quote.text;
    }

    return 'покажи котлы, гад дядя';
}

bot.onCommand = function(regexCommand, handler) {
    bot.onText(regexCommand, (msg, match) => {
        const chatId = msg.chat.id;
        
        var response = handler(match);

        bot.sendMessage(chatId, response);
    });
}

var list = [
    'Хуесор чтобы срать на нас а я значит торф и гадить чтобы так паши а просветить.',
    'Я тебя ебал гад гадить говна.',
    'Я тега ега мого тага мого тада.',
    'Я на вас всю общественность подниму чтобы просветили вас гадов гадских!',
    'Нет я ебал вас гадов я вас срал на вас говна не можете так чтобы мы работали только.',
    'Я тебя ебал гад такой чтобы говно. Я тебя ебал гад не думаешь. Я тебя ебал гад сраный. Я тебя ебал гад сраный. Я тебя ебал ты не думаешь. Я тебя ебал говно гадский и заберут.',
    'Я тег егало срады могол.',
    'Вы вон срете бляди гадские а мы тут с Машей два инвалида на вас работаем на блядей а вы только срёте да жрёте а мы горбатимся да ползаем тут как что.',
    'Я вас выведу бляди гадские!',
    'Вы на нас совсем как не людей смотреть хотите а я не собака вам чтоб на меня срать я ещё может почище вашего на вас напишу и всё общественность на вас подниму.',
    'Ёбаные гады срали только а мы пахай.',
    'Ты не професор а ты нас срал а мы скажем что хуесор ёбаный срал и мы напишем.',
    'Вы не учёный а обдрисный мудак. Вот вы какой учёный.',
    'А вы не учёный вы хуёный вот вы кто.',
    'А что вам посрали поели и всё а мы убирай подметай да сей опять чтоб вы срали и жрали.',
    'Мы вас поучим ещё как жить то а не то.',
    'А вы вон всё анекдотики хуётики а надо не анекдотики расказывать а дело делать дорогой товарищ!',
    'Я тега могод нога ега модо.',
    'Я тебя ебал говна срать и всё.',
    'Мы не хуесор а ты гадский и я ебал гадский говно.',
    'Так что я так издеваться над собой не позволю я срать не позволю на себя как никак а я тоже почище вашего жизнь знаю.',
    'А вы всё чайком да майком. Хуйком им а не чайком надо.',
    'Вы адо гнидо, миленькие, покажи котлы, гад дядя.',
    'С НОВЫМ ГОДОМ, ДОРОГИЕ ЕБАНЫЕ ГАДЫ!',
    'Вы нас не можете просветить а мы гадили на нас а мы работать не могол нас посрать а мы не бляди и торф не сраный гад.'
];

bot.onCommand(/\/gado/, () => {
    var random = _getRandomArbitrary(0, list.length);
    var response = list[random];
    return response;
});

bot.onCommand(/\/stat/, () => {
    var groups = _.groupBy(result, x => x.from.username);
    
    var stats = [];
    for (var property in groups) {
        stats.push({from: property, count: groups[property].length});  
    }

    var response = _.sortBy(stats, x => x.count)
    .reverse()
    .map(x => x.from + ": " + x.count)
    .join('\n');

    return response;
});

bot.onCommand(/\/randomquote (.+)/, (match) => {
    const resp = match[1];
  
    console.log('randomquote with params: ' + resp);
  
    return _getRandomQuote(resp);
});

bot.onCommand(/^\/randomquote$/, () => {
    console.log('randomquote without params');

    return _getRandomQuote();
});

bot.onCommand(/¿(.*)\?/, () => {
    console.log('randomquote without params question format');
  
    return _getRandomQuote();
});

bot.onText(/\/mogado/, (msg, match) => {
    var keyboard = [
        [list[_getRandomArbitrary(0, list.length)], list[_getRandomArbitrary(0, list.length)]],
        list[_getRandomArbitrary(0, list.length)],
        list[_getRandomArbitrary(0, list.length)]
    ];

    bot.sendMessage(msg.chat.id, "гад сраный", {
        "reply_markup": {
            "one_time_keyboard": true,
            "keyboard": keyboard
            }
        });
});