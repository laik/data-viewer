import React from 'react';
import { BaiduMap } from '../bmap';
import { BMapPrism } from '../bmap/custom-overlay';
import { withMapApi } from '../bmap/wrapper';
import hp from './data/hp.json';
import lw from './data/lw.json';

@withMapApi
export default class Layout extends React.Component {

    handleBMapPrismClick(e) {
        console.log("---->e", e.target);
    }


    render() {
        let lwpath = [];
        for (let i = 0; i < lw.length; i++) {
            const points = lw[i];
            let lng = points[0];
            let lat = points[1];
            lwpath.push(new BMapGL.Point(Number(lng), Number(lat)));
        }
        let hppath = [];
        for (let i = 0; i < hp.length; i++) {
            const points = hp[i];
            let lng = points[0];
            let lat = points[1];
            hppath.push(new BMapGL.Point(Number(lng), Number(lat)));
        }

        return (
            <BaiduMap>
                <BMapPrism
                    points={lwpath}
                    altitude={3000}
                    topFillColor={'#5679ea'}
                    topFillOpacity={0.6}
                    sideFillColor={'#5679ea'}
                    sideFillOpacity={0.9}
                    enableMassClear={true}
                    listeners={{ "click": this.handleBMapPrismClick }}
                />
                <BMapPrism
                    points={hppath}
                    altitude={3000}
                    topFillColor={'#5679ea'}
                    topFillOpacity={0.6}
                    sideFillColor={'#5679ea'}
                    sideFillOpacity={0.9}
                    enableMassClear={true}
                    listeners={{ "click": this.handleBMapPrismClick }}
                />

            </BaiduMap>
        );
    }
}
