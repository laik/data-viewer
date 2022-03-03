import React from 'react';
import { bind } from '../../core/utils';
import { BaiduMap } from '../bmap';
import { BMapTrackAnimation } from '../bmap/animation';
import { BMapPrism } from '../bmap/custom-overlay';
// import { BMapPrism } from '../bmap/custom-overlay';
import { BMapMapvglLayer, BMapMapvglView } from '../bmap/vgl';
import { withMapApi } from '../bmap/wrapper';
import line139Path from './data/139line.json';
import hp from './data/hp.json';
import lw from './data/lw.json';

@withMapApi
@bind()
export default class Layout extends React.Component {
    map: BaiduMap = null;

    inject(map: BaiduMap) { this.map = map }

    handleBMapPrismClick(e) {
        console.log('---->e', e.target);
        // this.map.mapRef.setZoom(22);
        this.map.addChild(<BMapPrism
            points={this.convert(lw)}
            altitude={200}
            topFillColor={'#2F312F'}
            topFillOpacity={0.6}
            sideFillColor={'#2F312F'}
            sideFillOpacity={0.9}
            enableMassClear={true}
            listeners={{ "click": this.handleBMapPrismClick }}
        />)
    }

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


        var pl = new BMapGL.Polyline(hppath);
        return (
            <BaiduMap inject={this.inject}>
                <BMapMapvglView effects={['bright']}>
                    <BMapMapvglLayer
                        type='LineFlowLayer'
                        options={{
                            color: 'rgba(34, 246, 114)',
                            interval: 0.1,
                            duration: 2,
                            trailLength: 0.5,
                            zoom: 8
                        }}
                        data={[{
                            geometry: {
                                type: 'LineString',
                                coordinates: this.convert2(line139Path),
                            }
                        }]} />

                    <BMapMapvglLayer
                        type='LineTripLayer'
                        options={{
                            color: 'rgba(230, 242, 30)',
                            step: 10,
                            trailLength: 200,
                            startTime: 0,
                            endTime: 1000,
                        }}
                        data={[{
                            geometry: {
                                type: 'LineString',
                                coordinates: this.convert2(line139Path),
                            }
                        }]} />
                    {/* 
                    <BMapMapvglLayer
                        type='MaskLayer'
                        options={{
                            color: 'rgba(230, 242, 30)',
                        }}
                        data={[{
                            geometry: {
                                type: 'Polygon',
                                coordinates: this.convert(hp),
                            }
                        }]} /> */}




                </BMapMapvglView>


                <BMapPrism
                    points={hppath}
                    altitude={200}
                    topFillColor={'#2F312F'}
                    topFillOpacity={0.6}
                    sideFillColor={'#2F312F'}
                    sideFillOpacity={0.9}
                    enableMassClear={true}
                    listeners={{ "click": this.handleBMapPrismClick }}
                />

                <BMapTrackAnimation
                    poyline={pl}
                    overallView={true}
                    tilt={30}
                    duration={20000}
                    delay={3000}
                />

            </BaiduMap>
        );
    }
}
