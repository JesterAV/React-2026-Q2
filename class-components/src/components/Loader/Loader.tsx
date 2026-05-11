import { Component } from 'react';
import './Loader.scss';

class Loader extends Component {
  render() {
    return (
      <div className='loader-container'>
        <div className='loader-container__loader'></div>
      </div>
    )
  }
}

export default Loader;