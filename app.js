require('dotenv').config();

const { Router } = require('express');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
app.get('/',(req,res) => {
res.render('home');
});



app.get('/artist-search', async (req, res) => {
    //Query param
    let artistName = req.query.theArtistName;
    let result = await spotifyApi.searchArtists(artistName);     
   // console.log('The received data from the API: ', result);
   let artists = result.body.artists.items;
   artists.forEach((artist) => {
       console.log(artist);
   });
   res.render('search-result',{artists});
   // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
})

//1. Criar rota que recebe albums/:artistId
//2. Console.log desse artistId

app.get('/albums/:artistId', async(req, res) => { 
    console.log('id que vem do url', req.params.artistId);
    let result = await spotifyApi.getArtistAlbums(req.params.artistId);
    let albums = result.body.items;
    albums.forEach((album) => {
        console.log(album);
    });
    //1. criar a view albums
    //2. passar albums para a view albums
    //3. na view albums each album
    res.render('albums',{albums});
});
app.get('/tracks/:albumId', async(req, res) => { 
    console.log('id que vem do url', req.params.albumId);
    let result = await spotifyApi.getAlbumTracks(req.params.albumId);
    let tracks = result.body.items;
    tracks.forEach((tracks) => {
        console.log(tracks);
    });
    //1. criar a view albums
    //2. passar albums para a view albums
    //3. na view albums each album
    res.render('tracks',{tracks});
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));