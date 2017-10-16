$(document).ready(function() {
                  var party;
                  var userPrompt;
                  var obj2 = {};
                  window.newToken = function() {
                  $.ajax({
                         type: "GET",
                         url: 'http://localhost:8080/refresh_token',
                         data: {
                         'refresh_token': localStorage["refresh_token"]
                         }
                         }).done(function(data) {
                                 access_token = data.access_token;
                                 localStorage["current_token"] = data.access_token;
                                 setTimeout(function() { create(); }, 5000);
                                 });
                  }
                  newToken();
                  window.create = function() {
                  localStorage["valid"] = "true";
                  $.ajax({
                         async: true,
                         type: "GET",
                         url: "https://api.spotify.com/v1/me",
                         headers: {
                         'Authorization': 'Bearer ' + localStorage["current_token"]
                         },
                         dataType: "json",
                         data: "formdata",
                         success: function(userData) {
                         localStorage['userID'] = userData.id;
                         userID = localStorage['userID'];
                         localStorage["valid"] = "true";
                         },
                         error: function() {}
                         });
                  if (localStorage["party"].length > 3 && localStorage["password"].length > 3) {
                  if (!localStorage.username) localStorage.username = localStorage.userID;
                  obj2["party"] = localStorage["party"];
                  obj2["lastFM"] = localStorage["party"];
                  obj2["playlist"] = localStorage.Snapster + ":::" + localStorage.Snapster2;
                  obj2["access_token"] = localStorage["current_token"];
                  obj2["username"] = localStorage.username;
                  obj2["userID"] = localStorage.userID;
                  obj2["explicit"] = localStorage.explicit;
                  obj2["password"] = localStorage.password;
                  obj2["refresh_token"] = localStorage.refresh_token;
                  $.ajax({
                         async: true,
                         dataType: "json",
                         timeout: 500,
                         type: "POST",
                         data: obj2,
                         url: "http://localhost:8080/",
                         success: function(accessDataset) {
                         if (accessDataset.username) localStorage.username = localStorage.userID + ":::" + accessDataset.username;
                         },
                         error: function() {}
                         });
                  }
                  }
                  });
