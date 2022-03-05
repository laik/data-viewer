import { lighten } from '@jiaminghi/color';
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
import { convert, literalToPoint, Point, Points, Region, sRGBHex } from './tool';

const mapvgl = require('mapvgl');


@withMapApi
@bind()
export default class Layout extends React.Component {
    @observable bmapRef: BMapRef = null;

    setzoom = (size: number) => { this.bmapRef.map.setZoom(size) }
    getzoom = (): number => { return this.bmapRef.map.getZoom() }
    enlarge = () => { this.setzoom(this.getzoom() - 2) }

    displayVehicleFlow = (open: boolean) => {
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

            default:

        }
        console.log(
            "map zoom", this.bmapRef.map.getZoom(),
            "map evt", e,
        )
    }


    componentDidMount(): void {
    }

    district = (key: string, name: string, center: Point, area: Points): JSX.Element => {
        const fillColor = sRGBHex[key];
        const fillOpacity = 0;
        return <BMapPrism
            key={key}
            points={convert(area)}
            altitude={100}
            topFillColor={fillColor}
            topFillOpacity={fillOpacity}
            sideFillColor={fillColor}
            sideFillOpacity={fillOpacity}
            enableMassClear={true}
            listeners={{
                click: (e) => {
                    console.log("click district", name, "event", e);
                    this.getzoom() != 12 ? this.bmapRef.map.setZoom(12) : null;
                    this.bmapRef.map.setCenter(literalToPoint(center));
                    // this.bmapRef.map.setTilt(30);
                },
                mouseover: (e) => {
                    const fillColor2 = lighten(sRGBHex[key]);
                    e.target.setTopFillColor(fillColor2);
                    e.target.setTopFillOpacity(0.5);
                    console.log("mouseover district", name, "event", e, fillColor2);
                },
                mouseout: (e) => {
                    console.log("mouseout district", name, "event", e);
                    e.target.setTopFillColor(fillColor);
                    e.target.setTopFillOpacity(fillOpacity);
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
                    const district = this.district(
                        `${i}`,
                        properties.name,
                        properties.center,
                        area);
                    elements.push(district);
                }
            }
        }
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
                    onRightclick: (e) => {
                        console.log("rightclick", e)
                        this.enlarge();
                    }
                }}>
                {this.districts(gz)}
                {this.trackAnimation(line139)}
            </BaiduMap>
        );
    }
}
