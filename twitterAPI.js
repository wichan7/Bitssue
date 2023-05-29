var request = require('request-promise');

//보안토큰 정의, 추후 env에서 가져오기.
let bearerToken = "";


//userId를 받아 timeline을 리턴합니다.
async function getTimelineFromUID(userId) {
    const option = {
        uri: `https://api.twitter.com/2/users/${userId}/tweets`,
        qs: {
            max_results: 5
        },
        headers: {
            "User-Agent": "v2UserTweetsJS",
            "authorization": `Bearer ${bearerToken}`
        }
    };

    let timeline = await request(option);
    timeline = JSON.parse(timeline);

    return timeline;
}


//tweetId를 받아 DetailedTweet을 리턴합니다.
async function getTweetFromTID(tweetId) {
    const option = {
        uri: `https://api.twitter.com/2/tweets/${tweetId}`,
        qs: {
            "tweet.fields" : "attachments,author_id,created_at,entities," +
                            "geo,id,in_reply_to_user_id,lang,possibly_sensitive," + 
                            "referenced_tweets,source,text,withheld"
        },
        headers: {
            "User-Agent": "v2TweetLookupJS",
            "authorization": `Bearer ${bearerToken}`
        }
    };

    let tweet = await request(option);
    tweet = JSON.parse(tweet);

    return tweet;
}

//userId를 받아 recentTweet을 리턴합니다.
async function getRecentTweetByUID(userId) {
    let timeline = await getTimelineFromUID(userId);
    let recentTweet = await getTweetFromTID(timeline.data[0].id);

    return recentTweet;
}

exports.getTweetFromTID = getTweetFromTID;
exports.getTimelineFromUID = getTimelineFromUID;
exports.getRecentTweetFromUID = getRecentTweetByUID;