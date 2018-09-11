var is_Post_in_hndb = function (db, postId, callback) {
    logger.log('info', 'MAIN: db is open: is_Post_in_hndb');
    Post.find({hnid: postId}, function (err, posts) {
        if (err) {
            callback(err, null);
        }
        if (posts.length) {
            callback(null, posts);
        }
        // Didnt find post in db
        else {
            callback(new Error('Didnt Find post in db'), null);
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
}

var delete_Post_by_id = function(db, id, callback) {
    db.once('open', function(){
        logger.log('info', 'MAIN: db is open: delete_Post_by_id');
        Post.deleteOne({hnid: id}, function(err) {
            if (err) {
                callback(err);
            }
            callback(err);
        });
    });
}

var add_to_Post_finalTimeAsTop = function(db, post_id, callback) {
    db.once('open', function(){
        logger.log('info', 'MAIN: db is open: add_to_Post_finalTimeAsTop' );
        Post.findOneAndUpdate({hnid: post_id},
            {$push: {finalTimeAsTop: new Date()}}, function (err, doc) {
                if (err) {
                    logger.log('error', "Could not update finalTime. Err:"+err);
                    return callback(err, null);
                }
                // Found one or more posts
                else {
                    logger.log('info', 'Found Post with same id, updating final Time');
                    logger.log('info', 'post found id: '+ doc.hnid);
                    return callback(null, doc);
                }
            });
    });
};

var add_to_Post_initTimeAsTop = function(db, post_id, callback){
    db.once('open', function(){
        logger.log('info', 'MAIN: db is open: add_to_Post_initTimeAsTop');
        Post.findOneAndUpdate({hnid: post_id},
            {$push: {initTimeAsTop: new Date()}}, function(err, doc) {
                if (err) {
                    logger.log('error', "Could not update the initTimeAsTop");
                    return callback(err, null);
                }
                // Able to add to initTime
                else {
                    logger.log('info', '  Found Post with same id, ' +
                        'updating final Time');
                    logger.log('info', '  post found id: '+ doc.hnid);
                    return callback(null, doc);
                }
            });
    });
};

var update_Post_score = function(db, top_post, callback){

    db.once('open', function(){
        logger.log('info', 'MAIN: db is open: update_Post_score');
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
    });
};

var add_to_Post_durationAsTop = function (db, post_id, callback) {
    db.once('open', function(){
        logger.log('info', 'MAIN: db is open: add_to_Post_durationAsTop' );
        Post.findOne({hnid: post_id}, function(err, post) {
            if (err) {
                logger.log('error', "Could not find post [duration]. Err:" + err);
                return callback(err, null);
            }
            else{
                logger.log('info', 'found post.. Post id: '+post.hnid);
                var duration = 0;
                for (var i = 0; i < post.finalTimeAsTop.length; i++){
                    duration = duration + (post.finalTimeAsTop[i] - post.initTimeAsTop[i]);
                }

                Post.findOneAndUpdate({hnid: post_id}, {$set: {durationAsTop: duration}},
                    function(err, doc) {
                        if (err) {
                            logger.log('error', 'Could not update Duration. Err:'+err);
                            return callback(err, null);
                        }
                        else {
                            logger.log('info', 'Found Post and was able to insert dur');
                            return callback(null, doc);
                        }

                    }
                );
                logger.log('info', 'Found Post with same id, updating duration');
                logger.log('info', " Duration Calculated: "+ duration);

            }
        });
    });
}

function getHackerNewsApiRequest_TopPosts(){
    var topPostId = hn.getTopStories();
    return topPostId;
}

function getHackerNewsApiRequest_TopPostInfo(topPostId){
    var firstTopPost = hn.getItem(topPostId);
    return firstTopPost;
}