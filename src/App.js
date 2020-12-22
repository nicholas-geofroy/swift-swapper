import './App.css';
import ListPlaylist from './ListPlaylist.js'
import React from "react"
import Spotify from "./spotify.js"
import TitlePage from "./TitlePage.js"
import Swapper from "./Swapper.js"

const queryString = require('query-string')
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      accessToken: "",
      showDialog: false,
      playlist: null,
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.onPlaylistSelected = this.onPlaylistSelected.bind(this);
    this.onPlaylistSwapped = this.onPlaylistSwapped.bind(this);
  }

  componentDidMount() {
    var queryParams = queryString.parse(window.location.hash)
    if ("access_token" in queryParams || window.location.toString().includes("access_token")) {
      this.setState({
        loggedIn: true,
        accessToken: queryParams['access_token']
      });
    }
  }

  login() {
    const showDialog = this.state.showDialog;
    const query = {
      "client_id": "cad5fe116d264749a77638ec4bfb4a2f",
      "response_type": "token",
      "redirect_uri": process.env.REACT_APP_DOMAIN,
      "scope": "playlist-read-private playlist-modify-private playlist-read-collaborative playlist-modify-public",
      "state": "logged",
      "show_dialog": showDialog,
    }
    const base_url = "https://accounts.spotify.com/authorize?"
    window.location.href = base_url + queryString.stringify(query)
    console.log("public url: " + process.env.REACT_APP_DOMAIN)
  }

  logout() {
    this.setState({
      loggedIn: false,
      showDialog: true,
    });
  }

  onPlaylistSelected(playlist) {
    console.log("selected", playlist.name);
    this.setState({
      playlist: playlist,
    })
  }

  onPlaylistSwapped() {
    console.log("complete");
    this.setState({
      playlist: null
    });
  }

  render() {
    const { loggedIn, accessToken, _, playlist } = this.state;
    if (loggedIn) {
      var spotify = new Spotify(accessToken);
      if (playlist) {
        return <Swapper playlist={playlist} spotify={spotify} onComplete={this.onPlaylistSwapped} />
      } else {
        return (
          <div id="main">
            <button onClick={this.logout} class="button1">Logout</button>
            <ListPlaylist spotify={spotify} onPlaylistSelected={this.onPlaylistSelected} />
          </div>
        );
      }
    } else {
      return (
        <div id="main">
          <TitlePage onLogin={this.login} />
        </div>
      );
    }
  }
}

export default App;
