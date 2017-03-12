//
// Refracter constants and functions
//

//imports
import 'whatwg-fetch';

//define variables
export const lastFmEndpoint = 'http://ws.audioscrobbler.com/2.0/';
export const refracterEndpoint = 'http://localhost/_code/refracter/src/server/services/';
let userLoggedIn = false;

//start define functions

export const lastFmApiKey = () => {
    if (userLoggedIn) {} else {
        return '482ff3a9fdfa984bca6a93a8bce32642';
    }
}

export const youTubeApiKey = () => {
    if (userLoggedIn) {} else {
        return 'AIzaSyBqJN5ztzfbty3nZaosCYkJB3TcsETL344';
    }
}

export const secondsToMinutes = (seconds) => {

    let hours;

    //only show hours if they exist
    if (Math.floor(((seconds / 86400) % 1) * 24) !== 0) {
        hours = Math.floor(((seconds / 86400) % 1) * 24) + ':';
    } else {
        hours = '';
    }

    //show 2 digits for seconds less than double digits
    var sec = Math.round(((seconds / 60) % 1) * 60);
    if (sec < 10) {
        sec = '0' + sec
    }

    return (hours + Math.floor(((seconds / 3600) % 1) * 60) + ':' + sec);

}

export const revertSortFunc = (a, b, order) => { // order is desc or asc
    if (order === 'desc') {
        return a.number - b.number;
    } else {
        return b.number - a.number;
    }
}

export const findTracksByAlbum = (artist, album) => {

    return new Promise(function(resolve, reject) {

        let albumData = {};

        //first get album info from lastFM
        fetch(`${lastFmEndpoint}?method=album.getinfo&artist=${artist}&album=${album}&api_key=${lastFmApiKey()}&format=json`).then(response => {
            return response.json();
        }).then(response => {

            //set lastfm album info in return object
            albumData.info = response.album;

            //then see if tracks are already in database
            fetch(`${refracterEndpoint}getAlbum.php?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`).then(response => {
                return response.json();
            }).then(response => {

                if (response) {
                    //tracks already in the refracter db
                    albumData.tracks = response
                    return resolve(albumData);
                } else {
                    //tracks not in database so add

                    let tracksToAddToDB = [];

                    //transform tracks from lastfm to new refracter album track format
                    for (let [i,
                        track]of albumData.info.tracks.track.entries()) {

                        let newTrack = {
                            number: i + 1,
                            title: track.name,
                            album: albumData.info.name,
                            artist: albumData.info.artist,
                            duration: track.duration,
                            art: albumData.info.image[3]['#text']
                        };

                        tracksToAddToDB.push(newTrack);
                    }

                    //send tracks to add album service
                    fetch(`${refracterEndpoint}addAlbum.php`, {
                        method: 'POST',
                        body: JSON.stringify(tracksToAddToDB)
                    }).then(response => {
                        return response.json();
                    }).then(response => {

                        //add newly added tracks to resolve object
                        albumData.tracks = response
                        return resolve(albumData);

                    }).catch(err => {

                        console.log('Refracter addAlbum: ', err);

                    });

                }

            }).catch(err => {
                console.log('Refracter getAlbum: ', err);
            });

        }).catch(err => {
            console.log('LastFM album.getinfo: ', err);
        });

    });

}

export const getTrackSource = (track) => {

    return new Promise(function(resolve, reject) {

        fetch(`${refracterEndpoint}getTrackSource.php?id=${track.trackID}`).then(response => {
            return response.json();
        }).then(response => {

            if (response) {
                //youtube id found in refracter db
                resolve(response);
            } else {
                //no matches found for track in refracter db

                let query = `${track.artist} ${track.title}`;

                //youtube search
                fetch(`https://www.googleapis.com/youtube/v3/search/?part=id&key=AIzaSyBqJN5ztzfbty3nZaosCYkJB3TcsETL344&q=${query}`).then(response => {
                    return response.json();
                }).then(response => {

                    if (response) {
                        resolve(response.items[0].id.videoId);
                    }

                }).catch(err => {
                    console.log('YouTube search: ', err);
                });

            }

        }).catch(err => {
            console.log('Refracter getTrackSource: ', err);
        });

    });

}
