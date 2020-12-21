const axios = require('axios').default;

class Spotify {
    constructor(token) {
        this.instance = axios.create({
            baseURL: "https://api.spotify.com/v1/",
            timeout: 1000,
            headers: { Authorization: 'Bearer ' + token }
        });
        this.id = null
        this.get_user();
    }

    get_user_id() {
        return new Promise((res, rej) => {
            if (this.id) {
                res(this.id)
            }
            return res(this.get_user().then(
                (response) => {
                    this.id = response.data.id;
                    return this.id;
                }
            ));
        });
    }

    get_playlist_tracks(playlist) {
        return this._get_playlist_tracks_recur(
            `playlists/${playlist.id}/tracks`,
            []
        );
    }

    _get_playlist_tracks_recur(next, cur_arr) {
        return this.instance.get(next).then(resp => {
            var tracks = cur_arr.concat(resp.items);
            if (resp.next) {
                return this._get_playlist_tracks_recur(
                    resp.next,
                    tracks
                );
            }
            return tracks;
        });
    }

    copy_playlist(playlist) {
        return this.create_playlist(playlist.name + " copy", playlist.public, playlist.collaborative, playlist.description)
            .then((playlist) => {
                return this.get_playlist_tracks(playlist)
                    .then(tracks => {
                        return this.add_tracks_to_playlist(playlist, tracks)
                    })
            });
    }

    add_tracks_to_playlist(playlist, tracks) {
        return this.instance.post(`playlists/${playlist.id}/tracks`, {
            uris: tracks.map(track => track.uri)
        }).then(resp => {
            return playlist;
        });
    }

    create_playlist(name, is_public, collaborative, description) {
        return this.get_user_id().then((id) => {
            var data = {
                name: name,
                public: is_public,
                collaborative: collaborative,
                description: description,
            }
            return this.instance.post(`users/${id}/playlists`, data);
        });
    }

    get_playlists() {
        return this._get_playlists_recur("/me/playlists", [])
    }

    _get_playlists_recur(next, cur_arr) {
        return this.instance.get(next).then(response => {
            var pageData = response.data;
            var playlists = cur_arr.concat(pageData.items)
            if (pageData.next) {
                return this._get_playlists_recur(
                    pageData.next,
                    playlists
                );
            }
            return playlists;
        });
    }

    get_editable_playlists() {
        return Promise.all([this.get_user_id(), this.get_playlists()])
            .then((values) => {
                var id = values[0]
                var playlists = values[1]
                console.log("promise returned!", values)
                return playlists.filter(playlist => {
                    return playlist.owner.id === id
                        || playlist.collaborative;
                })
            });
    }

    get_user() {
        return this.instance.get("me");
    }
}

export default Spotify;