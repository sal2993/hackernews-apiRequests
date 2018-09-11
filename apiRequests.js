'use strict';
const hn = require('hackernews-api');
const sleep = require('util').promisify(setTimeout);

/*
 * Title: apiRequests
 * Description: Every minute this module will send an api request
 *  to the hackernews api to get the latest top link.
 *
 */

/*
 * Methods of achieving goal:
 * - Make the script itself run every minute
 */

// Change something else
/*
* @param db     a valid mongoose db connection
* @param postId a hackernews post id
* @param cb     callback(err, doc)
* @return       boolean, whether or not the id is in the db
 */



var createApiReader = function (api, intervalTime) {

    intervalTime = typeof intervalTime !== 'undefined' ? intervalTime : 6000;

    var topPostsId = hn.getTopStories();
    var firstTopPost = hn.getItem(topPostsId[0]);

    api.process(firstTopPost, function (err, doc) {
        if (err) {
            console.log("Something went wrong with processing api data");
        }
        else {
            console.log("Process Successful")
            setInterval(createApiReader, intervalTime);
        }

    });


}

/*
var main = function (arg) {


    var topPostId = getHackerNewsApiRequest_TopPosts();
    logger.log('debug', 'spot 0')
    var firstTopPost = getHackerNewsApiRequest_TopPostInfo(topPostId[0]);


    logger.log('info', 'Current top post id: ' + firstTopPost.id +
        "\nCurrent top post title: " + firstTopPost.title );

    // Make sure that this post is the same top post
    if ( topPostId[0] === lastTopPost ) {
        logger.log('info',
            "The current top post received == the last known top post");
        update_Post_score(db, firstTopPost, function(err) {
            if (err) {
                logger.log('error', 'ERR, couldnt update score');
            }
            else {
                logger.log('info', 'Successfully updated score');
            }
        });
    }

    // There has been a 'top post' change
    else {
        // Enter the now-old top post's end time if not a new db
        logger.log('info', 'DETECTED top post change!');
        logger.log('info', 'Searching for old top post');


        add_to_Post_finalTimeAsTop(db, lastTopPost, function(err, post) {
            if (err) {
                logger.log('error',
                    'Unsuccessfully added final_time to last top post');
            }
            else {
                logger.log('info', 'UPDATED: Successfully added' +
                    'Final_time to last top post');
            }
        });
        add_to_Post_durationAsTop(db, lastTopPost, function(err, post) {
            if (err) {
                logger.log('error', 'Could not update durationAsTop. Err: '+ err);
            }
            else {
                logger.log('info', 'Updated: durationAsTop');
            }
        });
        update_Post_score(db, firstTopPost, function(err) {
            if (err) {
                logger.log('error', 'ERR, couldnt update score after finalTime updt');
            }
            else {
                logger.log('info', 'Successfully updated score after finalTime updt');
            }
        });

        is_Post_in_hndb(db, topPostId[0], function(err, post) {
            // Not in db
            if (err) {
                logger.log('error', 'Problem searching db for post');
            }
            if (post) { // Did find post in db already
                add_to_Post_initTimeAsTop(db, topPostId[0], function(err) {
                    if (err) {
                        logger.log('error', err + "Found Same post but" +
                            "Could not update initTime to db");
                    }
                    else {
                        logger.log('info', "Found Same post and" +
                            "updated initTime to db");

                    }
                });
            }
            else {    // Didnt find post in db
                add_new_Post(db, firstTopPost, function(err) {
                    if (err) {
                        logger.log("error", "Could not add new TOP POST" +
                            "to db");
                    }
                    else {
                        logger.log("info", "Successfully added new TOP " +
                            "POST to db");
                    }
                });

            }
        });

        lastTopPost = topPostId[0];
    }
};
*/


module.exports.createApiReader = createApiReader;
