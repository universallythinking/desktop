var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var timeout = require('connect-timeout'); //express v4
var session = require('express-session');
var nextUp;
ii = 3;
if (ii === 1) {
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
    var client_secret = 'd7fab3e169b542d891bc2365b1412e2e'; // Your secret
    var redirect_uri = 'http://localhost:8080/callback/'; // Your redirect uri
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
var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper( 4380 );

// get the name of the song which is currently playing

var stateKey = 'spotify_auth_state';

var app2 = express();

app2.use(express.static(__dirname + '/public'))
    .use(cookieParser());

app2.get('/login', function (req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your app2lication requests authorization
    var scope = 'user-read-private user-read-playback-state user-read-email playlist-modify-public user-modify-playback-state';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app2.get('/loginToApp', function (req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your app2lication requests authorization
    var scope = 'user-read-private user-read-email playlist-modify-public';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri2,
            state: state
        }));
});

app2.get('/playlist', function (req, res) {
console.log(req.query);
  spotify.play("https://play.spotify.com/" + req.query.playlist.replace(/:/g, "/"), function (err, res) {
      if (err) {
          console.info(err);
      }
      else {
          console.info(res);
      }
  });
  return;
});
var timeObj = {};

var sec = 0.12;
var timeLeft = function() {
  spotify.getStatus(function (err, res) {
            if (err) {
                return console.error(err);
            }
            sec = res.track.length - res.playing_position;
        });
}

//setInterval(function() { timeLeft(); }, 1000);

var playSong = function() {
spotify.play("https://play.spotify.com/track/" + nextUp, function (err, res) {
    if (err) {
        console.info(err);
    }
    else {
        console.info(res);
    }
});
return;
}

var playPause = function() {
  spotify.getStatus(function (err, res) {
    if (res.playing){
  spotify.pause(function (err, res) { return; });
}
  else {
  spotify.unpause(function (err, res) { return; });
}

});
}
app2.get('/pause', function (req, res) {
    playPause();
});

app2.get('/playSongNow', function (req, res) {
    playSong();
});
app2.get('/terminate', function (req, res) {
    ses.clearStorageData();
    setTimeout(function() {
        mainWindow.close();
    }, 500);
});
app2.get('/choose-a-playlist', function (req, res) {
    res.redirect('/playlists.html');
});
app2.get('/details', function (req, res) {
    res.redirect('/welcome.html');
});
app2.get('/join', function (req, res) {
    res.redirect("https://snapster.memberful.com/checkout?plan=13554");
});
app2.get('/error', function (req, res) {
    res.redirect('/error.html');
});
app2.get('/', function (req, res) {
    res.redirect('/index.html');
});
app2.get('/songUpdate', function (req, res) {
    var song = req.query.track;
    var artist = req.query.artist;
    var user = req.query.user;
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
                // // console.log(body);
                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    // console.log(body);
                    userName = body.id;
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
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

app2.get('/app-callback', function (req, res) {

    // your app2lication requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/cb.html#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri2,
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
                // // console.log(body);
                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    // console.log(body);
                    userName = body.id;
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/cb.html#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/cb.html#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});
var d = new Date().getDate();
d = d / 4;
d = Math.round(d);
var userName = "";
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
app2.get('/refresh_token2', function (req, res) {

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
app2.use(session({
    secret: '34SDsdafadssskdjfhaskdlfhaksdgfkj3oiuq4r8q3y4ro8yo9syfdiakhfkjsadkafaelisfhewryoq34yrwyoi', // just a long random string
    resave: false,
    saveUninitialized: true
}));
app2.use(timeout(15000));
app2.use(haltOnTimedout);
function haltOnTimedout(req, res, next){
  if (!req.timedout) { next(); }
  if (req.timedout) { res.end(); }
}
var config = {
    user: 'yotnkoupklgnce', //env var: PGUSER
    database: 'd6480t5vkn701i', //env var: PGDATABASE
    password: 'PEI_Vz3Jnz8qebuxiSafxNHcrj', //env var: PGPASSWORD
    host: 'ec2-54-235-95-188.compute-1.amazonaws.com', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 3, // max number of clients in the pool
    idleTimeoutMillis: 1, // how long a client is allowed to remain idle before being closed
};

//this initializes a connection pool
//it will keep idle connections open for 30 seconds
//and set a limit of maximum 10 idle clients
var pool = new pg.Pool(config);
app2.post('/nextUp', function (req, res) {
  console.log(req.body.song);
  nextUp = req.body.song;
  timeObj.position = sec;
  res.send(timeObj);
});
app2.post('/votes', function (request, response) {
        pool.connect(function (err, client, done) {
            if (err) { throw err; }
            if (request.body.userName) {
                client
                    .query("select songname from songvotes where userid in ($1)", [request.body.userName + ':::' + request.sessionID], function (err, result) {
                    done(err);
                    if (result.rows.length > 0) {
                            var results = {};
                            results["songs"] = JSON.stringify(result.rows[0].songname);
                            response.send(results);
                            client.end(); response.end();
                        }
                        else {
                            response.send("FAILURE 214");
                            client.end(); response.end();
                        }
                        setTimeout(function() {done(err); client.end(); response.end(); }, 100);
                    });
            }
            else {
                 response.send("FAILURE 214");
                 client.end(); response.end();
            }
                    setTimeout(function() {done(err); client.end(); response.end(); }, 500);
        });
});

app2.post('/checkPassword', function (request, response) {
    pool.connect(function (err, client, done) {
        done(err);
        if (request.body.password) {
        if (request.body.password.indexOf('"') == -1 && request.body.password.indexOf("'") == -1) {
          var user;
          if (request.body.username.indexOf(":::") != -1) {
            user = request.body.username;
          }
          else {
            user = request.body.username + ":::" + request.sessionID;
          }
            client.query("select lastfm from users where lastfm in ($1) and username not in ($2)", [request.body.password.toLowerCase() + ':::' + d, user], function (err, result) {
                        if (result.rows.length > 0) { response.send("none"); client.end(); response.end(); }
                        else { response.send("done"); client.end(); response.end(); }
                });
        }
        else {
        response.send("none"); client.end(); response.end();
        }
          setTimeout(function() {done(err); client.end(); response.end(); }, 700);
        }
            else {
        response.send("none"); client.end(); response.end();
        }
        done(err);
        setTimeout(function() { done(err); client.end(); response.end();}, 1000);
    });
});

app2.post('/songUpdater', function (request, response) {
   response.send("SUCCESS"); response.end();
});


app2.post('/upVote', function (request, response) {
    pool.connect(function (err, client, done) {
        done(err);
        if (request.body.userName && request.body.song) {
          client
              .query("UPDATE songvotes set songname = (songname || ($1) || ($2)) where userid in ($3)", [',  +', request.body.song.replace(/\"\'/g, ''), request.body.userName + ':::' + request.sessionID], function (err, result) {
               done(err);
                    response.send("SUCCESS");
                    client.end(); response.end();
                    });
            setTimeout(function() {done(err); client.end(); response.end(); }, 700);
        }
        else {
            response.send("ERROR");
            client.end(); response.end();
        }
            setTimeout(function() {done(err); client.end(); response.end(); }, 1000);
    });
});

app2.post('/downVote', function (request, response) {
    pool.connect(function (err, client, done) {
        done(err);
    var escape = function(str) { return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, ""); }
        if (request.body.userName && request.body.song) {
          client
              .query("UPDATE songvotes set songname = ($1) where userid in ($2)", [escape(request.body.song), request.body.userName + ':::' + request.sessionID], function (err, result) {
          done(err);
                        response.send("SUCCESS");
                        client.end(); response.end();
                });
            setTimeout(function() { done(err); client.end(); response.end(); }, 1000);
        }
        else {
            response.send("Error");
            client.end(); response.end();
        }
            setTimeout(function() { done(err);client.end(); response.end(); }, 1500);
    });
});

app2.post('/clearVotes', function (request, response) {
    pool.connect(function (err, client, done) {
        done(err);
        if (request.body.userName) {
            client
                .query("UPDATE songvotes set songname = ($1) where userid in ($2)", ['null', request.body.userName], function (err, result) {
                done(err);
                response.send("SUCCESS");
                        client.end(); response.end();
                });
            setTimeout(function() { done(err);client.end(); response.end(); }, 100);
        }
        else {
            response.send("Error");
            client.end(); response.end();
        }
            setTimeout(function() {done(err); client.end(); response.end(); }, 250);
        // $("#songLinkClick" + i).attr("title")}, 1500);
    });
});

app2.post('/', function (request, response) {
    pool.connect(function (err, client, done) {
        var escape = function(str) { return str.replace(/\"\'/g, ''); }
        done(err);
        if (request.body.party) {
                if (request.body.username) {
                        client
                            .query("select * from users where username in ($1)", [request.body.username], function (err, result) {
                                if (request.body.party && result.rows.length > 0 && request.body.playlist && request.body.access_token && request.body.lastFM && request.body.password && !request.body.search && request.body.refresh_token) {
                                if ((request.body.party + request.body.playlist + request.body.access_token + request.body.lastFM + request.body.password + request.body.refresh_token).indexOf("'") ==-1 && (request.body.party + request.body.playlist + request.body.access_token + request.body.lastFM + request.body.password + request.body.refresh_token).indexOf('"') ==-1) {
                                    client
                                        .query("UPDATE songvotes SET partyname = $1 where userid in ($2)", [escape(request.body.party) + ':::' + d, escape(request.body.username)], function (err, result) {});
                                        client
                                            .query("UPDATE songupdate SET username = $1 where userid in ($2)", [escape(request.body.lastFM) + ':::' + d, escape(request.body.username)], function (err, result) {});
                                              client
                                                .query("UPDATE songupdate SET playlist = $1 where userid in ($2)", [escape(request.body.playlist), escape(request.body.username)], function (err, result) {});
                                            client
                                        .query("UPDATE users SET lastfm = $1 where username in ($2)", [escape(request.body.lastFM) + ':::' + d, escape(request.body.username)], function (err, result) {});
                                        client
                                    .query("UPDATE users SET party = $1 where username in ($2)", [escape(request.body.lastFM.toUpperCase()) + ':::' + d, escape(request.body.username)], function (err, result) {});
                                    client
                                        .query("UPDATE users SET explicit = $1 where username in ($2)", [escape(request.body.explicit), escape(request.body.username)], function (err, result) {});
                                    client
                                        .query("UPDATE users SET access_token = $1 where username in ($2)", [escape(request.body.access_token), escape(request.body.username)], function (err, result) {});
                                    client
                                        .query("UPDATE users SET playlist = $1 where username in ($2)", [escape(request.body.playlist), escape(request.body.username)], function (err, result) {});
                                    client
                                        .query("UPDATE users SET refresh_token = $1 where username in ($2)", [escape(request.body.refresh_token), escape(request.body.username)], function (err, result) {});
                                        client
                                            .query("UPDATE users SET superpowers = $1 where username in ($2)", [escape(request.body.password), escape(request.body.username)], function (err, result) {
                                        done(err);
                                        var results = "Hello fellow coders!!";
                                            response.send(results);
                                        setTimeout(function() { client.end(); response.end(); }, 800);
                                        });
                                }
                                    else {
                                       response.send("err");
                                    }
                                }
                                else if (request.body.party && request.body.username && request.body.playlist && request.body.lastFM && request.body.password && !request.body.search && request.body.refresh_token) {
                                    if ((request.body.party + request.body.playlist + request.body.access_token + request.body.lastFM + request.body.password + request.body.refresh_token).indexOf("'") ==-1 && (request.body.party + request.body.playlist + request.body.access_token + request.body.lastFM + request.body.password + request.body.refresh_token).indexOf('"') ==-1) {
                                    client
                                        .query("INSERT INTO songupdate values($1, $2, $3, $4, $5)", [escape(request.body.lastFM)+ ':::' + d, '2017:::2017', 'Universally Thinking', escape(request.body.username) + ':::' + request.sessionID, escape(request.body.playlist)], function (err, result) {});
                                    client
                                        .query("INSERT INTO songvotes values($1, $2, $3)", ["firstEntry", escape(request.body.username) + ':::' + request.sessionID, escape(request.body.party)+ ':::' + d], function (err, result) {});
                                    client
                                        .query("INSERT INTO users values($1, $2, $3, $4, $5, $6, $7, $8)", [escape(request.body.lastFM.toUpperCase())+ ':::' + d, escape(request.body.access_token), escape(request.body.lastFM)+ ':::' + d, escape(request.body.username) + ':::' + request.sessionID, escape(request.body.playlist), escape(request.body.explicit), escape(request.body.password), escape(request.body.refresh_token)], function (err, result) {
                                        done(err);
                                        var results = {};
                        results["username"] = request.sessionID;
                        response.send(results);
                                        setTimeout(function() { client.end(); response.end(); }, 300);
                                        });
                                }
                                else {
                                    response.send("err");
                                }
                                }
                            setTimeout(function() { client.end(); response.end(); }, 1000);
                            });
                    }
                setTimeout(function() { client.end(); response.end(); }, 2000);
                    // $("#songLinkClick" + i).attr("title")}, 2500);
        }
        else if (request.body.search) {
            client
                .query("select * from public.users where party in ($1)", [request.body.search.toUpperCase()], function (err, result) {
                done(err);
                if (result.rows[0]) {
                        var results = {};
                        results["password"] = JSON.stringify(result.rows[0].superpowers);
                        results["access_token"] = JSON.stringify(result.rows[0].access_token);
                        results["lastFM"] = JSON.stringify(result.rows[0].lastfm);
                        results["partyID"] = JSON.stringify(result.rows[0].party);
                        results["username"] = JSON.stringify(result.rows[0].username);
                        results["playlist"] = JSON.stringify(result.rows[0].playlist);
                        results["explicit"] = JSON.stringify(result.rows[0].explicit);
                        results["refresh_token"] = JSON.stringify(result.rows[0].refresh_token);
                        response.send(results);
                    setTimeout(function() { client.end(); response.end(); }, 100);
                    }
                    else {
                        response.send("No Matches");
                        setTimeout(function() { client.end(); response.end(); }, 100);
                    }
                setTimeout(function() { client.end(); response.end(); }, 1000);
                });
        }
                        setTimeout(function() { client.end(); response.end(); }, 2500);
        // $("#songLinkClick" + i).attr("title")}, 2500);
    });
});
app2.post('/ios', function (request, response) {
    pool.connect(function (err, client, done) {
        var escape = function(str) { return str.replace(/\"\'/g, ''); }
        done(err);
        if (request.body.party) {
            client
                .query("select distinct * from users where party in ($1)", [request.body.party.toUpperCase()], function (err, result) {
                done(err);
                if (result.rows.length > 0 && result.rows[0].username != request.body.username && 1==2) {
                        var results = {};
                        results["invalid"] = "Enter a different Party Password.";
                        response.send(results);
                    setTimeout(function() { client.end(); response.end(); }, 1);
                    }
                    else if (request.body.username) {
                        client
                            .query("select * from users where username in ($1)", [request.body.username], function (err, result) {
                                if (request.body.party && result.rows.length > 0 && request.body.playlist && request.body.access_token && request.body.lastFM && request.body.password && !request.body.search && request.body.refresh_token) {
                                if ((request.body.party + request.body.playlist + request.body.access_token + request.body.lastFM + request.body.password + request.body.refresh_token).indexOf("'") ==-1 && (request.body.party + request.body.playlist + request.body.access_token + request.body.lastFM + request.body.password + request.body.refresh_token).indexOf('"') ==-1) {
                                    client
                                        .query("UPDATE songvotes SET partyname = $1 where userid in ($2)", [escape(request.body.party) + ':::' + d, escape(request.body.username)], function (err, result) {});
                                        client
                                            .query("UPDATE songupdate SET username = $1 where userid in ($2)", [escape(request.body.lastFM) + ':::' + d, escape(request.body.username)], function (err, result) {});
                                              client
                                                .query("UPDATE songupdate SET playlist = $1 where userid in ($2)", [escape(request.body.playlist), escape(request.body.username)], function (err, result) {});
                                            client
                                        .query("UPDATE users SET lastfm = $1 where username in ($2)", [escape(request.body.lastFM) + ':::' + d, escape(request.body.username)], function (err, result) {});
                                    client
                                        .query("UPDATE users SET superpowers = $1 where username in ($2)", [escape(request.body.password), escape(request.body.username)], function (err, result) {});
                                    client
                                        .query("UPDATE users SET explicit = $1 where username in ($2)", [escape(request.body.explicit), escape(request.body.username)], function (err, result) {});
                                    client
                                        .query("UPDATE users SET access_token = $1 where username in ($2)", [escape(request.body.access_token), escape(request.body.username)], function (err, result) {});
                                    client
                                        .query("UPDATE users SET playlist = $1 where username in ($2)", [escape(request.body.playlist), escape(request.body.username)], function (err, result) {});
                                    client
                                        .query("UPDATE users SET refresh_token = $1 where username in ($2)", [escape(request.body.refresh_token), escape(request.body.username)], function (err, result) {});
                                    client
                                        .query("UPDATE users SET party = $1 where username in ($2)", [escape(request.body.lastFM.toUpperCase()) + ':::' + d, escape(request.body.username)], function (err, result) {
                                        done(err);
                                        var results = "Hello fellow coders!!";
                                            response.send(results);
                                        setTimeout(function() { client.end(); response.end(); }, 800);
                                        });
                                }
                                    else {
                                       response.send("err");
                                    }
                                }
                                else if (request.body.party && request.body.username && request.body.playlist && request.body.lastFM && request.body.password && !request.body.search && request.body.refresh_token) {
                                    if ((request.body.party + request.body.playlist + request.body.access_token + request.body.lastFM + request.body.password + request.body.refresh_token).indexOf("'") ==-1 && (request.body.party + request.body.playlist + request.body.access_token + request.body.lastFM + request.body.password + request.body.refresh_token).indexOf('"') ==-1) {
                                    client
                                        .query("INSERT INTO songupdate values($1, $2, $3, $4, $5)", [escape(request.body.lastFM) + ':::' + d, '2017:::2017', 'Universally Thinking', escape(request.body.username) + ':::' + request.sessionID, escape(request.body.playlist)], function (err, result) {});
                                    client
                                        .query("INSERT INTO songvotes values($1, $2, $3)", ["firstEntry", escape(request.body.username) + ':::' + request.sessionID, escape(request.body.party) + ':::' + d], function (err, result) {});
                                    client
                                        .query("INSERT INTO users values($1, $2, $3, $4, $5, $6, $7, $8)", [escape(request.body.lastFM.toUpperCase()) + ':::' + d, escape(request.body.access_token), escape(request.body.lastFM) + ':::' + d, escape(request.body.username) + ':::' + request.sessionID, escape(request.body.playlist), escape(request.body.explicit), escape(request.body.password), escape(request.body.refresh_token)], function (err, result) {
                                        done(err);
                                        var results = "Hello fellow coders!!";
                                            response.send(results);
                                        setTimeout(function() { client.end(); response.end(); }, 300);
                                        });
                                }
                                else {
                                    response.send("err");
                                }
                                }
                            setTimeout(function() { client.end(); response.end(); }, 1000);
                            });
                    }
                setTimeout(function() { client.end(); response.end(); }, 2000);
                    // $("#songLinkClick" + i).attr("title")}, 2500);
                });
        }
        else if (request.body.search) {
            client
                .query("select * from public.users where party in ($1)", [request.body.search.toUpperCase()], function (err, result) {
                done(err);
                if (result.rows[0]) {
                        var results = {};
                        results["password"] = JSON.stringify(result.rows[0].superpowers);
                        results["access_token"] = JSON.stringify(result.rows[0].access_token);
                        results["lastFM"] = JSON.stringify(result.rows[0].lastfm);
                        results["partyID"] = JSON.stringify(result.rows[0].party);
                        results["username"] = JSON.stringify(result.rows[0].username);
                        results["playlist"] = JSON.stringify(result.rows[0].playlist);
                        results["explicit"] = JSON.stringify(result.rows[0].explicit);
                        results["refresh_token"] = JSON.stringify(result.rows[0].refresh_token);
                        response.send(results);
                    setTimeout(function() { client.end(); response.end(); }, 100);
                    }
                    else {
                        response.send("No Matches");
                        setTimeout(function() { client.end(); response.end(); }, 100);
                    }
                setTimeout(function() { client.end(); response.end(); }, 1000);
                });
        }
                        setTimeout(function() { client.end(); response.end(); }, 2500);
        // $("#songLinkClick" + i).attr("title")}, 2500);
    });
});
pool.on('error', function (err, client, done) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack);
});
process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});
if (ii === 1) {
    // console.log('Listening on 5000');
    app2.listen(process.env.PORT || 5000);
    app2.timeout = 3000;
}
else if (ii === 2) {
    // console.log('Listening on 5000');
    app2.listen(process.env.PORT || 5000);
    app2.timeout = 3000;
}
else if (ii === 3) {
    // console.log('Listening on 8080');
    app2.listen(process.env.PORT || 8080);
    app2.timeout = 3000;
}

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
var ses
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 650, height: 800, resizable: false})
  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:8080/app2.html')
  //mainWindow.loadURL('http://spotify.com/logout')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
    ses = mainWindow.webContents.session
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
