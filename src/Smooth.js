function checkNumberAndPush(number, array) {
  let parsedNumber = parseFloat(number);
  if (isNaN(parsedNumber) || !isFinite(parsedNumber)) {
    throw new TypeError(number + ' is not a number');
  }
  array.push(parsedNumber);
}

class AbstractInterpolator {
  constructor(pointPairs, clip='clamp') {
    // Make sure we receive an array of values
    if (pointPairs.constructor !== Array) {
      throw new TypeError('pointPairs must be an array.');
    }
    if (pointPairs.length < 2) {
      throw new TypeError('pointPairs must have at least 2 data points.');
    }
    this.clipHelper = {
      clamp: this.clipHelperClamp,
      zero: this.clipHelperZero
    }[clip];
    if (!this.clipHelper) {
      throw new TypeError("Invalid clip: " + clip);
    }

    // Copy the array.
    this.pointPairs = pointPairs.slice();

    // If the array is a point array, sort it by the parameter.
    let isPointArray = false;
    if (this.pointPairs[0].constructor === Array) {
      isPointArray = true;
      this.pointPairs.sort((pointA, pointB) => {
        if (pointB.constructor !== Array) {
          throw new TypeError(pointB + ' is not a point');
        }
        return pointA[0] - pointB[0];
      });
    }

    this.t = [];
    this.x = [];

    this.pointPairs.forEach((pair, index) => {
      if (isPointArray) {
        checkNumberAndPush(pair[0], this.t);
        checkNumberAndPush(pair[1], this.x)
      } else {
        this.t.push(index);
        checkNumberAndPush(pair, this.x);
      }
    });

    this.length = this.t.length;

    this.getClippedInput = this.getClippedInput.bind(this);
    this.interpolate = this.interpolate.bind(this);
    this.interpolateSegment = this.interpolateSegment.bind(this);

    this.clipHelperClamp = this.clipHelperClamp.bind(this);
    this.clipHelperZero = this.clipHelperZero.bind(this);
  }

  getClippedInput(t) {
    if ( (t >= this.t[0] && t <= this.t[this.length-1]) ) {
      return t;
    } else {
      return this.clipHelper(t);
    }
  }

  clipHelperClamp(t) {
    return Math.max(this.t[0], Math.min(t, this.t[this.length-1]));
  }

  clipHelperZero(t) {
    return 0;
  }

  interpolate(t) {
    t = this.getClippedInput(t);
    let tIndex = this.t.indexOf(t);
    if (tIndex > -1) {
      return this.x[tIndex];
    }
    let k = 1;
    while (t > this.t[k]) {
      k++;
    }
    k--;

    return this.interpolateSegment(k, t-this.t[k]);
  }

  interpolateSegment(kIndex, deltaT) {
    throw new Error('Subclasses of AbstractInterpolator must override the interpolate() method.');
  }
}

class LinearInterpolator extends AbstractInterpolator {
  interpolateSegment(kIndex, deltaT) {
    let m = (this.x[kIndex+1] - this.x[kIndex]) / (this.t[kIndex+1] - this.t[kIndex]);
    return m * deltaT + this.x[kIndex];
  }
}

class CubicInterpolator extends AbstractInterpolator {
  interpolateSegment(kIndex, deltaT) {
    let m0, m1;
    if (kIndex === 0) {
      m0 = 0;
      // m0 = (this.x[kIndex+1]-this.x[kIndex])/(2*(this.t[kIndex+1]-this.t[kIndex]));
    } else {
      m0 = (this.x[kIndex+1]-this.x[kIndex-1])/(this.t[kIndex+1]-this.t[kIndex-1]);
    }
    if (kIndex === this.length-2) {
      m1 = 0;
      // m1 = (this.x[kIndex+1]-this.x[kIndex])/(2*(this.t[kIndex+1]-this.t[kIndex]));
    } else {
      m1 = (this.x[kIndex+2]-this.x[kIndex])/(this.t[kIndex+2]-this.t[kIndex]);
    }

    let segmentT = this.t[kIndex+1] - this.t[kIndex];

    let mappedT = deltaT / segmentT;
    let mappedT2 = mappedT * mappedT;
    let mappedT3 = mappedT2 * mappedT;
    let h00 = 2 * mappedT3 - 3 * mappedT2 + 1;
    let h10 = mappedT3 - 2 * mappedT2 + mappedT;
    let h01 = -2 * mappedT3 + 3 * mappedT2;
    let h11 = mappedT3 - mappedT2;

    return (
      h00 * this.x[kIndex] +
      h10 * segmentT * m0 +
      h01 * this.x[kIndex+1] +
      h11 * segmentT * m1
    );
  }
}

function Smooth(pointPairs, method='cubic', clip='clamp') {
  let InterpolationClass = {
    linear: LinearInterpolator,
    cubic: CubicInterpolator,
  }[method];
  if (!InterpolationClass) {
    throw new TypeError("Invalid method: " + method);
  }
  let clippinHandleing = {
    clamp: 'clamp',
    clip: 'clip',
  }[clip];
  if (!clippinHandleing) {
    throw new TypeError("Invalid clip: " + clip);
  }
  return new InterpolationClass(pointPairs, clippinHandleing).interpolate;
}

export default Smooth;
