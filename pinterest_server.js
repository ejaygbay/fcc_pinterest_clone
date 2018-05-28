var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(__dirname + '/static'));

// database creation
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: 'e07757157711994'
});
con.connect(function(err) {
    if (err) throw err;
    else {
        con.query("CREATE DATABASE IF NOT EXISTS fcc_pinterest_clone", function(err) {
            if (err) throw err;
            console.log("DB created");
            createTables();
        });
    }
});

// tables creation
function createTables() {
    var connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: 'e07757157711994',
        database: "fcc_pinterest_clone"
    });
    connection.connect(function(err) {
        if (err) {
            throw err;
        } else {
            connection.query("CREATE TABLE IF NOT EXISTS authenticated_user(\
            fName varchar(20) NOT NULL, \
            mName varchar(20) NULL, \
            lName varchar(20) NOT NULL, \
            uName varchar(20) NOT NULL, \
            password varchar(20) NOT NULL, \
            user_ID int(5) zerofill primary key NOT NULL auto_increment)",
                function(err) {
                    if (err) throw err;
                    console.log("User Table created");
                });
            connection.query("CREATE TABLE IF NOT EXISTS all_pictures(\
            img_id int(10) primary key NOT NULL auto_increment, \
            image BLOB NOT NULL, \
            description varchar(250) NOT NULL, \
            date_and_time_created DATETIME, \
            image_owner_ID int(5) zerofill NOT NULL)",
                function(err) {
                    if (err) throw err;
                    console.log("Picture Table created");
                });
        }
    });
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get("/", function(req, res) {
        res.sendFile(__dirname + "/static/views/index.html");
    });
    app.get("/views/index.html", function(req, res) {
        res.sendFile(__dirname + "/views/index.html");
    });
    app.get("/views/signIn.html", function(req, res) {
        res.sendFile(__dirname + "/views/signIn.html");
    });
    app.get("/views/create.html", function(req, res) {
        res.sendFile(__dirname + "/views/create.html");
    });
    app.get("/views/myAccount.html", function(req, res) {
        res.sendFile(__dirname + "/views/myAccount.html");
    });
    app.get("/views/index_signin.html", function(req, res) {
        res.sendFile(__dirname + "/views/index_signin.html");
    });
    app.get("/views/allBooks.html", function(req, res) {
        res.sendFile(__dirname + "/views/allBooks.html");
    });
    app.get("/views/myBooks.html", function(req, res) {
        res.sendFile(__dirname + "/views/myBooks.html");
    });
    app.get("/views/err.html", function(req, res) {
        res.sendFile(__dirname + "/views/err.html");
    });

    // app.get("/twit", function(req, res) {
    //     var user_info = { "fName": "John", "mName": "P", "lName": "Flomo" };
    //     connection.query("INSERT INTO authenticated_user set ?", [user_info], function(err, result) {
    //         if (err) {
    //             throw err;
    //         } else {
    //             console.log("inseted");
    //             // res.sendFile(__dirname + "/static/views/newPoll.html");
    //         }
    //     });

    // });
    var last_inserted_id = 00001;
    // var clicked_poll, option_poll_clicked, option_names, option_votes, poll_option_data; // variable to store the "id" of the item that was clicked in the front-end
    // // "post method" to receive "poll_title" that was clicked on the front-end
    // app.post("/views/table_for_polls", function(req, res) {
    //     clicked_poll = req.body.id;
    // });
    // "post method" to receive "poll_option" that was clicked on the front-end
    // app.post("/views/table_for_options", function(req, res) {
    //     option_poll_clicked = req.body.id;
    //     console.log("option id : " + option_poll_clicked);
    //     console.log(req.body);

    //     // connection.query("SELECT votes FROM all_options where option_id = ?", option_poll_clicked, function(err, result) {
    //     //     if (err) throw err;
    //     //     else {
    //     //         var count = result[0].votes;
    //     //         var sum = count + 1;
    //     //         // console.log(count + " " + sum);
    //     //         connection.query("UPDATE all_options SET votes = ? where option_id = ?", [sum, option_poll_clicked], function(err, result) {
    //     //             if (err) throw err;
    //     //             else {
    //     //                 console.log("Vote Updated");
    //     //             }
    //     //         });
    //     //     }
    //     // });

    // });

    // // update votes in the polls_option table
    // app.get("/update_vote", function() {
    //     connection.query("UPDATE all_options SET votes = ? where poll_ID = ?", option_poll_clicked, function(err, result) {
    //         if (err) throw err;
    //         else {
    //             res.send(result);
    //         }
    //     });
    // })



    // uploading poll data to database
    app.post('/views/formData', function(req, res) {
        // select the user id from the "authenticated_user" table and
        // insert it into the all_polls table in the column "poll_owner_id"
        connection.query("SELECT user_ID FROM authenticated_user where user_ID = ?", last_inserted_id, function(err, result) {
            if (err) throw err;
            else {
                var arr = [
                    [req.body.poll_title, req.body.discription, new Date(), result[0].user_ID]
                ];
                // In the "all_polls" table, insert the data into the column in the parentensis
                connection.query("INSERT INTO all_polls (poll_title, discription, date_and_time_created, poll_owner_ID) values ?", [arr], function(err, result) {
                    if (err) {
                        throw err;
                    } else {
                        // select the last inserted poll(id) from the "all_polls" table
                        connection.query("select poll_id from all_polls where poll_id in (last_insert_id())", function(err, result) {
                            if (err) throw err;
                            else {

                                var cur_id = result[0].poll_id;
                                // get the form data from the user
                                var str = req.body.options;
                                // convert "str" to array
                                var arr = str.split(",");
                                var i;

                                // loop through the array and insert each item into a separate row in the "all_option" table
                                for (i = 0; i < arr.length; i++) {
                                    var values = [
                                        [arr[i], cur_id]
                                    ];
                                    // in the "all_options" table, insert the data into the "poll_options" column
                                    // insert the last inserted poll id into the "options" table to all the options for that poll
                                    connection.query("INSERT INTO all_options (poll_options, poll_ID) VALUES ?", [values], function(err, result) {
                                        if (err) throw err;
                                        else
                                            console.log("Data Inserted");
                                    });
                                }
                            }
                        });
                        res.sendFile(__dirname + "/static/views/allBooks.html");
                    }
                });
            }
        })
    });


    // create new user account
    app.post("/views/createAcc", function(req, res) {
        connection.query("INSERT INTO authenticated_user set ?", req.body, function(err, result) {
            if (err) throw err;
            else {
                connection.query("select user_ID from authenticated_user where user_ID in (last_insert_id())", function(err, result) {
                    if (err) throw err;
                    else {
                        console.log(req.body);
                        last_inserted_id = result[0].user_ID;
                        console.log(last_inserted_id);
                        res.sendFile(__dirname + "/static/views/signIn.html");
                    }
                });
            }
        });
    });
    // signin with user account info
    app.post("/views/myAccount", function(req, res) {
        var userName = [req.body];
        connection.query("SELECT user_ID, password FROM authenticated_user WHERE uName = ?", userName[0].uName, function(err, result) {
            if (err) {
                res.send("Sorry!! Incorrect Username");
            } else {
                if (userName[0].password == result[0].password) {
                    last_inserted_id = result[0].user_ID;
                    console.log(last_inserted_id);
                    res.sendFile(__dirname + "/static/views/index_signin.html");
                } else
                    res.send("Incorrect Password!!!");

            }
        });
    });
    // "post method" to receive "uploaded image" from the front-end
    app.post("/views/upload_image", function(req, res) {
        var img = req.body.imgURL;
        console.log(req.body);
        var img_data = [
            [img, new Date(), last_inserted_id]
        ];
        console.log(img_data);
        connection.query("INSERT INTO all_pictures(image, date_and_time_created, image_owner_ID) value ?", [img_data], function(err, result) {
            if (err) throw err;
            else {
                console.log("image inserted");
                res.sendFile(__dirname + "/static/views/index_signin.html");
            }
        });
    });

    // get list of all images from the database
    app.get("/list_of_pictures", function(req, res) {
        connection.query("SELECT * FROM all_pictures", function(err, result) {
            if (err) throw err;
            else {
                res.send(result);
            }
        });
    });

    // select all the poll_titles from the "all_polls" table and display it on the website
    app.get("/list_of_polls", function(req, res) {
        connection.query("SELECT poll_title, poll_id FROM all_polls ORDER BY date_and_time_created DESC", function(err, result) {
            if (err) throw err;
            else
                res.send(result);
        });
    });

} // function close. Every route should be in this function

app.listen(8000, function() {
    console.log("Node is listening on PORT 8000");
})