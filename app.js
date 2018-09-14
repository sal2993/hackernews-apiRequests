const Post = require('./Post');
const hn = require('hackernews-api');
var apiRequestLogic = require('./apiRequestLogic');
logger = require("./config/winston");

var lastTopPostHNID;
Post.find({}).sort('-date').limit(1).exec(function (err, doc) {
    console.log(doc);
    lastTopPostHNID = doc[0].hnid;
    console.log(lastTopPostHNID);
});
console.log("app Here");
var process = function (firstTopPost) {
    console.log("FTP2: "+firstTopPost.id, firstTopPost.title);
    
    if ( firstTopPost.hnid === lastTopPostHNID ) {
        apiRequestLogic.update_Post_score(firstTopPost, function(err) {
            if (err) {
                logger.log("info", "ERROR: "+err);
            }
        });
    }
    // There has been a 'top post' change
    else {
        apiRequestLogic.add_to_Post_finalTimeAsTop(lastTopPostHNID, function(err, post) {
            if (err) {
                logger.log('error',
                    'Unsuccessfully added final_time to last top post');
            }
        });
        /*
        apiRequestLogic.add_to_Post_durationAsTop(lastTopPostHNID, function(err) {
            if (err) { logger.log("error", "Could not add 'duration as top'");}
        });
        */
        apiRequestLogic.update_Post_score(lastTopPostHNID, function (err) {
            if (err) { logger.log("error", err); }
        });
        apiRequestLogic.is_Post_in_hndb(firstTopPost.hnid, function (err, doc) {
            if (err) { logger.log("error", "error3: "+err); }
            if (doc) {
                apiRequestLogic.add_to_Post_initTimeAsTop(firstTopPost.hnid,
                    function (err) {
                    if (err) {
                        logger.log("error", "Error: "+err);
                    }
                });
            }
            else {
                apiRequestLogic.add_new_Post( firstTopPost, function(err) {
                    if (err) logger.log("error", "Error inputing: "+err);
                });
            }
            
        });
        lastTopPostHNID = firstTopPost.hnid;
    }

};

module.exports.process = process;

