import React from "react"
import "./Swapper.css"
import Loader from 'react-loader-spinner'

class Swapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,
    }

    this.render_loading = this.render_loading.bind(this);
    this.render_complete = this.render_complete.bind(this);
  }

  componentDidMount() {
    this.props.spotify.copy_playlist(this.props.playlist)
      .then(() => {
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

  render_loading() {
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

  render_complete() {
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
      return this.render_loading();
    } else {
      return this.render_complete();
    }
  }
}

export default Swapper;
