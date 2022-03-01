import React from 'react';
import { BaiduMap } from '../bmap';
import { BMapMapvglLayer, BMapMapvglView } from '../bmap/vgl';
import rs from './chinalocation.json';
export default class Layout extends React.Component {
    componentDidMount() { }
    render() {

        var data1 = [];
        var data2 = [];
        var data3 = [];
        for (var i = 0; i < rs[0].length; i++) {
            var geoCoord = rs[0][i].geoCoord;
            data1.push({
                geometry: {
                    type: 'Point',
                    coordinates: geoCoord
                },
                properties: {
                    time: Math.random() * 100
                }
            });
        }
        for (var i = 0; i < rs[1].length; i++) {
            var geoCoord = rs[1][i].geoCoord;
            data2.push({
                geometry: {
                    type: 'Point',
                    coordinates: geoCoord
                },
                properties: {
                    time: Math.random() * 10
                }
            });
        }

        for (var i = 0; i < rs[2].length; i++) {
            var geoCoord = rs[2][i].geoCoord;
            data3.push({
                geometry: {
                    type: 'Point',
                    coordinates: geoCoord
                },
                properties: {
                    time: Math.random() * 10
                }
            });
        }

        return (
            <BaiduMap>
                <BMapMapvglView effects={['bright']}>
                    <BMapMapvglLayer
                        type='RippleLayer'
                        data={data1}
                        options={{
                            blend: 'wave',
                            radius: 100,
                            size: 5,
                            color: 'rgba(255, 77, 77, 0.8)',
                        }}
                    />
                    <BMapMapvglLayer
                        type='RippleLayer'
                        data={data2}
                        options={{
                            blend: 'wave',
                            radius: 100,
                            size: 5,
                            color: 'rgba(255, 204, 0, 0.6)',
                        }}
                    />
                    <BMapMapvglLayer
                        type='RippleLayer'
                        data={data3}
                        options={{
                            blend: 'wave',
                            radius: 100,
                            size: 5,
                            color: 'rgba(255, 255, 0, 0.6)',
                        }}
                    />

                    <BMapMapvglLayer
                        type='FanLayer'
                        data={[{
                            geometry: {
                                type: 'Point',
                                coordinates: [116.392394, 39.910683]
                            }
                        }]}
                        options={{
                            color: 'rgba(50, 50, 200, 1)',
                            radius: 100,
                            size:400000,
                        }}
                    />
                    {/* <BMapMapvglLayer
                        type='TripLayer'
                        data={data3}
                        options={{
                            blend: 'lighter',
                            shape: 'circle',
                            startTime: 0,
                            endTime: 500,
                            step: 10,
                            trailLength: 100,
                            color: 'rgba(255, 77, 77, 0.8)', // 点动画图层颜色
                            data: data1,
                            size: 5
                        }}
                    /> */}
                </BMapMapvglView>
            </BaiduMap>
        );
    }
}
