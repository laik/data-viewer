import React from 'react';
import { BaiduMap } from '../bmap';
import { BMapPrism } from '../bmap/custom-overlay';
// import { BMapPrism } from '../bmap/custom-overlay';
import { BMapMapvglLayer, BMapMapvglView } from '../bmap/vgl';
import { withMapApi } from '../bmap/wrapper';
import line139 from './data/139line.json';
import hp from './data/hp.json';
import lw from './data/lw.json';

@withMapApi
export default class Layout extends React.Component {

    handleBMapPrismClick(e) {
        console.log("---->e", e.target);
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

        let line139Path = [];
        for (let i = 0; i < line139.length; i++) {
            const points = line139[i];
            let lng = points[0];
            let lat = points[1];
            line139Path.push([lng, lat]);
        }


        return (
            <BaiduMap>
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
                                coordinates: [...line139Path]
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
                                coordinates: [...line139Path]
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
                    points={lwpath}
                    altitude={200}
                    topFillColor={'#2F312F'}
                    topFillOpacity={0.6}
                    sideFillColor={'#2F312F'}
                    sideFillOpacity={0.9}
                    enableMassClear={true}
                    listeners={{ "click": this.handleBMapPrismClick }}
                />
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

            </BaiduMap>
        );
    }
}
