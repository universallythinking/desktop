/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var Repeat = require('repeat');
ii = 2;
if (ii === 1) {
    var client_id = '71d18cb9b32c480d951eed41512df8fc'; // Your client id
    var client_secret = '2e89cb3f772345279ae54fa417cc7457'; // Your secret
    var redirect_uri = 'http://app2.jkbx.us/callback/'; // Your redirect uri
}
else if (ii === 2) {
    var client_id = "23fda62574464d50be2ecfd8540353b5"; // Your client id
    var client_secret = "44c1395c8390426d8b6b3f938f29af58";
    var redirect_uri = 'http://spartify.herokuapp2.com/callback/'; // Your redirect uri
}
else if (ii === 3) {
    var client_id = '71d18cb9b32c480d951eed41512df8fc'; // Your client id
    var client_secret = '2e89cb3f772345279ae54fa417cc7457'; // Your secret
    var redirect_uri = '/callback/'; // Your redirect uri
}

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
var nodeSpotifyWebHelper = require('node-spotify-webhelper');
var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();

// get the name of the song which is currently playing

var stateKey = 'spotify_auth_state';

var app2 = express();

app2.use(express.static(__dirname + '/public'))
    .use(cookieParser());

app2.get('/login', function (req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your app2lication requests authorization
    var scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app2.get('/choose-a-playlist', function (req, res) {
    res.redirect('/playlists.html');
});
app2.get('/details', function (req, res) {
    res.redirect('/welcome.html');
});
app2.get('/error', function (req, res) {
    res.redirect('/error.html');
});
app2.get('/songUpdate', function (req, res) {
    var song = req.query.track;
    var artist = req.query.artist;
    var user = req.query.user;
    // updateSong(song.toString(), artist.toString(), user.toString());
});
app2.get('/callback', function (req, res) {

    // your app2lication requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;
                // console.log(body);
                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('jukebox://callback/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

app2.get('/refresh_token', function (req, res) {

    //requesting access token from refresh token
    // var refresh_token = req.body.refresh_token;
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
        else {
            res.send("Failed to update token");
        }
    });
});
app2.get('/SorryCharlie', function (req, res) {
    res.redirect('http://jkbx.us/');
});
app2.get('/error', function (req, res) {
    res.redirect('/error.html');
});
var databaseURL = 'postgres://yotnkoupklgnce:PEI_Vz3Jnz8qebuxiSafxNHcrj@ec2-54-235-95-188.compute-1.amazonaws.com:5432/d6480t5vkn701i';
var pg = require('pg');
pg.defaults.ssl = true;

var bodyParser = require('body-parser');

app2.use(bodyParser.json());

app2.use(bodyParser.urlencoded({
    extended: false
}));

app2.post('/votes', function (request, response) {
    try {
        pg.connect(process.env.DATABASE_URL || databaseURL, function (err, client) {
            if (err) { throw err; response.send("Error"); if (client){client.end();} }
            else {
                try {
                    if (request.body.userName) {
                        try {
                            client
                                .query("select songname from songvotes where userid in ($1)", [request.body.userName])
                                .on('end', function (finalres) {
                                    if (err) { throw err; response.send("Error"); if (client){client.end();} }
                                    else if (finalres.rows.length > 0) {
                                        res1 = {};
                                        res1["songs"] = JSON.stringify(finalres.rows[0].songname);
                                        response.send(res1);
                                        if (client){client.end();}
                                    }
                                    else {
                                        if (client){client.end();}
                                    }
                                });
                        }
                        catch (exception) {
                            console.log(exception);
                        }
                    }
                }
                catch (exception) {
                    console.log(exception);
                }
            }
        });
    }
    catch (exception) {
        console.log(exception);
    }
    finally {
        if (client){client.end();} pg.end();
    }
});

app2.post('/checkPassword', function (request, response) {
    try {
        pg.connect(process.env.DATABASE_URL || databaseURL, function (err, client) {
            if (err) { throw err; response.send("Error"); if (client){client.end();} }
            else {
                try {
                    if (request.body.password) {
                        try {
                            client
                                .query("select distinct lastfm from users where lastfm in ($1)", [request.body.password])
                                .on('end', function (finalres) {
                                    if (err) { throw err; response.send("Error"); if (client){client.end();} }
                                    else if (finalres.rows.length <= 0) {
                                        res1 = {};
                                        res1["success"] = JSON.stringify("SUCCESS");
                                        response.send(res1);
                                        if (client){client.end();}
                                    }
                                    else if (finalres.rows.length > 0) {
                                        res1 = {};
                                        res1["failure"] = JSON.stringify("FAIL");
                                        response.send(res1);
                                        if (client){client.end();}
                                    }
                                    else {
                                        if (client){client.end();}
                                    }
                                });
                        }
                        catch (exception) {
                            console.log(exception);
                        }
                    }
                }
                catch (exception) {
                    console.log(exception);
                }
            }
        });
    }
    catch (exception) {
        console.log(exception);
    }
    finally {
        if (client){client.end();} pg.end();
    }
});

app2.post('/songUpdater', function (request, response) {
    try {
        pg.connect(process.env.DATABASE_URL || databaseURL, function (err, client) {
            if (err) { response.send("Error"); if (client){client.end();} throw err; }
            else {
                try {
                    if (request.body.songTitle) {
                        try {
                            client
                                .query("update songupdate set artist = $1 where userid in ($2)", [request.body.artist, request.body.userName]);
                            client
                                .query("update songupdate set songname = $1 where userid in ($2)", [request.body.songTitle, request.body.userName])
                                .on('end', function (finalres) {
                                    if (err) { if (client){client.end();} throw err; }
                                    else if (request.body.songTitle) {
                                        console.log("CURL");
                                        console.log(request.body.songTitle);
                                        res1 = {};
                                        res1["songs"] = "SUCCESS";
                                        response.send(res1);
                                        if (client){client.end();}
                                    }
                                    else {
                                        if (client){client.end();}
                                    }
                                });
                        }
                        catch (exception) {
                            console.log(exception);
                        }
                    }
                }
                catch (exception) {
                    console.log(exception);
                }
            }
        });
    }
    catch (exception) {
        console.log(exception);
    }
    finally {
        if (client){client.end();} pg.end();
    }
});

app2.post('/songRefresh', function (request, response) {
    try {
        pg.connect(process.env.DATABASE_URL || databaseURL, function (err, client) {
            if (err) { response.send("Error"); if (client){client.end();} throw err; }
            else {
                try {
                    try {
                        client
                            .query("select * from songupdate where userid in ($1)", [request.body.lastFM])
                            .on('end', function (finalres) {
                                if (err) { if (client){client.end();} throw err; }
                                else if (finalres.rows.length > 0) {
                                    console.log(finalres.rows[0].songname);
                                    res1 = {};
                                    res1["songs"] = JSON.stringify(finalres.rows[0].songname);
                                    res1["playlist"] = JSON.stringify(finalres.rows[0].playlist);
                                    res1["artist"] = JSON.stringify(finalres.rows[0].artist);
                                    response.send(res1);
                                    if (client){client.end();}
                                }
                                else {
                                    response.send(finalres);
                                    if (client){client.end();}
                                }
                            });
                    }
                    catch (exception) {
                        console.log(exception);
                    }
                }
                catch (exception) {
                    console.log(exception);
                }
            }
        });
    }
    catch (exception) {
        console.log(exception);
    }
    finally {
        if (client){client.end();} pg.end();
    }
});

app2.post('/upVote', function (request, response) {
    try {
        pg.connect(process.env.DATABASE_URL || databaseURL, function (err, client) {
            if (err) { throw err; response.send("Error"); if (client){client.end();} }
            else {
                try {
                    if (request.body.userName && request.body.party && request.body.song) {
                        try {
                            client
                                .query("UPDATE songvotes set songname = (songname || ($1) || ($2)) where userid in ($3)", [",  +", request.body.song, request.body.userName])
                                .on('end', function (res) {
                                    console.log(res);
                                    if (err) { throw err; response.send("Error"); if (client){client.end();} }
                                    else {
                                        client
                                            .query("select songname from songvotes where userid in ($1)", [request.body.userName])
                                            .on('end', function (finalres) {
                                                if (err) { throw err; if (client){client.end();} }
                                                else if (finalres.rows.length > 0) {
                                                    var res1 = {};
                                                    res1["songs"] = JSON.stringify(finalres.rows[0].songname);
                                                    response.send(res1);
                                                    if (client){client.end();}
                                                }
                                                else {
                                                    response.send("Error");
                                                    if (client){client.end();}
                                                }
                                            });
                                    }
                                });
                        }
                        catch (exception) {
                            console.log(exception);
                        }
                    }
                }
                catch (exception) {
                    console.log(exception);
                }
                finally {
                    if (client){client.end();} pg.end();
                }
            }
        })
    }
    catch (e) {
        console.log(e);
    }
});

app2.post('/downVote', function (request, response) {
    try {
        pg.connect(process.env.DATABASE_URL || databaseURL, function (err, client) {
            if (err) { throw err; response.send("Error"); if (client){client.end();} }
            else {
                try {
                    if (request.body.userName && request.body.party && request.body.song) {
                        try {
                            client
                                .query("UPDATE songvotes set songname = (songname || ($1) || ($2)) where userid in ($3)", [",  -", request.body.song, request.body.userName])
                                .on('end', function (res) {
                                    console.log(res);
                                    if (err) { throw err; if (client){client.end();} }
                                    else {
                                        client
                                            .query("select songname from songvotes where userid in ($1)", [request.body.userName])
                                            .on('end', function (finalres) {
                                                if (err) { throw err; if (client){client.end();} }
                                                else if (finalres.rows.length > 0) {
                                                    var res1 = {};
                                                    res1["songs"] = JSON.stringify(finalres.rows[0].songname);
                                                    response.send(res1);
                                                    if (client){client.end();}
                                                }
                                                else {
                                                    response.send("Error");
                                                    if (client){client.end();}
                                                }
                                            });
                                    }
                                });
                        }
                        catch (exception) {
                            console.log(exception);
                        }
                    }
                }
                catch (exception) {
                    console.log(exception);
                }
                finally {
                    if (client){client.end();} pg.end();
                }
            }
        })
    }
    catch (e) {
        console.log(e);
    }
});

app2.post('/clearVotes', function (request, response) {
    try {
        pg.connect(process.env.DATABASE_URL || databaseURL, function (err, client) {
            if (err) { throw err; response.send("Error"); if (client){client.end();} }
            else {
                try {
                    if (request.body.userName) {
                        try {
                            client
                                .query("UPDATE songvotes set songname = ($1) where userid in ($2)", ["null", request.body.userName])
                                .on('end', function (res) {
                                    console.log(res.rows);
                                    if (err) { console.log(err); throw err; if (client){client.end();} }
                                    else {
                                        var object = {};
                                        object["data"] = res.rows;
                                        response.send(object);
                                        if (client){client.end();}
                                    }
                                });
                        }
                        catch (exception) {
                            response.send("Error");
                            if (client){client.end();}
                            console.log(exception);
                        }
                    }
                }
                catch (exception) {
                    console.log(exception);
                }
                finally {
                    if (client){client.end();} pg.end();
                }
            }
        });
    }
    catch (e) {
        console.log(e);
    }
});

app2.post('/', function (request, response) {
    try {
        pg.connect(process.env.DATABASE_URL || databaseURL, function (err, client) {
            if (err) { throw err; response.send("Error"); if (client){client.end();} }
            else {
                try {
                    if (request.body.party) {
                        client
                            .query("select distinct * from users where party in ($1)", [request.body.party.toUpperCase()])
                            .on('end', function (res1) {
                                if (res1.rows.length > 0 && res1.rows[0].username != request.body.username) {
                                    var result = {};
                                    result["invalid"] = "Enter a different Party Password.";
                                    console.log(res1.rows[0] + "HERE");
                                    response.send(result);
                                    if (client){client.end();}
                                }
                                else {
                                    client
                                        .query("select * from users where username in ($1)", [request.body.username])
                                        .on('end', function (responder) {
                                            try {
                                                if (request.body.party && responder.rows.length > 0 && request.body.playlist && request.body.access_token && request.body.lastFM && request.body.password && !request.body.search && request.body.refresh_token) {
                                                    try {
                                                        client
                                                            .query("UPDATE songvotes SET partyname = $1 where userid in ($2)", [request.body.party, request.body.username]);
                                                        client
                                                            .query("UPDATE songupdate SET username = $1 where userid in ($2)", [request.body.lastFM, request.body.username]);
                                                        client
                                                            .query("UPDATE users SET lastfm = $1 where username in ($2)", [request.body.lastFM, request.body.username]);
                                                        client
                                                            .query("UPDATE users SET superpowers = $1 where username in ($2)", [request.body.password, request.body.username]);
                                                        client
                                                            .query("UPDATE users SET explicit = $1 where username in ($2)", [request.body.explicit, request.body.username]);
                                                        client
                                                            .query("UPDATE users SET access_token = $1 where username in ($2)", [request.body.access_token, request.body.username]);
                                                        client
                                                            .query("UPDATE users SET playlist = $1 where username in ($2)", [request.body.playlist, request.body.username]);
                                                        client
                                                            .query("UPDATE users SET refresh_token = $1 where username in ($2)", [request.body.refresh_token, request.body.username]);
                                                        client
                                                            .query("UPDATE users SET party = $1 where username in ($2)", [request.body.lastFM.toUpperCase(), request.body.username])
                                                            .on('end', function (res) {
                                                                console.log(res);
                                                                if (err) { throw err; if (client){client.end();} } else {
                                                                    var results = "Hello fellow coders!!";
                                                                    response.send(results);
                                                                    if (client){client.end();}
                                                                }
                                                            });
                                                    }
                                                    catch (exception) {
                                                        console.log(exception);
                                                    }
                                                }
                                                else if (request.body.party && request.body.username && request.body.playlist && request.body.lastFM && request.body.password && !request.body.search && request.body.refresh_token) {
                                                    try {
                                                        client
                                                            .query("INSERT INTO songupdate values($1, $2, $3, $4)", [request.body.lastFM, "firstEntry", "secondEntry", request.body.username]);
                                                        client
                                                            .query("INSERT INTO songvotes values($1, $2, $3)", ["firstEntry", request.body.username, request.body.party]);
                                                        client
                                                            .query("INSERT INTO users values($1, $2, $3, $4, $5, $6, $7, $8)", [request.body.party.toUpperCase(), request.body.access_token, request.body.lastFM, request.body.username, request.body.playlist, request.body.explicit, request.body.password, request.body.refresh_token])
                                                            .on('end', function (res) {
                                                                console.log(res);
                                                                if (err) { throw err; if (client){client.end();} }
                                                                else {
                                                                    var results = "Hello fellow coders!!";
                                                                    response.send(results);
                                                                    if (client){client.end();}
                                                                }
                                                            });
                                                    }
                                                    catch (exception) {
                                                        console.log(exception);
                                                    }
                                                }
                                            }
                                            catch (exception) {
                                                console.log(exception);
                                            }
                                        });
                                }
                            });
                    }
                    else {
                        try {
                            client
                                .query("select * from users where party in ($1)", [request.body.search.toUpperCase()])
                                .on('end', function (res) {
                                    if (err) { throw err; if (client){client.end();} }
                                    else {
                                        var result = {};
                                        if (res.rows[0]) {
                                            result["password"] = JSON.stringify(res.rows[0].superpowers);
                                            result["access_token"] = JSON.stringify(res.rows[0].access_token);
                                            result["lastFM"] = JSON.stringify(res.rows[0].lastfm);
                                            result["partyID"] = JSON.stringify(res.rows[0].party);
                                            result["username"] = JSON.stringify(res.rows[0].username);
                                            result["playlist"] = JSON.stringify(res.rows[0].playlist);
                                            result["explicit"] = JSON.stringify(res.rows[0].explicit);
                                            result["refresh_token"] = JSON.stringify(res.rows[0].refresh_token);
                                            res.send(result);
                                            response.send(result);
                                            if (client){client.end();}
                                        }
                                    }
                                });
                        }
                        catch (exception) {
                            console.log(request);
                        }
                    }
                }
                catch (exception) {
                    console.log(exception);
                }
            }
        });
    }
    catch (exception) {
        console.log(exception);
    }
    finally {
        if (client){client.end();} pg.end();
    }
});


if (ii === 1) {
    console.log('Listening on 5000');
    app2.listen(process.env.PORT || 5000)
}
else if (ii === 2) {
    console.log('Listening on 5000');
    app2.listen(process.env.PORT || 5000)
}
else if (ii === 3) {
    console.log('Listening on 8080');
    app2.listen(process.env.PORT || 8080)
}
