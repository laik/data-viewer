import { observable } from 'mobx';
import React from 'react';
import { bind } from '../../core/utils';
import { BaiduMap, BMapRef } from '../bmap';
import { BMapTrackAnimation } from '../bmap/animation';
import { BMapPrism } from '../bmap/custom-overlay';
import { withMapApi } from '../bmap/wrapper';
import line139 from './data/139line.json';
import gz from './data/gz.json';
// import lw from './data/lw.json';
import { convert, literalToPoint, Point, Points, Region } from './tool';



const mapvgl = require('mapvgl');



function colorRGB() {
    return '#' + (function (h) {
        return new Array(7 - h.length).join("0") + h
    })((Math.random() * 0x1000000 << 0).toString(16))

}

@withMapApi
@bind()
export default class Layout extends React.Component {
    @observable bmapRef: BMapRef = null;

    displayVehicleFlow = () => {

        return () => { };
    }

    mapOnCilck(e) {
        switch (this.bmapRef.map.getZoom()) {
            // case 12:
            //     this.bmapRef.map.setZoom(16);
            //     this.bmapRef.map.setTilt(0);
            //     var layer = new mapvgl.TextLayer({
            //         color: '#fff',
            //         fontFamily: 'Microsoft Yahei',
            //         fontSize: 14,
            //         flat: false,
            //         collides: true,
            //         offset: [0, 0],
            //         padding: [2, 2],
            //         data: [
            //             {
            //                 geometry: {
            //                     type: 'Point',
            //                     coordinates: [113.420416, 23.172711],
            //                 },
            //                 properties: {
            //                     text: '文字', // 展示的文字
            //                 },
            //             },
            //         ],
            //     });
            //     this.bmapRef.addMapvglViewLayer('circle', layer);
            //     break;
            // case 16:
            //     this.bmapRef.map.setZoom(18);
            //     this.bmapRef.map.setTilt(45);
            //     BMapTrackAnimation.start()
            //     break;
            // case 18:
            //     this.bmapRef.map.setZoom(20);
            //     this.bmapRef.map.setTilt(45);
            //     BMapTrackAnimation.cancel()
            //     break;
            // case 22:
            //     this.bmapRef.map.setZoom(12);
            //     this.bmapRef.removeMapvglViewLayer('circle');
            //     break;
        }
    }

    district = (key: string, name: string, center: Point, area: Points): JSX.Element => {
        return <BMapPrism
            key={key}
            points={convert(area)}
            altitude={3000}
            topFillColor={colorRGB()}
            topFillOpacity={0.8}
            sideFillColor={colorRGB()}
            sideFillOpacity={0.9}
            enableMassClear={true}
            listeners={{
                click: (e) => {
                    console.log("click district", name);
                    this.bmapRef.map.setZoom(13);
                    this.bmapRef.map.setTilt(45);
                    this.bmapRef.map.setCenter(literalToPoint(center));
                }
            }}
        />
    }

    districts = (region: Region): JSX.Element[] => {
        let elements: JSX.Element[] = [];
        for (let i = 0; i < region.features.length; i++) {
            const feature = region.features[i];
            const { geometry, properties } = feature;
            const { coordinates } = geometry;

            for (let j = 0; j < coordinates.length; j++) {
                const coordinate = coordinates[j];
                for (let k = 0; k < coordinate.length; k++) {
                    const area = coordinate[k];
                    console.log("area", area);
                    const district = this.district(
                        `${i}-${j}-${k}`,
                        properties.name,
                        properties.center,
                        area);
                    console.log("district", district);
                    elements.push(district);
                }
            }
        }



        // let path2 = [];
        // for (let i = 0; i < lw.features[0].geometry.coordinates[0].length; i++) {
        //     const coordinate = lw.features[0].geometry.coordinates[0][i];
        //     const district = this.district(
        //         `${i}`,
        //         lw.features[0].properties.name,
        //         lw.features[0].properties.center,
        //         convert(coordinate),
        //     );
        //     elements.push(district);
        // }

        // elements.push(<BMapPrism
        //     points={path2}
        //     altitude={1000}
        //     topFillColor={'#5679ee'}
        //     topFillOpacity={0.6}
        //     sideFillColor={'#5679ee'}
        //     sideFillOpacity={0.9}
        //     enableMassClear={true}
        //     listeners={{
        //         click: (e) => {
        //             console.log("click lw", e)
        //             let layer = new mapvgl.TextLayer({
        //                 color: '#fff',
        //                 fontFamily: 'Microsoft Yahei',
        //                 fontSize: 14,
        //                 flat: false,
        //                 collides: true,
        //                 offset: [0, 0],
        //                 padding: [2, 2],
        //                 data: [
        //                     {
        //                         geometry: {
        //                             type: 'Point',
        //                             coordinates: [lw[0][0], lw[0][1]],
        //                         },
        //                         properties: {
        //                             text: '文字', // 展示的文字
        //                         },
        //                     },
        //                 ],
        //             });
        //             this.bmapRef.addMapvglViewLayer('circle', layer);

        //         }
        //     }}
        // />
        // )
        return elements;
    };

    trackAnimation = (data: any[]): JSX.Element => {
        let path = [];
        for (let i = 0; i < data.length; i++) {
            path.push(new BMapGL.Point(Number(data[i][0]), Number(data[i][1])));
        }
        return (
            <BMapTrackAnimation
                poyline={new BMapGL.Polyline(path)}
                overallView={true}
                tilt={30}
                duration={20000}
                delay={3000}
            />
        );
    };

    render() {
        return (
            <BaiduMap
                ref={(ref: any) => {
                    ref ? (this.bmapRef = ref) : null;
                }}
                zoomControl={true}
                listeners={{
                    onClick: this.mapOnCilck,
                }}>
                {this.districts(gz)}
                {this.trackAnimation(line139)}
            </BaiduMap>
        );
    }
}
