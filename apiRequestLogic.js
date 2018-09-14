var Post = require("./Post");
var is_Post_in_hndb = function (postID, callback) {
    //logger.log('info', 'MAIN: db is open: is_Post_in_hndb');
    Post.find({hnid: postID}, function (err, posts) {
        if (err) {
            callback(err, null);
        }
        if (posts.length) {
            callback(null, posts);
        }
        // Didnt find post in db
        else {
            callback(null, null);
        }
    });
};

var add_new_Post = function(top_post, callback) {
    //logger.log('info', 'MAIN: db is open: add_new_Post');
    var myData = new Post({
        hnid: top_post.id, title: top_post.title,
        url: top_post.url, votes: top_post.score
    });
    myData.initTimeAsTop.push(new Date());
    myData.save(function (err) {
        if (err) {
            callback(err);
        }
        callback(null);
    });
};

var delete_Post_by_id = function(id, callback) {
    Post.deleteOne({hnid: id}, function(err) {
        if (err) {
            callback(err);
        }
        callback(err);
    });
};

var add_to_Post_initTimeAsTop = function(post_id, callback){
    Post.findOneAndUpdate({hnid: post_id},
        {$push: {initTimeAsTop: new Date()}}, function(err, doc) {
            if (err) {
                return callback(err, null);
            }
            // Able to add to initTime
            else {
                return callback(null, doc);
            }
    });
};

var add_to_Post_finalTimeAsTop = function(post_id, callback) {
    Post.findOneAndUpdate({hnid: post_id},
    {$push: {finalTimeAsTop: new Date()}}, function (err, doc) {
        if (err) {
            return callback(err, null);
        }
        // Found one or more posts
        else {
            return callback(null, doc);
        }
    });
};


var update_Post_score = function(top_post, callback){
    Post.findOneAndUpdate({hnid: top_post.id}, {votes: top_post.score},
        function(err, doc) {
            if (err) {
                return callback(err, null);
            }
            else {
                return callback(null, doc);
            }
        }
    );
};

var add_to_Post_durationAsTop = function (post_id, callback) {
    Post.findOne({hnid: post_id}, function(err, post) {
        if (err) {
            return callback(err, null);
        }
        else{
            var duration = 0;
            for (var i = 0; i < post.finalTimeAsTop.length; i++){
                duration = duration + (post.finalTimeAsTop[i] - post.initTimeAsTop[i]);
            }

            Post.findOneAndUpdate({hnid: post_id}, {$set: {durationAsTop: duration}},
                function(err, doc) {
                    if (err) {
                        return callback(err, null);
                    }
                    else {
                        return callback(null, doc);
                    }

                }
            );
        }
    });
};

module.exports.is_Post_in_hndb = is_Post_in_hndb;
module.exports.add_new_Post = add_new_Post;
module.exports.delete_Post_by_id = delete_Post_by_id;
module.exports.add_to_Post_finalTimeAsTop = add_to_Post_finalTimeAsTop;
module.exports.add_to_Post_initTimeAsTop = add_to_Post_initTimeAsTop;
module.exports.update_Post_score = update_Post_score;
module.exports.add_to_Post_durationAsTop = add_to_Post_durationAsTop ;