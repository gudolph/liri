require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var variable = process.argv[3];
var fs = require("fs");
var request = require('request');

var ask = function () {
    switch (command) {
        case "concert-this":
            var artistArr = [];
            for (i = 3; i < process.argv.length; i++) {
                artistArr.push(process.argv[i]);
                artistArr.toString();
                var artist = artistArr.join(" ");
            };
            console.log(artist)
                ; var bandsintown = function () {
                    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
                    request(queryUrl, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            var json = JSON.parse(body);
                            for (i = 0; i < json.length; i++) {
                                var dateTime = json[i].datetime;
                                var month = dateTime.substring(5, 7);
                                var year = dateTime.substring(0, 4);
                                var day = dateTime.substring(8, 10);
                                var dateForm = month + "/" + day + "/" + year

                                console.log("\n---------------------------------------------------\n");
                                console.log("Name: " + json[i].venue.name);
                                console.log("City: " + json[i].venue.city);
                                if (json[i].venue.region !== "") {
                                    console.log("Country: " + json[i].venue.region);
                                }
                                console.log("Country: " + json[i].venue.country);
                                console.log("Date: " + dateForm);
                                console.log("\n---------------------------------------------------\n");
                            }
                        } else {
                            artist = variable;
                        }
                    })
                };
            bandsintown();
            break;
        case "spotify-this-song":
            var songArr = [];
            for (i = 3; i < process.argv.length; i++) {
                songArr.push(process.argv[i]);
                songArr.toString();
                var song = songArr.join(" ");
            };
            console.log(songArr);
            spotify.search({
                type: "track",
                query: song
            }, function (error, data) {
                if (error) {
                    return console.log("Error ocurred: " + error);
                } else {
                    console.log("\n----------------------------\n")
                    console.log("Artist: " + data.tracks.items[0].artists[0].name);
                    console.log("\nSong: " + data.tracks.items[0].name);
                    console.log("\nPreview: " + data.tracks.items[3].preview_url);
                    console.log("\nAlbum: " + data.tracks.items[0].album.name);
                    console.log("\n----------------------------\n")
                }
            });
            break;
        case "movie-this":
            var titleArr = [];
            for (i = 3; i < process.argv.length; i++) {
                titleArr.push(process.argv[i]);
                var title = JSON.stringify(titleArr);
            };
            var omdb = function () {
                if (variable === undefined) {
                    title = "Mr. Nobody";
                } else {

                    var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
                    request(queryUrl, function (err, res, body) {
                        var bodyOf = JSON.parse(body);
                        if (!err && res.statusCode === 200) {
                            console.log("\n----------------------------\n")
                            console.log("Title: " + bodyOf.Title);
                            console.log("Release Year: " + bodyOf.Year);
                            console.log("IMDB Rating: " + bodyOf.imdbRating);
                            console.log("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value);
                            console.log("Country: " + bodyOf.Country);
                            console.log("Language: " + bodyOf.Language);
                            console.log("Plot: " + bodyOf.Plot);
                            console.log("Actors: " + bodyOf.Actors);
                            console.log("\n----------------------------\n")
                        }
                    });
                }
            }
            omdb();
            break;
        case "do-what-it-says":
            var random = function () {
                fs.readFile('random.txt', "utf8", function (error, data) {
                    if (error) {
                        return console.log(error);
                    }

                    var dataArr = data.split(",");
                    if (dataArr[0] === "spotify-this-song") {
                        var songcheck = dataArr[1].trim().slice(1, -1);
                        spotify.search({
                            type: "track",
                            query: songcheck
                        }, function (error, data) {
                            if (error) {
                                return console.log("Error ocurred: " + error);
                            } else {
                                console.log("\n----------------------------\n")
                                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                                console.log("\nSong: " + data.tracks.items[0].name);
                                console.log("\nPreview: " + data.tracks.items[3].preview_url);
                                console.log("\nAlbum: " + data.tracks.items[0].album.name);
                                console.log("\n----------------------------\n")
                            }
                        });
                    };
                });
            }
            random();
            break;
    };

};
ask()