import React from "react"
import "./Playlist.css"

class ListPlaylist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        this.props.spotify.get_editable_playlists()
            .then((response) => {
                console.log("resonse: ", response);
                this.setState({
                    isLoaded: true,
                    items: response
                });
                return response;
            }).catch((error) => {
                console.log("error: " + error);
                this.setState({
                    isLoaded: true,
                    error: error
                });
            });
    }

    render() {
        const { error, isLoaded, items } = this.state
        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        }

        const listItems = items.map(playlist => {
            return <PlaylistItem key={playlist.id} playlist={playlist} onSelected={this.props.onPlaylistSelected} />
        });
        return (
            <div id="playlistView">
                <div id="title">Select A Playlist</div>
                <div className="playlist">
                    {listItems}
                </div>
            </div>
        );
    }
}

class PlaylistItem extends React.Component {
    constructor(props) {
        super(props);
        this.onSelected = this.onSelected.bind(this);
    }

    onSelected() {
        this.props.onSelected(this.props.playlist);
    }

    render() {
        return (
            <button className="playlistItem" onClick={this.onSelected}>
                {this.props.playlist.name}
            </button>
        );
    }
}

export default ListPlaylist;
