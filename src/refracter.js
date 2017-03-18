//
// Refracter constants and functions
//

//imports
import { browserHistory } from 'react-router';
import 'whatwg-fetch';

//define some global variables
export const loginCookieName = 'refracter_login';
export const lastFmEndpoint = 'http://ws.audioscrobbler.com/2.0/';
export const refracterEndpoint = document.location.hostname === 'localhost' ? 'http://localhost/_code/refracter/src/api/' : '/api/';
export let userLoggedIn; //not used at the moment
export let userKey = ''; //only set after user logins, then used to authenticate with api

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

export const setCookie = ( c_name, value, exdays ) => {
    let exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    let c_value = escape(value) + ((exdays == null)
        ? ""
        : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + '=' + c_value + ';path=/';
}

export const getCookie = ( name ) => {
	let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

export const deleteCookie = ( c_name ) => {
    document.cookie = c_name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
}

export const getQueryString = ( name ) => {
    //name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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

export const getLastFMTrackLink = (trackName, trackArtist) => {

    //first get album info from lastFM
    fetch(`${lastFmEndpoint}?method=track.getinfo&track=${trackName}&artist=${trackArtist}&api_key=${lastFmApiKey()}&format=json`).then(response => {
        return response.json();
    }).then(response => {
        console.log(response);

        if ( response.track ) {
            let trackLink = `/album/${encodeURIComponent(trackArtist)}/${encodeURIComponent(response.track.album.title)}/${encodeURIComponent(trackName)}`
            browserHistory.push(trackLink);
        }

    }).catch(err => {
        console.log('LastFM track.getinfo: ', err);
    });
}

export const findTracksByAlbum = (artist, album, key) => {

    return new Promise(function(resolve, reject) {

        let albumData = {};

        //first get album info from lastFM
        fetch(`${lastFmEndpoint}?method=album.getinfo&artist=${artist}&album=${album}&api_key=${lastFmApiKey()}&format=json`).then(response => {
            return response.json();
        }).then(response => {

            //set lastfm album info in return object
            albumData.info = response.album;

            //then see if tracks are already in database
            fetch(`${refracterEndpoint}getAlbum.php?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&key=${key}`).then(response => {
                return response.json();
            }).then(response => {

                if ( response.success && response.tracks ) {
                    //tracks already in the refracter db
                    albumData.tracks = response.tracks;

                    if ( response.albumInLibrary ) {
                        albumData.albumInLibrary = true;
                    }

                    return resolve(albumData);
                } else {
                    //tracks not in database so add

                    let tracksToAddToDB = [];

                    //transform tracks from lastfm to new refracter album track format
                    for (let [i,track]of albumData.info.tracks.track.entries()) {

                        let newTrack = {
                            number: i + 1,
                            title: track.name,
                            album: albumData.info.name,
                            artist: albumData.info.artist,
                            duration: track.duration,
                            art: albumData.info.image[3]['#text'],
                            type: ''
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

                        if ( response.success && response.tracks ) {
                            //add newly added tracks to resolve object
                            albumData.tracks = response.tracks;
                            return resolve(albumData);
                        } else {
                            console.log('Refracter addAlbum: ', 'No tracks returned from adding album');
                        }

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

export const getTrackSource = (track, key) => {

    return new Promise(function(resolve, reject) {

        fetch(`${refracterEndpoint}getTrackSource.php?key=${key}&trackID=${track.trackID}`).then(response => {
            return response.json();
        }).then(response => {

            if (response.success && response.source ) {
                //youtube id found in refracter db
                resolve(response.source);
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

export const addUserTracksToDb = (key, tracks, playlistID) => {

    //clean track array to only track ids
    let trackIDs = [];
    for (let track of tracks ) {
        trackIDs.push( track.trackID );
    }

    //create post object to be sent to api
    let postObject = {
        key: key,
        tracks: trackIDs,
        playlistID: playlistID
    }

    return new Promise(function(resolve, reject) {

        fetch(`${refracterEndpoint}addUserTracks.php`, {
            method: 'POST',
            body: JSON.stringify(postObject)
        }).then(response => {
            return response.json();
        }).then(response => {

            console.log(response);
            if ( response.success ) {

            } else {
            }

        }).catch(err => {
            console.log('addUserTracks: ', err);
        });

    });

}
