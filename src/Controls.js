import React from 'react';
import './Controlss.css';

class Controls extends React.Component {
  render() {
    return (
      <div id="controls">
        <label>
          Age: {this.props.age} years old
          <br/>
          <input type="range" value={this.props.age} min="2" max="18" step="0.1" onChange={(e) => this.props.updateAge(e.target.value)} />
        </label>
      </div>
    );
  }
}

export default Controls;
