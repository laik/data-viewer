import * as echarts from 'echarts';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { MapApiLoaderHOC } from 'react-bmap';
import { ObjectStore } from '../../core';
import { IStore, Store, storeables } from '../../core/store.wrap';
import { FlowLine, flowLineStore } from './store';





@observer
@storeables([{ store: flowLineStore, iswatch: true }])
class Maps<T extends ObjectStore<any>> extends React.Component implements IStore<T> {
  stores: Store<T>[];

  getStore(key: keyof T): T {
    return this.stores.find(s => s.store.constructor.name === key).store;
  }

  @computed get option() {
    const fl = new FlowLine({ kind: 'flowline', uid: '1', version: '1' });
    return fl.options();
  }

  render() {
    var chartDom = document.getElementById("map");

    var chart = echarts.init(chartDom, "");
    chart.setOption(this.option);

    // return <Map center={{ lng: 116.402544, lat: 39.928216 }} zoom="11">
    //   <Marker position={{ lng: 116.402544, lat: 39.928216 }} />
    //   <NavigationControl />
    //   <InfoWindow
    //     position={{ lng: 116.402544, lat: 39.928216 }}
    //     text="内容"
    //     title="标题"
    //   />
    // </Map>
    return <div>{chart}</div>
  }
}
export default MapApiLoaderHOC({ ak: 'l1i69UZi7aKCrzchRYRvPuUUQSvupFYO' })(Maps)
