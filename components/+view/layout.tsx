import React from 'react';
import { options, ChartMasonry } from '../charts';

export default class View extends React.Component {
  render() {
    return <ChartMasonry options={options}/>
  }
}