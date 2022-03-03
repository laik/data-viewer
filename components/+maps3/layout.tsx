import React from 'react';
import { bind } from '../../core/utils';
import { Bmap3 } from '../bmap/bmap3';
import { withMapApi } from '../bmap/wrapper';
import hp from './data/hp.json';
import lw from './data/lw.json';

@withMapApi
@bind()
export default class Layout extends React.Component {
    bmap: Bmap3;

    convert(src: number[][]): any {
        let paths = [];
        for (let i = 0; i < src.length; i++) {
            const points = src[i];
            let lng = points[0];
            let lat = points[1];
            paths.push(new BMapGL.Point(Number(lng), Number(lat)));
        }
        return paths;
    }
    convert2(src: number[][]): any {
        let paths = [];
        for (let i = 0; i < src.length; i++) {
            const points = src[i];
            let lng = points[0];
            let lat = points[1];
            paths.push([lng, lat]);
        }
        return paths;
    }

    ref(ref: Bmap3) {
        ref ? this.bmap = ref : null;
    }

    onClick(e) {
        console.log('---->e', e);
        this.bmap.put(this.convert(lw), 200);
        this.bmap.put(this.convert(hp), 200)
    }

    render() {
        return <Bmap3
            center={'广州市'}
            zoom={13}
            ref={this.ref}
            onClick={this.onClick}
            style={{ width: '100%', height: '100%' }}
        />
    }

}
