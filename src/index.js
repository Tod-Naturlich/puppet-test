import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GirlView from './GirlView';
import AgeTest from './AgeTest';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AgeTest />, document.getElementById('root'));
registerServiceWorker();
