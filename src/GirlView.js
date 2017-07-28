import React from 'react';
import './GirlView.css';

class GirlView extends React.Component {
  render() {
    return (
      <div id="girl-main-view">
        <svg height="100%" width="100%" viewBox="0 0 1500 3000">

          <g id="full-body" transform="translate(750,1330) rotate(0)">
            <image href="images/girl/Base/base body/torso 1/torso.png" x="-251" y="-636" width="492" height="998" />

            <g id="left-leg" transform="translate(123,234) rotate(0)">

              <g id="left-leg-lower" transform="translate(-26,639) rotate(0)">
                <image href="images/girl/Base/legs 1/left leg lower.png" x="-134" y="-64" width="211" height="780" />
              </g>

              <image href="images/girl/Base/legs 1/left leg upper.png" x="-99" y="-27" width="200" height="670"/>
            </g>


          </g>
        </svg>
      </div>
    );
  }
}

export default GirlView;
