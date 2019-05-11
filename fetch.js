const request = require('request-promise-native')
const bunyan = require('bunyan')
const logger = bunyan.createLogger({name: __dirname})
const fs = require('fs');

console.log('I\'m Alive Master!!!')

const config = require('./config.json')

const trackId = '7yXQDwn7ZZN2kNuraNdRkc';
const accessToken = config.accessToken
const getTrackUrl = 'https://api.spotify.com/v1/tracks/';
const getArtistUrl = 'https://api.spotify.com/v1/artists/'
const getAlbumUrl = 'https://api.spotify.com/v1/albums/'

const requestOptions = {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
}

function getAlbumGenres(albumId) {
    logger.info('Requesting album genres')
    request({
        uri: getAlbumUrl + albumId,
        ...requestOptions
    }).then(res => {
        const {genres} = JSON.parse(res);
        logger.info({genres}, "Album genres")
    })
}

function getArtistGenres(artistId) {
    logger.info('Requesting artist genres')
    request({
        uri: getArtistUrl + artistId,
        ...requestOptions
    }).then(res => {
        const {genres} = JSON.parse(res);
        logger.info({genres}, "Artist genres")
    })
}

function getIdsByTrackId(trackId) {
    return request({
        uri: getTrackUrl + trackId,
        ...requestOptions
    }).then(res => {
        const jsonBody = JSON.parse(res);
        const albumId = jsonBody.album.id;
        const artistId = jsonBody.artists[0].id;
        let ids = {trackId, albumId, artistId};
        logger.info(ids, 'Fetched track info')
        return ids;
    })
}

getIdsByTrackId(trackId).then(({albumId, artistId}) => {
    getArtistGenres(artistId)
    getAlbumGenres(albumId)
}).catch(err => {
    logger.error({err}, 'Request failed')
})


