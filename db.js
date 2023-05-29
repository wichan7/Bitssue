let mongoose = require('mongoose');
let _ = require('lodash');
let moment = require('moment');

// DB 연결
mongoose.connect('mongodb://localhost:27017/bitssue', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log("mongoDB connection OK.");
});

// 스키마 선언
let userSchema = mongoose.Schema({
	name: String,
	uid: String
}, { versionKey: false } );

let tweetSchema = mongoose.Schema({
	_id: Number,
	who: String,
	tid: String,
	date: String,
	text: String
}, { versionKey: false } );

// 모델 선언
let userModel = mongoose.model("users", userSchema);
let tweetModel = mongoose.model("tweets", tweetSchema);

// --- Functions ---
// tweet 컬렉션에 트윗을 하나 삽입합니다.
function insertTweet(tweet) {	
	let tweetInstance = new tweetModel({
		_id: tweet._id,
		who: tweet.who,
		tid: tweet.tid,
		date: tweet.date,
		text: tweet.text
	});
	tweetInstance.save((err, tweetInstance) => {
		if(err) return console.error(err);
	});
}

function insertTweets(tweets) {
	tweetModel.insertMany(tweets);
}

// user 컬렉션의 user 데이터를 얻습니다.
async function getUser(query){
	let users = await userModel.find(query, (err) => {
		if (err) { 
			console.log(`[ERROR]db.js: ${err}`);
		}
	});
	return users;
}

// tweet 컬렉션의 tweet 데이터를 얻습니다.
async function getTweet(query){
	let tweets = await tweetModel.find(query, (err) => {
		if (err) {
			console.log(`[ERROR]db.js: ${err}`);
		}
	});
	if (!_.isArray(tweets)){ // 무조건 배열로 리턴해줍니다.
		let t = tweets;
		tweets = new Array();
		tweets[0] = t;
	}
	return tweets;
}

// tweet 컬렉션의 트윗 개수를 얻습니다.
async function getTweetCount(){
	let count = await tweetModel.find({}).countDocuments();
	return count;
}

// 트윗을 지웁니다.
function deleteTweet(query){
	tweetModel.deleteMany(query, (err) => {
		if (err) {
			console.log(`[ERROR]db.js: ${err}`);
		}
	});
}

// export
exports.insertTweet = insertTweet;
exports.insertTweets = insertTweets;
exports.getUser = getUser;
exports.getTweet = getTweet;
exports.getTweetCount = getTweetCount;
exports.deleteTweet = deleteTweet;