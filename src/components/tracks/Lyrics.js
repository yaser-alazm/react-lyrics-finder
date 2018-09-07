import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../layouts/Spinner";
import Moment from "react-moment";

class Lyrics extends Component {
  state = {
    track: {},
    lyrics: {}
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${id}&apikey=${
          process.env.REACT_APP_MM_KEY
        }`
      )
      .then(res => {
        //console.log(res.data);
        this.setState({
          lyrics: res.data.message.body.lyrics
        });
        axios
          .get(
            `https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.get?track_id=${id}&apikey=${
              process.env.REACT_APP_MM_KEY
            }`
          )
          .then(res => {
            this.setState({
              track: res.data.message.body.track
            });
          });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { track, lyrics } = this.state;
    if (
      lyrics === undefined ||
      track === undefined ||
      Object.keys(lyrics).length === 0 ||
      Object.keys(track).length === 0
    ) {
      return <Spinner />;
    } else {
      return (
        <React.Fragment>
          <Link to="/" className="btn btn-dark btn-sm mb-4">
            Go Back
          </Link>
          <div className="card">
            <h5 className="card-header">
              <strong>{track.track_name}</strong> by{" "}
              <span className="text-secondary">{track.artist_name}</span>
            </h5>
            <div className="card-body">
              <p className="card-text">{lyrics.lyrics_body}</p>
            </div>
          </div>
          <ul className="list-group mt-3">
            <li className="list-group-item">
              <strong>Album ID</strong>: {track.album_id}
            </li>
            <li className="list-group-item">
              <strong>Music Genre</strong>:{" "}
              {track.primary_genres.music_genre_list.length !== 0
                ? track.primary_genres.music_genre_list[0].music_genre
                    .music_genre_name
                : "N/A"}
            </li>
            <li className="list-group-item">
              <strong>Explicit Words</strong>:{" "}
              {track.explicit === 0 ? "No" : "Yes"}
            </li>
            <li className="list-group-item">
              <strong>Release Date</strong>:{" "}
              <Moment format="MM/DD/YYYY">{track.first_release_date}</Moment>
            </li>
          </ul>
        </React.Fragment>
      );
    }
  }
}

export default Lyrics;
