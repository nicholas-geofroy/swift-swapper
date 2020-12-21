import React from "react"
import "./Swapper.css"
import Loader from 'react-loader-spinner'

class Swapper extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
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
}

export default Swapper;
