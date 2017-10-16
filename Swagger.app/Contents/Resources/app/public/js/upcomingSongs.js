$(document).ready(function() {
    var e = [];
    window.isReady = function() {
        return !!($("#currentSong").children().length > 0 && localStorage.lastFM && "Search..." == document.getElementById("filename").value || "" == document.getElementById("filename").value)
    }
    ,
    window.rVote = function() {
        parseInt($(".songLinkClick").eq(1).children(".voteUp").text()) < 0 && resetVotes()
    }
    ,
    localStorage.party && (localStorage.lastFM = localStorage.party),
    localStorage.votedArray || (localStorage.votedArray = " "),
    localStorage.CT1 || (localStorage.CT1 = ""),
    $("#results").empty;
    var t, a, n, o, r;
    localStorage.totalSongs = 0,
    localStorage.currentlyPlayingWC = "",
    localStorage.currentlyPlaying = "",
    localStorage.currentTrack = 0,
    localStorage.offsetNumber = 0,
    $("#infoHeader").empty(),
    $("#infoHeader").append("MENU"),
    $("#nameify").empty(),
    $("#nameify").append("#" + localStorage.party.toUpperCase()),
    window.loading = function(e) {
        var t = 1e3;
        1 == e && (t = 5e3),
        3 == e ? t = 750 : 2 == e && (t = 2e3),
        $("#load").css("visibility", "visible");
        var a = setInterval(function() {
            $("#results").children("header").length > 0 && isReady() && setTimeout(function() {
                document.getElementById("load").style.visibility = "hidden",
                document.getElementById("main").style.visibility = "visible",
                clearInterval(a)
            }, t)
        }, 100)
    }
        ;
    var s = 1
      , i = [];
    window.CT = function() {
        localStorage.userID && localStorage.Snapster && $.ajax({
            async: !0,
            type: "GET",
            url: "https://api.spotify.com/v1/users/" + localStorage.userID + "/playlists/" + localStorage.Snapster + "/tracks",
            headers: {
                Authorization: "Bearer " + localStorage.current_token
            },
            dataType: "json",
            data: "formdata",
            success: function(e) {
                e.items.length >= 75 && ($("#filename").val("Limit of 75 Songs Reached"),
                $("#filename").css("pointer-events", "none"),
                $("#filename").css("color", "red")),
                a = [];
                for (var t = 0; t < e.items.length; t++)
                    a[t] = e.items[t].track.id;
                localStorage.CT = a.toString(),
                1 == s && (i = a,
                s = 2),
                a.toString() != i.toString() && (i = a,
                nextSongs()),
                a = []
            }
        })
    }
    ,
    setInterval(function() {
      if(localStorage.votes2 != localStorage.votes || !localStorage.votes2) {
        calculateVotes();
        localStorage.votes2 = localStorage.votes;
      }
    }, 300),
    setInterval(function() {
        votes()
    }, 4000),
    setInterval(function() {
        calculateVotes()
    }, 2000),
    setInterval(function() {
        updateLSSong()
    }, 500),
    setInterval(function() {
        CT(),
        removeSongs()
    }, 7e3);
    var l;
    window.nextSongs = function() {
        if (l = [],
        isReady()) {
            var e = [];
            $("#results").css("padding-top", "298px !important"),
            $("#results").css("text-align", "center"),
            setTimeout(function() {
                updateFooter();
            }, 1000),
            $.ajax({
                async: !0,
                type: "GET",
                url: "https://api.spotify.com/v1/users/" + localStorage.userID + "/playlists/" + localStorage.Snapster + "/tracks?offset=" + localStorage.offsetNumber,
                headers: {
                    Authorization: "Bearer " + access_token
                },
                dataType: "json",
                data: "formdata",
                success: function(t) {
                    $("#error").empty(),
                    $("#results").empty(),
                    $("#albumart").empty(),
                    $("#searchBoxContainer").show(),
                    $("#searchBoxContainer").fadeIn(1e3);
                    for (var a = 0; a < t.items.length; a++)
                        l.push(t.items[a].track.id),
                        0 == a ? (e[0] = t.items[0].track.album.name.toString(),
                        e[1] = t.items[0].track.name.toString(),
                        e[2] = t.items[0].track.artists[0].name.toString(),
                        e[3] = t.items[0].track.album.images[0].url,
                        $("#results").append("<header title='" + t.items[a].track.id + "' style='color: white; pointer-events: none;' id='songLinkClick" + a + "'class='songLinkClick played'> <div class='voteBtn voteDown'><i class='fa fa-angle-down' aria-hidden='true'></i></div> <div> <p>" + t.items[0].track.artists[0].name + "</p> <p>" + t.items[0].track.name + "</p> </div> <div class='voteUp voteBtn'><i class='fa fa-angle-up' aria-hidden='true'></i></div> </header>")) : $("#results").append("<header title='" + t.items[a].track.id + "' style='color: white; pointer-events: none;' id='songLinkClick" + a + "'class='songLinkClick played next'> <div class='voteBtn voteDown'><i class='fa fa-angle-down' aria-hidden='true'></i></div> <div> <p>" + t.items[a].track.artists[0].name + "</p> <p>" + t.items[a].track.name + "</p> </div> <div class='voteUp voteBtn'><i class='fa fa-angle-up' aria-hidden='true'></i></a> </div> </header>"),
                        addVotes(a);
                    $("#results").children("header").length > 0 && (document.getElementById("songLinkClick0").style.color = "black",
                    $("#songLinkClick0").attr("name", "current"),
                    $("[name='current']").css("id"),
                    $("[name='current']").children("div")[0].style.display = "none",
                    $("[name='current']").children("div")[2].style.display = "none",
                    $("#albumart").append("<div class='firstAA'><img id='albumartimg' style='display: inline-block; height: 244px;' src=" + e[3] + " style=''/><div class='secondAA'><h1 class='albumInfo'>" + e[2] + "</h1><h1 class='albumInfo'>" + e[1] + "</h1><h1 class='albumInfo'>" + e[0] + "</h1><h1 class='albumInfo'><center style='font-size: 75%;'><p onclick='play(3);' style='float: left; color: white; display: inline-block;'><<</p><p onclick='playPause();' style='display: inline-block;'>||</p><p onclick='play(1);' style='float: right; display: inline-block;'>>></p></center></div></div>")),
                    $("#results").children("header").length <= 1 && $("#results").append("<p class='lastSong'>This is the last song in the playlist...  The most voted songs will start to play after this song ends.</p>")
                }
            }),
            t = [],
            a = []
        }
    }
    ,
    window.votes = function() {
        o = [],
            n = [],
            r = {};
        r.userName = localStorage.userID,
        $.ajax({
            async: !0,
            type: "POST",
            url: "http://localhost:8080/votes",
            timeout: 500,
            dataType: "json",
            data: r,
            success: function(e) {
                return localStorage.setItem("nebulous", 1),
                localStorage.setItem("votes", e.songs),
                !0
            }
        })
    }
    ,
    window.addVotes = function(e) {
        $("#songLinkClick" + e).children(".voteUp").click(function() {
            var t = "++" + $("#results").find("#songLinkClick" + e).attr("title")
              , a = parseInt($(".songLinkClick").eq(e).children(".voteUp").text());
            vote(t, a)
        }),
        $("#songLinkClick" + e).children(".voteDown").click(function() {
            var t = "--" + $("#results").find("#songLinkClick" + e).attr("title");
            vote(t, 0)
        })
    }
    ,
    window.calculateVotes = function() {
        var t, a;
        e = [],
        $.each(l, function(e, n) {
            t = localStorage.votes.split("++" + n).length,
            a = localStorage.votes.split("--" + n).length,
            t - a != 0 ? ($("[title=" + n + "]").children(".voteUp").text(t - a),
            $("[title=" + n + "]").children(".voteUp").attr("name", t - a)) : ($("[title=" + n + "]").children(".voteUp").html("<i class='fa fa-angle-up' aria-hidden='true'></i>"),
            $("[title=" + n + "]").children(".voteUp").attr("name", t - a))
        }),
        $("#results .next").sort(sortSongs).appendTo("#results")
    }
    ,
    window.sortSongs = function(e, t) {
        return parseInt($(t).children(".voteUp").attr("name")) - parseInt($(e).children(".voteUp").attr("name")) || $(t).siblings(".songLinkClick").attr("title").charCodeAt(10) < $(e).siblings(".songLinkClick").attr("title").charCodeAt(10) || parseInt($(t).children(".voteUp").prev("div")[0].innerHTML.split("</p> <p>")[0].length) - parseInt($(e).children(".voteUp").prev("div")[0].innerHTML.split("</p> <p>")[0].length) || $(t).children(".voteUp").prev("div")[0].innerHTML.split("</p>")[1].charCodeAt(4) - $(e).children(".voteUp").prev("div")[0].innerHTML.split("</p>")[1].charCodeAt(4) || parseInt($(t).children(".voteUp").prev("div")[0].innerHTML.length) - parseInt($(e).children(".voteUp").prev("div")[0].innerHTML.length)
    }
    ,
    window.removeSongs = function() {
        var e, t;
        $.each(l, function(a, n) {
            e = localStorage.votes.split("++" + n).length,
            t = localStorage.votes.split("--" + n).length;
            var o = $("[title=" + n + "]")[0].id.slice(13);
            -3 >= e - t && (remove(o, n),
            nextSongs())
        })
    }
    ,
    Array.max = function(e) {
        return Math.max.apply(Math, e)
    }
    ,
    localStorage.votes || (localStorage.votes = ""),
    window.vote = function(e) {
        loading(3);
        var t = {};
        localStorage.votes = localStorage.votes + e,
        t.song = e,
        t.songorder = "resultsTracks",
        t.userName = localStorage.userID,
        t.party = localStorage.party,
        $.ajax({
            async: !0,
            type: "POST",
            url: "http://localhost:8080/upVote",
            timeout: 500,
            dataType: "json",
            data: t,
            success: function(t) {
                console.log(t),
                addPopularSong(e.slice(2))
            }
        }),
        $("#results .next").sort(sortSongs).appendTo("#results")
    }
    ,
    window.updateVotes = function(e) {
        var t = {};
        t.userName = localStorage.userID,
        t.song = e.replace(/\\/g, ""),
        $.ajax({
            async: !0,
            type: "POST",
            url: "http://localhost:8080/downVote",
            timeout: 750,
            dataType: "json",
            data: t,
            success: function(e) {
                console.log("OK")
            }
        })
    }
    ,
    window.addPopularSong = function(e) {
        return $.ajax({
            async: !0,
            type: "GET",
            url: "https://api.spotify.com/v1/users/" + localStorage.userID + "/playlists/" + localStorage.Snapster2 + "/tracks",
            headers: {
                Authorization: "Bearer " + localStorage.current_token
            },
            dataType: "json",
            data: "formdata",
            success: function(t) {
                for (var a = [], n = 0; n < t.items.length; n++)
                    a[n] = t.items[n].track.id;
                -1 == a.indexOf(e) && $.ajax({
                    type: "POST",
                    url: "https://api.spotify.com/v1/users/" + localStorage.userID + "/playlists/" + localStorage.Snapster2 + "/tracks?&uris=spotify%3Atrack%3A" + e,
                    headers: {
                        Authorization: "Bearer " + localStorage.current_token
                    },
                    dataType: "json",
                    data: "formdata",
                    success: function(e) {}
                })
            }
        }),
        !1
    }
    ,
        window.increment = function (e) {
        var t = $(".songLinkClick").eq(0).attr("title")
          , a = new RegExp(t,"g")
          , n = new RegExp(/"/,"g")
          , o = localStorage.votes.replace(a, "");
        o = (o = (o += ", --" + t).replace(n, "")).replace(/\\/, ""),
        localStorage.votes = o,
        updateVotes(o);
        var r = {};
        loading(1);
        var s = $(".songLinkClick").eq(1).attr("id");
        s = s.substr(13),
        s *= 1;
        var i = 1 * i + 1 * localStorage.offsetNumber;
        r.insert_before = 0,
        r.range_start = s,
        r.range_length = 1,
        $.ajax({
            async: !0,
            type: "PUT",
            url: "https://api.spotify.com/v1/users/" + localStorage.userID + "/playlists/" + localStorage.Snapster + "/tracks",
            headers: {
                Authorization: "Bearer " + localStorage.current_token
            },
            dataType: "json",
            data: JSON.stringify(r),
            success: function(e) {
                $("#results").css("text-align", "center"),
                nextSongs()
            },
            error: function(e) {}
        })
        },
        window.play = function (a) {
        var obj;
        var req = "https://api.spotify.com/v1/me/player/play";
        if (a == 1) {
            var obj1 = {};
            var nextUp = $(".songLinkClick").eq(1).attr("title");
            obj1.uris = ["spotify:track:" + localStorage.nextUp];
            req = "https://api.spotify.com/v1/me/player/play?&device_id=" + localStorage.deviceID;
            obj = JSON.stringify(obj1);
        }
        else if (a == 2) {
          req = "https://api.spotify.com/v1/me/player/play";
            var obj = {};
        }
        else if (a == 3) {
            var obj1 = {};
            localStorage.nowUp = $(".songLinkClick").eq(0).attr("title");
            obj1.uris = ["spotify:track:" + localStorage.nowUp];
            obj = JSON.stringify(obj1);
        }
        else if (a == 4) {
          req = "https://api.spotify.com/v1/me/player/play?&device_id=" + localStorage.deviceID;
            var obj = {};
        }
            $.ajax({
                async: true,
                type: "PUT",
                url: req,
                headers: { 'Authorization': 'Bearer ' + localStorage.current_token },
                data: obj,
                success: function (myData) {
                    if (a == 1) increment();
                }
            });
        }
        ,
        window.playPause = function(a) {
        $.ajax({
            async: true,
            type: "GET",
            url: "https://api.spotify.com/v1/me/player",
            headers: { 'Authorization': 'Bearer ' + localStorage.current_token },
            success: function (myData) {
                if (myData.is_playing == true) {
                  pause();
                }
                else {
                  play(2);
                }
            }
        });
    },
    window.remove = function(e, t) {
        var a = '{"tracks":[{ "positions":[' + e + '] , "uri": "spotify:track:' + t + '" }]}';
        $.ajax({
            async: !0,
            type: "DELETE",
            url: "https://api.spotify.com/v1/users/" + localStorage.userID + "/playlists/" + localStorage.Snapster + "/tracks",
            headers: {
                Authorization: "Bearer " + localStorage.current_token
            },
            dataType: "json",
            data: a,
            success: function(e) {
                $("#results").css("text-align", "center")
            },
            error: function(e) {}
        })
    }
    ,
    loading(),
    window.updateLSSong = function() {
      localStorage.nextUp = $(".songLinkClick").eq(1).attr("title");
    }
    ,
    setTimeout(function() {
        nextSongs()
    }, 3e3),
    setInterval(function() {
        rVote()
      }, 3e4);
        var currentInt;
        window.currentInterval = function() {
          currentInt = setInterval(function () {
           current()
        }, 2100)},
        currentInterval(),
    setTimeout(function() {
        loading()
    }, 100),
    window.reload = function() {
        location.href = "http://localhost:8080/reload"
    }
    ,
    window.playFirst = function() {
        setTimeout(function () {
            play(1);
        }, 1000);
    }
    ,
    window.prev = function() {
        location.href = "http://localhost:8080/prev"
    }
    ,
    setTimeout(function() {
        0 == localStorage.wasPressed && (localStorage.wasPressed = 1,
        playFirst());
        3 == localStorage.wasPressed && (localStorage.wasPressed = 1,
        play(4))
    }, 10),
        window.pause = function () {
            $.ajax({
                async: true,
                type: "PUT",
                url: "https://api.spotify.com/v1/me/player/pause",
                headers: { 'Authorization': 'Bearer ' + localStorage.current_token },
                success: function (myData) {

                }
            });
        };
        var flag = false;
        window.current = function () {
            $.ajax({
                async: true,
                type: "GET",
                url: "https://api.spotify.com/v1/me/player/currently-playing",
                headers: { 'Authorization': 'Bearer ' + localStorage.current_token },
                success: function (myData) {
                    if (myData.progress_ms == 0 && myData.is_playing != true && !flag) {
                      flag = true;
                      setTimeout(function() { clearInterval(currentInt); play(1); }, 1000);
                      setTimeout(function() { currentInterval(); }, 2000);
                    }
                    else if (myData.item != null && myData.is_playing == true) {
                        localStorage.duration = myData.item.duration_ms;
                        flag = false;
                    }
                }
            });
        }
        ,
    window.playlist = function() {}
    ,
    nextSongs()
});
