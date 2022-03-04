import { observable } from 'mobx';
import React from 'react';
import { bind } from '../../core/utils';
import { BaiduMap } from '../bmap';
import { BMapTrackAnimation } from '../bmap/animation';
import { BMapPrism } from '../bmap/custom-overlay';
import { withMapApi } from '../bmap/wrapper';
import hp from './data/hp.json';
import lw from './data/lw.json';

function convert<T = [lng: number, lat: number][] | []>(src: number[][]): T {
    const dst: T = {} as T;
    src.forEach((row) => {
        const [x, y] = row;
        dst[x] = y;
    });
    return dst;
}

@withMapApi
@bind()
export default class Layout extends React.Component {
    @observable view = null;
    @observable map: BMapGL.Map = null;
    @observable baidu: BaiduMap = null;

    convert(src: number[][]): any {
        let paths = [];
        for (let i = 0; i < src.length; i++) {
            paths.push([src[i][0], src[i][1]]);
        }
        return paths;
    }

    handleBMapPrismClick(e) {
        console.log('---->e', e.target);
        console.log('---->bmapRef', this.map);
        console.log('---->view', this.view);

        console.log("---mapview", this.baidu.mapvglView);
        this.baidu.open()
        // this.baidu.addViewLayer(
        //     <MapvglLayer
        //         map={this.map}
        //         view={this.view}
        //         type='CircleLayer'
        //         data={[
        //             {
        //                 geometry: {
        //                     type: 'Point',
        //                     coordinates: [113.420416, 23.172711],
        //                 },
        //             },
        //         ]}
        //         options={{
        //             color: 'rgba(50, 50, 200, 1)',
        //             shape: 'circle', // 默认为圆形，可传square改为正方形
        //             blend: 'lighter',
        //             size: 200,
        //         }}
        //     />
        // );

        const data = {
            type: 'CircleLayer',
            options: {
                color: 'rgba(50, 50, 200, 1)',
                shape: 'circle',
                blend: 'lighter',
                size: 200,
            },
            data: [{
                geometry: {
                    type: 'Point',
                    coordinates: [113.28527394032481, 23.19403615187512],
                },
            },
            ],
            map: this.mapRef,
            view: this.viewRef,
        };


        // this.baidu && this.baidu.addViewLayer(<MapvglLayer
        //     type='CircleLayer'
        //     options={{
        //         color: 'rgba(50, 50, 200, 1)',
        //         shape: 'circle',
        //         blend: 'lighter',
        //         size: 200,
        //     }}
        //     data={[
        //         {
        //             geometry: {
        //                 type: 'Point',
        //                 coordinates: [113.28527394032481, 23.19403615187512],
        //             },
        //         },
        //     ]} map={this.map} view={this.view} />
        // )
    }

    mapRef(ref) { this.map = ref }

    viewRef(ref) { this.view = ref }

    mapOnCilck(e) {
        switch (this.map.getZoom()) {
            case 12:
                this.map.setZoom(16);
                this.map.setTilt(0);
                break;
            case 16:
                this.map.setZoom(18);
                this.map.setTilt(45);
                break;
            case 18:
                this.map.setZoom(20);
                this.map.setTilt(45);
                break;
            case 20:
                this.map.setZoom(12);
                break;
        }
        alert(e.point.lng + ", " + e.point.lat);
        // this.map.setCenter(e.point);
    }

    districtsPrism = (data: any[]): JSX.Element => {
        let path = [];
        for (let i = 0; i < data.length; i++) {
            path.push(new BMapGL.Point(Number(data[i][0]), Number(data[i][1])));
        }
        return <BMapPrism
            points={path}
            altitude={3000}
            topFillColor={'#5679ea'}
            topFillOpacity={0.6}
            sideFillColor={'#5679ea'}
            sideFillOpacity={0.9}
            enableMassClear={true}
            listeners={{ 'click': this.handleBMapPrismClick }}
        />;
    }

    trackAnimation = (data: any[]): JSX.Element => {
        let path = [];
        for (let i = 0; i < data.length; i++) {
            path.push(new BMapGL.Point(Number(data[i][0]), Number(data[i][1])));
        }
        return <BMapTrackAnimation
            poyline={new BMapGL.Polyline(path)}
            overallView={true}
            tilt={30}
            duration={20000}
            delay={3000}
        />
    }

    render() {
        let hppath = [];
        for (let i = 0; i < hp.length; i++) {
            const points = hp[i];
            let lng = points[0];
            let lat = points[1];
            hppath.push(new BMapGL.Point(Number(lng), Number(lat)));
        }

        return (
            <BaiduMap
                ref={(ref) => { ref ? this.map = ref.mapRef : null; ref ? this.view = ref.viewRef : null; }} useView={true}
                mapRef={this.mapRef} viewRef={this.viewRef}
                mapOnCilck={this.mapOnCilck}
                baiduRef={(ref) => { this.baidu = ref }}
            >
                {this.districtsPrism(lw)}
                {this.districtsPrism(hp)}

            </BaiduMap>
        );
    }
}
