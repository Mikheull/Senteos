# Senteos ![Issues](https://img.shields.io/github/issues/Mikheull/Senteos) ![GitHub last commit](https://img.shields.io/github/last-commit/Mikheull/Senteos)

Send a message differently and generate a playlist with your text

## Installation
```
git clone https://github.com/Mikheull/Senteos.git
npm install
```

## Configuration
To get started, create and configure your Spotify application [here](https://developer.spotify.com/dashboard/applications), and properly configuring the app and adding `http://localhost:3000/login/callback` in **callback** url, and get the `client_id` and `client_secret`

Then copy the .env.example to new .env file at the root of the project folder, it will contain the authentication token access to your Spotify
SESSION_SECRET is a random token

## Utilisation
```
npm start
```

## Annexe
[Image](https://unsplash.com/) <br>
[Framework](Tailwindcss)
