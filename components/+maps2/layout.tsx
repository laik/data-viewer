import { observable } from 'mobx';
import React from 'react';
import { bind } from '../../core/utils';
import { BaiduMap } from '../bmap';
import { BMapTrackAnimation } from '../bmap/animation';
import { BMapPrism } from '../bmap/custom-overlay';
import { withMapApi } from '../bmap/wrapper';
import line139 from './data/139line.json';
import hp from './data/hp.json';

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
                this.map.setCenter(e.latlng);
                this.map.setZoom(16);
                this.map.setTilt(0);
                // this.map.setTrafficOn();
                break;
            case 16:
                this.map.setCenter(e.latlng);
                this.map.setZoom(18);
                this.map.setTilt(45);
                this.map.setTrafficOff();
                break;
            case 18:
                this.map.setCenter(e.latlng);
                this.map.setZoom(20);
                this.map.setTilt(65);
                this.map.setTrafficOff();
                this.map.enableScrollWheelZoom();
                BMapTrackAnimation.start();
                break;
            case 20:
                this.map.setCenter(e.latlng);
                this.map.setZoom(12);
                this.map.setTrafficOff();
                break;
            default:
                BMapTrackAnimation.cancel();
                this.map.setZoom(12);
                this.map.setTrafficOff();
        }


        console.log("event", e);
    }

    onrightclick(e) {
        console.log("rightclick", e);
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
        const pl = new BMapGL.Polyline(path);
        // var path = [{
        //     'lng': 116.297611,
        //     'lat': 40.047363
        // }, {
        //     'lng': 116.302839,
        //     'lat': 40.048219
        // }, {
        //     'lng': 116.308301,
        //     'lat': 40.050566
        // }, {
        //     'lng': 116.305732,
        //     'lat': 40.054957
        // }, {
        //     'lng': 116.304754,
        //     'lat': 40.057953
        // }, {
        //     'lng': 116.306487,
        //     'lat': 40.058312
        // }, {
        //     'lng': 116.307223,
        //     'lat': 40.0563
        // }];
        // var point = [];
        // for (var i = 0; i < path.length; i++) {
        //     point.push(new BMapGL.Point(path[i].lng, path[i].lat));
        // }
        // var pl = new BMapGL.Polyline(point);

        return <BMapTrackAnimation
            poyline={pl}
            overallView={true}
            tilt={55}
            zoom={18}
            
            duration={30000}
            delay={500}
        />
    }

    render() {
        return (
            <BaiduMap
                ref={(ref) => { ref ? this.map = ref.mapRef : null; ref ? this.view = ref.viewRef : null; }} useView={true}
                mapRef={this.mapRef}
                viewRef={this.viewRef}
                mapOnCilck={this.mapOnCilck}
                baiduRef={(ref) => { this.baidu = ref }}
            >
                {/* {this.districtsPrism(lw)} */}
                {this.districtsPrism(hp)}
                {this.trackAnimation(line139)}

            </BaiduMap>
        );
    }
}