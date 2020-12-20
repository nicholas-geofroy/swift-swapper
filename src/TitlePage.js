import React from "react"
import "./TitlePage.css"

class TitlePage extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
  }

  render() {
    return (
      <div id="titlePage">
        <div id="header">
          Swift Swapper
        </div>
        <div id="buttonGroup">
          <button class="button1" onClick={this.props.onLogin}>
            Login to Spotify
          </button>
          <button class="button1" id="aboutButton">
            About
          </button>
        </div>
      </div>
    );
  }
}

export default TitlePage;
