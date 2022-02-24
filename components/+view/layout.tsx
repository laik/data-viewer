import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { storeables } from '../../core/store.wrap';
import normal from '../../theme/normal.json';
import { ChartMasonry, options } from '../charts';
import { viewStore } from './store';

@observer
@storeables([{ store: viewStore, iswatch: true }])
export default class View extends React.Component {
  @computed get options() {
    return options;
  }

  render() {
    return <ChartMasonry
      options={this.options}
      theme={normal}
    />
  }
}