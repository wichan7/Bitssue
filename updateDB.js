let twitterAPI = require('./twitterAPI');
let db = require('./db');
let moment = require('moment');
let _ = require('lodash');

async function updateDB() {
    console.log('[UPDATE]tweet update START');

    let users = await db.getUser({});
    let tweets = new Array();
    
    for (let user of users){
        let tweet = await twitterAPI.getRecentTweetFromUID(user.uid);
        let dbTweet = await db.getTweet( {tid: tweet.data.id} );
        if (_.isEmpty(dbTweet)){ //DB에 같은 ID의 트윗이 없으면
           tweets.push({
            who: user.name,
            tid: tweet.data.id,
            date: moment(tweet.data.created_at).format('YYYY-MM-DD HH:MM'),
            text: tweet.data.text });
        }
    }

    if (!_.isEmpty(tweets)){
        tweets.sort( (a, b) => {
            if (a.date > b.date) return 1;
            else return -1;
        }); //날짜 오름차순 정렬

        let count = await db.getTweetCount();
        for (let newTweet of tweets){
            count++;
            newTweet._id = count;
            db.insertTweet(newTweet);
            console.log(`[LOG]${newTweet.who}'s tweet has saved`);
        }

    }

    console.log('[UPDATE]tweet update END');
}

exports.updateDB = updateDB;