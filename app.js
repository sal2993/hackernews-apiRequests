const Post = require('./Post');
var apiRequestLogic = require('./apiRequestLogic');
logger = require("./config/winston");

var lastTopPostHNID;
Post.find({}).sort({"_id": -1}).limit(1).exec(function (err, doc) {
    console.log(doc);
    lastTopPostHNID = doc[0].hnid;
    console.log(lastTopPostHNID);
});
console.log("app Here");

var process = function (firstTopPost) {
    console.log("FTP2: "+firstTopPost.id, firstTopPost.title);

    console.log("firstTopPost.hnid: "+ firstTopPost.id);
    console.log("vs: lastTopPostHNID: "+lastTopPostHNID);
    if ( firstTopPost.id === lastTopPostHNID ) {
        console.log("Current Top Post is equal to LastTopPost");
        apiRequestLogic.update_Post_score(firstTopPost, function(err) {
            if (err) {
                logger.log("info", "ERROR: "+err);
            }
        });
    }
    // There has been a 'top post' change
    else {
        console.log("The top post has changed!");
        apiRequestLogic.is_Post_in_hndb(lastTopPostHNID, function(err, doc) {

        })
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
        apiRequestLogic.is_Post_in_hndb(firstTopPost.id, function (err, doc) {
            if (err) { logger.log("error", "error3: "+err); }
            if (doc) {
                apiRequestLogic.add_to_Post_initTimeAsTop(firstTopPost.id,
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
        lastTopPostHNID = firstTopPost.id;
    }

};

module.exports.process = process;

