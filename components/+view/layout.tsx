import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ObjectStore } from '../../core';
import { IStore, Store, storeables } from '../../core/store.wrap';
import normal from '../../theme/normal.json';
import { ChartMasonry } from '../charts';
import { viewStore } from './store';



@observer
@storeables([{ store: viewStore, iswatch: true }])
export default class View<T extends ObjectStore<any>> extends React.Component implements IStore<T> {
  stores: Store<T>[];

  getStore(key: keyof T): T {
    return this.stores.find(s => s.store.constructor.name === key).store;
  }

  @computed get options() {
    const options = viewStore.candlesticks();
    console.log("options---->", options);
    return options;
  }

  render() {
    return <ChartMasonry
      options={this.options}
      theme={normal}
    />
  }
}