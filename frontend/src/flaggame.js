import React, { Component } from 'react';

import './flaggame.css';

class FlagGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guess: '',
      leaderboard: [], // We'll store an array of { user, score } or just user strings
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleServerMessage = this.handleServerMessage.bind(this);
  }

  componentDidMount() {
    const username = prompt('Enter your name:');
    if(!username) return;
    this.socket = new WebSocket('ws://localhost:3010');
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
      const updatedLeaderboard = data.leaderboard
      this.setState({ leaderboard: updatedLeaderboard });
    }
  }

  handleInputChange(e) {
    this.setState({ guess: e.target.value });
  }

  handleSubmit() {
    const { guess } = this.state;
    console.log('Submitted guess:', guess);


    this.setState({ guess: '' });
  }

  render() {
    const { guess, leaderboard } = this.state;
    leaderboard.map((entry, idx) => (
      console.log(entry, idx)
    ));
    return (
      <div>
        <div className = "leaderboard">
          {leaderboard.map((entry, idx) => (
            <div key={idx}>
              <b>{entry.username}:</b> {entry.score}
            </div>
          ))}
        </div>

        <div className = "gamewindow">
          <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/800px-Flag_of_the_People%27s_Republic_of_China.svg.png"
              alt="Country Flag"
              className = "gameimage"
          />
          <input
            type="text"
            value={guess}
            onChange={this.handleInputChange}
            placeholder="Guess the country"
            className = "gameinput"
          />
          <button 
            onClick={this.handleSubmit}
            className = "gamebutton"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default FlagGame;
