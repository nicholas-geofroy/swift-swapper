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
        console.log("Get playlist tracks for", playlist)
        return this._get_playlist_tracks_recur(
            `playlists/${playlist.id}/tracks`,
            []
        );
    }

    _get_playlist_tracks_recur(next, cur_arr) {
        return this.instance.get(next).then(resp => {
            console.log("get some tracks", resp);
            var data = resp.data;
            var tracks = cur_arr.concat(data.items);
            if (data.next) {
                return this._get_playlist_tracks_recur(
                    data.next,
                    tracks
                );
            }
            return tracks;
        });
    }

    copy_playlist(playlist) {
        return this.create_playlist(playlist.name + " copy", playlist.public, playlist.collaborative, playlist.description)
            .then((resp) => {
                var new_playlist = resp.data;
                return this.get_playlist_tracks(playlist)
                    .then(tracks => {
                        console.log("all tracks:", tracks);
                        return this.add_tracks_to_playlist(new_playlist, tracks)
                    })
            });
    }

    add_tracks_to_playlist(playlist, tracks) {
        const maxUriAdd = 100;
        if (!Array.isArray(tracks) || !tracks.length) {
            return Promise.resolve(playlist);
        }
        var uris = tracks.map(track_data => track_data.track.uri);
        console.log("add uris:", uris);

        var results = []
        for (var i = 0; i < uris.length; i += maxUriAdd) {
            results.push(
                Promise.resolve(uris.slice(i, i + maxUriAdd))
                    .then(section => {
                        this._add_chunk_to_playlist(playlist, section);
                    })
            );
        }
        return Promise.all(results).then(() => playlist);
    }

    _add_chunk_to_playlist(playlist, uris) {
        console.log("Try adding chunk to playlist", uris);
        return this.instance.post(`playlists/${playlist.id}/tracks`, {
            uris: uris
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
            var playlists = cur_arr.concat(pageData.items);
            console.log("Get playlists response", response);
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