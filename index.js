const sendmail = require('sendmail')();
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(logger('dev'));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ extended: false, limit:'50mb'}));
app.use(cookieParser());

app.get('/',function (req, res, next) {
    res.send('text')
});
app.post('/feedback', function(req, res, next) {
    sendEmail(req.body);
    console.log(JSON.stringify(req.body));
});

app.post('/order', function(req, res, next) {
    sendEmail(req.body);
    console.log(JSON.stringify(req.body));
});
server.listen(process.env.PORT || 3000,'0.0.0.0', () => console.log('Example app listening on port 3000!'));

const sendEmail = (content)=> {
    sendmail({
        from: content.from||"no-reply@dygy.com",
        to: content.to||'YukimuraAllen@yandex.ru', // list of receivers
        subject: content.title||"Новое сообщение",
        html: `<h1> Details </h1> <p>${parseJSON(content)}</p> `,
        //attachments:parseFiles(content)

    }, function (err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
};
function parseFiles(content) {
    const arr = []
    if(content.file) {
        arr.push({
            filename: content.fileName,
            content: content.file
        })
    }
    return arr;
}
function parseJSON(content) {
    let mail = '';
    for (let key in content) {
        if (key==="file") {
            mail += `<br> <img style="transform: scale(0,5)" src="${content.file}"> <br> `
        }
        else if (content.hasOwnProperty(key)){
            mail+= `<br> <span>${key}: ${content.key}</span>`
        }
    }
    return mail
}