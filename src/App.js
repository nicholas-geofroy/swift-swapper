import './App.css';
import React from "react"

const queryString = require('query-string')
class App extends React.Component {
  render() {
    console.log(window.location)
    var queryParams = queryString.parse(window.location.hash)
    console.log("query params: ", queryParams)
    if ("access_token" in queryParams || window.location.toString().includes("access_token")) {
      return (
        <div className="App">Success</div>
      )
    } else {
      var query = {
        "client_id": "cad5fe116d264749a77638ec4bfb4a2f",
        "response_type": "token",
        "redirect_uri": process.env.REACT_APP_DOMAIN,
        "scope": "playlist-modify-private",
        "state": "logged"
      }
      console.log(query)
      var base_url = "https://accounts.spotify.com/authorize?"
      window.location.href = base_url + queryString.stringify(query)
      console.log("public url: " + process.env.REACT_APP_DOMAIN)
      return (
        <div className="App">
          {process.env.PUBLIC_URL}
        </div>
      );
    }
  }
}

export default App;
