var express = require('express');
var bp = require("body-parser");
var db = require('./db.js');
var path = require('path');
var {updateDB} = require('./updateDB');
var _ = require('lodash');

//app setting
var app = express();
app.use(bp.json());
app.use(bp.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use('/node_modules', express.static(path.join(__dirname + '/node_modules')));

//변수 선언
const port = 8080;
let visitCnt = 0;

//서버 구동
app.listen(port, () => {
  console.log(`port:${port}, Server OK.`);
  updateDB(); //최초 1회 실행
  setInterval(() => { updateDB();}, 600000); //반복 실행
});

//Mapping
app.get('/', (req, res) => {
  console.log(`${req.ip} visited.`);
  res.sendFile(__dirname + "/public/main.html");
});

app.get('/main', (req, res) => {
  res.sendFile(__dirname + "/public/test.html");
});

app.get('/ping', (req, res) => {
  res.send('yeah');
});

app.get('/formTest', (req, res) => {
  let id = req.query.id;
  let pw = req.query.pw;
  res.send(`GET<br/>ID: ${id}<br/>PW: ${pw}`);
});

app.post('/formTest', (req, res) => {
  let id = req.body.id;
  let pw = req.body.pw;
  res.send(`POST<br/>ID: ${id}<br/>PW: ${pw}`);
});

app.get('/ajax', (req, res) => {
  res.sendFile(__dirname + "/public/ajax.html");
});

app.post('/ajax', (req, res) => {
  console.log(req.body);
  let email = req.body.email;
  let responseData = {
    "email" : email
  };
  res.json(responseData);
});

// 이미지 라우팅
app.get('/public/resources/*', (req, res) => {
  res.sendFile(__dirname + req.path);
})


//RESTAPI 요청
app.get('/api/tweet/count', (req, res) => {
  db.getTweetCount().then((count) => {
    res.json({"count" : count});
  })
});

app.get('/api/tweet', (req, res) => {
  let no = Number(req.query.no);
  if (!_.isNumber(no)) return;
  db.getTweet({ _id : {$gt: no - 10, $lte: no }})
  .then((docs) => {
    let rtnObj = {};
    rtnObj.data = docs.reverse();
    res.json(rtnObj);
  });
});