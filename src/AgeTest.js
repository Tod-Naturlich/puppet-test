import React from 'react';
import Controls from './Controls';
import Head from './Head';
import Smooth from './Smooth';

class AgeTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      age: 8,
      x: 10,
      y: 10,
    };

    this.updateAge = this.updateAge.bind(this);
  }

  updateAge(newAge) {
    this.setState({
      age: newAge,
    });
  }

  render() {
    let s = new Smooth([[1,19],[7,20.166666],[8,21.16666666],[9,22.33333333],[12,23.384615],[17,23.428571]]);

    let desc = ['M 1,19 L'];
    for (var i = 1; i <= 18; i+=0.01) {
      desc.push('' + i + ' ' + s(i));
    }
    desc = desc.join(' ');

    const getTransformedCoordinates = (event, parentElement) => {
      let p = this.svg.createSVGPoint();
      p.x = event.clientX;
      p.y = event.clientY;
      return p.matrixTransform(parentElement.getScreenCTM().inverse());
    };

    return (
      <div>
        <Controls age={this.state.age} updateAge={this.updateAge}/>
        Text: {s(this.state.age)}
        <div>
          <svg height="100%" width="100%" viewBox="0 0 30 30">
            <rect x="0" y="0" width="100%" height="100%" fill="#e4f1ff"/>
            <g transform="translate(15 25)">
              <Head age={this.state.age}/>
            </g>
          </svg>
        </div>
        <div>
          <svg height="100%" width="100%" viewBox="0 0 20 30" ref={(svg)=>this.svg=svg}>
            <path style={{stroke:'#000000',strokeWidth:0.1,fill:'none'}} d={desc}/>
            <circle cx={this.state.x} cy={this.state.y} r="1" style={{fill:'red',opacity:0.5,cursor:'pointer'}} onMouseDown={(e) => {
              const parentElement = e.target.parentElement;
              const startPoint = getTransformedCoordinates(e, parentElement);
              startPoint.x -= this.state.x;
              startPoint.y -= this.state.y;
              e.preventDefault();
              const mouseMove = (event) => {
                event.preventDefault();
                const newPoint = getTransformedCoordinates(event, parentElement);
                this.setState({
                  x: newPoint.x - startPoint.x,
                  y: newPoint.y - startPoint.y,
                });
              };
              const mouseUp = (event) => {
                document.removeEventListener("mousemove", mouseMove);
                document.removeEventListener("mouseup", mouseUp);
              }
              document.addEventListener("mousemove", mouseMove);
              document.addEventListener("mouseup", mouseUp);
            }}/>
          </svg>
        </div>
      </div>
    );
  }
}

export default AgeTest
