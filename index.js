require('dotenv').config()
console.log(process.env);

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);

var qTermsArr = [];
var globalGetTweetsCount = 20;
var globalLastWord = '';
const { getRandomDateString, randomHangulString, randomString, noSpaceNoSpecial } = require('./helper-functions.js');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    qTermsArr = [];

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function getTweets(qTerm) {
        var params = { q: qTerm + ' since:' + getRandomDateString(), count: globalGetTweetsCount };
        T.get('search/tweets', params, (err, data, response) => {
            if (err) {
                console.log('server: getTweets() got an error: ' + err.message);
                return;
            } else {
                if (data && data.statuses && data.statuses[0] && data.statuses[0].text) {
                    var tweets = [];
                    for (var i = 0; i < data.statuses.length; i++) {
                        tweets.push('🐔 ' + data.statuses[i].text);
                        if (i === data.statuses.length - 1) {
                            var split = data.statuses[i].text.split(' ');
                            globalLastWord = split[split.length - 1];
                        }
                    }
                    tweets = tweets.filter(onlyUnique);
                    console.log(`server: got tweets: ${tweets}, emitting 'got tweets'`);
                    socket.emit('got tweets', tweets, qTerm);
                } else {
                    console.log(`server: can't find tweets, emitting 'no result'`);
                    socket.emit('no result', qTerm);
                }
            }
        });
    }

    socket.on('got qTerm', (qTerm) => {
        qTermsArr.push(qTerm);
        console.log(`server: got a new qTerm: ${qTerm}`);
        for (var i = 0; i < qTermsArr.length; i++) {
            console.log(`qTermsArr[${i}]: ${qTermsArr[i]}`);
        }
    });
    socket.on('remove qTerm', (qTerm) => {
        qTermsArr = qTermsArr.filter(function (value) { return noSpaceNoSpecial(value) !== noSpaceNoSpecial(qTerm); })

        console.log(`removed ${qTerm}. now qTermsArr is :`);
        for (var i = 0; i < qTermsArr.length; i++) {
            console.log(`qTermsArr[${i}]: ${qTermsArr[i]}`);
        }
    });

    socket.on('got specific load request', (qTerm) => {
        console.log(`server: got specific load request, loading with specified qTerm ${qTerm}`);
        getTweets(qTerm);
    });
    socket.on('got load request', () => {
        if (qTermsArr.length > 0) {
            var qTerm = qTermsArr[Math.floor(Math.random() * qTermsArr.length)];
            console.log(`got load request, loading with qTerm ${qTerm}`);
            getTweets(qTerm);
        }
        else {
            console.log('qTermsArr is empty');
            socket.emit('qTermsArr empty');
        }
    });
    socket.on('got random load request', () => {
        var qTerm = randomString(1 + Math.floor(Math.random() * 2));
        console.log(`got random load request, loading with qTerm ${qTerm}`);
        getTweets(qTerm);
    });
    socket.on('got random hangul load request', () => {
        var qTerm = randomHangulString() || 'ㅋ';
        console.log(`got random load request, loading with qTerm ${qTerm}`);
        getTweets(qTerm);
    });
    socket.on('wordchain', () => {
        if (globalLastWord && globalLastWord !== '') {
            console.log(`got wordchain request, loading with globalLastWord ${globalLastWord}`);
            getTweets(globalLastWord);
        }
        else {
            console.log(`globalLastWord not ready: ${globalLastWord}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('someone disconnected');
    });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`listeing on *:${port}`);
});
