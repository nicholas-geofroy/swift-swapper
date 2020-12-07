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

    get_playlists() {
        return this._get_playlists_recur("/me/playlists", [])
    }

    _get_playlists_recur(next, cur_arr) {
        return this.instance.get(next).then(response => {
            var pageData = response.data;
            if (pageData.next) {
                return this._get_playlists_recur(
                    pageData.next,
                    cur_arr.concat(pageData.items)
                );
            }
            return pageData.items;
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