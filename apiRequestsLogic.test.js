var Post = require('./Post');
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/test";
const logger = require("./config/winston");
const apiRequest = require("./apiRequestLogic");


var post1 = {"initTimeAsTop": [ ], "finalTimeAsTop": [ ], "hnid": 17261869, "title" :
        "Justice Dept. Seizes Times Reporter’s Email/Phone",
    "url" : "https://mobile.nytimes.com/2018/06/07/us/politics/",
    "votes" : 189
};

var post2 = {
    "initTimeAsTop": [ ], "finalTimeAsTop": [ ], "hnid": 17262510,
    "title": "Home Depot stocked shelves with empty boxes in its early days",
    "url": "https://www.cnbc.com/2018/06/01/home-depot-co-founder-ken-langone-on-the-early-days-of-the-business.html",
    "votes": 77
};


beforeAll( done => {
    var mongodb_url = process.env.MONGODB_TEST ? process.env.MONGODB_TEST : url;
    mongoose.connect(mongodb_url, {keepAlive: 120, useNewUrlParser: true });
    mongoose.Promise = global.Promise;
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    logger.log("info", "Start tests");

    function callback(err) {
        done();
    }
    Post.create(post1, callback);

});

afterAll( done => {
    Post.deleteMany({}, function (err, doc) {
        if (err) {
            console.log("Error: "+err);
        }
        mongoose.connection.close();
        done();
    });

});


test('Check if a post exists that is IN DB', done => {
    function callback(err) {
    expect(err).toBe(null);
    done();
}
apiRequest.is_Post_in_hndb(post1.hnid, callback);
});

test('Insert a new post', done => {
    function callback(err) {
    expect(err).toBe(null);
    done();
}
apiRequest.add_new_Post(post1, callback);
});

test('Check if a post exists that is NOT in DB', done => {
    function callback(err, doc) {
    expect(err).not.toBe(null);
    done();
}
apiRequest.is_Post_in_hndb(post2.hnid, callback);
});

test('Add Initial_Time to a post.', done => {
    function callback(err, doc) {
    expect(err).toBe(null);
    expect(doc.initTimeAsTop).not.toBe([]);
    done();
}
apiRequest.add_to_Post_initTimeAsTop(post1.id, callback);
});


test('Add Final Time to a post.', done => {
    function callback(err, doc) {
    expect(err).toBe(null);
    expect(doc.finalTimeAsTop).not.toBe([]);
    done();
}
apiRequest.add_to_Post_finalTimeAsTop(post1.id, callback);
});

test('Update score to a post.', done => {
    function callback(err, doc) {
    expect(err).toBe(null);
    done();
}
apiRequest.update_Post_score(post1, callback);
});

test('Calculating running top_post time', done => {
    function callback(err) {
    expect(err).toBe(null);
    done();
}
apiRequest.add_to_Post_durationAsTop(post1.id, callback);
});

test('Delete a new post', done => {
    function callback(err) {
    expect(err).toBe(null);
    done();
}
apiRequest.delete_Post_by_id(post1.id, callback);
});



/**
test('clean up by deleting all in db', done => {
    function callback(err){
        expect(err).toBe(null);
        done();
    }
    var clean = function(db, callback) {
        db.once('open', function() {
            Post.deleteMany({}, function(err) {
                if (err) {
                    callback(err, null);
                }
                else {
                    callback(null, "something");
                }

            });
        });
    };
    clean(db, callback);
});
*/
