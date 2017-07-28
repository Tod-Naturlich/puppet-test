import React from 'react';
import Smooth from './Smooth';

const innerStyle = {
  fill: '#fff2e4',
  strokeWidth: 0.15,
  stroke: '#ffffff',
};

const outerStyle = {
  fill: 'none',
  strokeWidth: 0.15,
  stroke: '#bc8061',
}

const heightByAge = [
  [2, 19],
  [7, 20.166666],
  [8, 21.166666],
  [9, 22.333333],
  [12, 23.384615],
  [17, 23.428571],
];

const widthByAge = [
  [2, 17.5],
  [13, 20],
];

const chinDecrementByAge = [
  [2,0],
  [16,2],
];

class Head extends React.Component {
  constructor(props) {
    super(props);
    this.buildPathDesc = this.buildPathDesc.bind(this);
  }

  buildPathDesc() {
    const chinDecrement = Smooth(chinDecrementByAge)(this.props.age);

    const path = [
      'M',
      [0,0],
      'c',
      [-2.416246 + chinDecrement,0],
      [-4.603746 + chinDecrement/2,-1.063324],
      [-6.187184 + chinDecrement/2,-2.782486],
      [-1.583439,-1.719161],
      [-2.562816 - chinDecrement/2,-4.094161],
      [-2.562816 - chinDecrement/2,-6.717514],
      [0,-5.246705],
      [3.917509,-9.4999998],
      [8.75,-9.4999998],
    ];
    const mirrorPath = path.map(element => {
      if (element.constructor === Array) {
        return [-element[0],element[1]];
      } else {
        return element;
      }
    });
    let mixedPath = path.concat(mirrorPath);
    mixedPath = [].concat.apply([],mixedPath);
    return mixedPath.join(' ');
  }

  render() {
    const heightScale = Smooth(heightByAge)(this.props.age) / 19;
    const widthScale = Smooth(widthByAge)(this.props.age) / 17.5;

    const path = this.buildPathDesc();

    const baseScale = 'scale(' + widthScale + ' ' + heightScale + ')'

    return (
      <g transform={baseScale}>
        <path transform="translate(0,-9.5) scale(0.985,0.985) translate(0,9.5)" style={innerStyle} d={path}/>
        <path style={outerStyle} d={path} />
      </g>
    );
  }
}

export default Head;
