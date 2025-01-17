import React, { Component } from 'react';

import './flaggame.css';

class FlagGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guess: '',
      username: '',
      leaderboard: {},
      orderFlags: [],
      imageIndex: 0,
      received: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleServerMessage = this.handleServerMessage.bind(this);
  }

  componentDidMount() {
    const username = prompt('Enter your name:');
    if (!username) return;
    this.setState({
      username: username
    });
    this.socket = new WebSocket('wss://b5aa-2601-85-c680-6140-84fc-7260-db80-8944.ngrok-free.app');
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({
        type: 'username',
        username,
      }));
    };
    this.socket.onmessage = this.handleServerMessage;
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  }

  handleServerMessage(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'leaderboard') {
      const updatedLeaderboard = data.leaderboard;
      if (this.state.received) {
        this.setState({
          leaderboard: updatedLeaderboard
        });
      } else {
        this.setState({
          leaderboard: updatedLeaderboard,
          orderFlags: Object.keys(data.orderFlags),
          answerFlags: Object.values(data.orderFlags),
          received: true,
        });
      }
    }
  }

  handleInputChange(e) {
    this.setState({ guess: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, guess, answerFlags, imageIndex, leaderboard } = this.state;

    console.log("answers: ", answerFlags[imageIndex]);
    const isIncluded = answerFlags[imageIndex].some(
      (flag) => flag.toLowerCase() === guess.toLowerCase()
    );
    let v = isIncluded ? 1 : 0;
    leaderboard[username] = leaderboard[username] + v;

    this.socket.send(JSON.stringify({
      type: 'leaderboard',
      leaderboard: leaderboard
    }));

    this.setState((prevState) => ({
        guess: '',
        imageIndex: prevState.imageIndex + 1,
        leaderboard: leaderboard
    }));

  }

  render() {
    const { guess, leaderboard, orderFlags, imageIndex } = this.state;
    const leaderboardEntries = Object.entries(leaderboard);

    return (
      <div>
        <div className="leaderboard">
          {leaderboardEntries.map(([username, score], index) => (
            <div key={index}>
              <b>{username}:</b> {score}
            </div>
          ))}
        </div>

        <form className="gamewindow">
          <img
            src={orderFlags[imageIndex]}
            alt="Country Flag"
            className="gameimage"
          />
          <input
            type="text"
            value={guess}
            onChange={this.handleInputChange}
            placeholder="Guess the country"
            className="gameinput"
          />
          <button
            onClick={this.handleSubmit}
            className="gamebutton"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default FlagGame;
