import React from "react"
import "./Swapper.css"
import Loader from 'react-loader-spinner'

const newSongsPlaylistId = "6lZiChkJ3dznd84Fs9NpRv";

class Swapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,
    }

    this.renderLoading = this.renderLoading.bind(this);
    this.renderComplete = this.renderComplete.bind(this);
    this.getNewSongs = this.getNewSongs.bind(this);
  }

  getNewSongs() {
    return this.props.spotify.get_playlist_tracks(newSongsPlaylistId)
      .then(newSongs => {
        var newSongsMap = {}
        for (var i in newSongs) {
          var song = newSongs[i]
          var title = song.track.name
          newSongsMap[title] = song;
        }
        console.log("songs map:", newSongsMap);
        return newSongsMap;
      });
  }

  componentDidMount() {
    this.getNewSongs()
      .then(newSongsMap => {
        return this.props.spotify.copy_playlist(this.props.playlist, song => {
          var isTaylorSong = song.track.artists.find(artist => artist.name == "Taylor Swift");
          if (!isTaylorSong) {
            return song;
          }
          var songName = song.track.name;

          console.log("Found Taylor Swift Song", songName);

          if (songName in newSongsMap) {
            console.log("Match!");
            return newSongsMap[songName];
          }
          return song;
        });
      }).then(() => {
        this.setState({
          loading: false,
        });
      }).catch(err => {
        console.log(err);
        this.setState({
          loading: false,
          error: err,
        })
      });
  }

  renderLoading() {
    return (
      <div id="loading screen">
        <div id="processingText">
          Processing
        </div>
        <Loader
          type="Bars"
          color="var(--fg-colour)"
          height={100}
          width={100}
        />
      </div>
    );
  }

  renderComplete() {
    return (
      <div id="runScreen">
        <div id="processingText">
          Complete
        </div>
        <button className="button1" onClick={this.props.onComplete}>
          Back
        </button>
      </div>
    );
  }

  render() {
    const { error, loading } = this.state;
    if (loading) {
      return this.renderLoading();
    } else {
      return this.renderComplete();
    }
  }
}

export default Swapper;
