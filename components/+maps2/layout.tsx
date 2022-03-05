import { lighten } from '@jiaminghi/color';
import { observable } from 'mobx';
import React from 'react';
import { bind } from '../../core/utils';
import { BaiduMap, BMapRef } from '../bmap';
import { BMapTrackAnimation } from '../bmap/animation';
import { withMapApi } from '../bmap/wrapper';
import line139 from './data/139line.json';
import gz from './data/gz.json';
import tracks from './data/tracks.json';
import { convert, literalToPoint, Point, Region, sRGBHex, Tracks } from './tool';




const mapvgl = require('mapvgl');


@withMapApi
@bind()
export default class Layout extends React.Component {
    @observable bmapRef: BMapRef = null;
    @observable districtPrism = observable.map({});

    setzoom = (size: number) => { this.bmapRef.map.setZoom(size) }
    getzoom = (): number => { return this.bmapRef.map.getZoom() }
    zoomOut = () => { this.setzoom(this.getzoom() - 2) }
    zoomIn = () => { this.setzoom(this.getzoom() + 2) }

    disableDistrict = () => { this.bmapRef.map.clearOverlays(); }

    enableDistrict = () => {
        this.districtPrism.forEach((overlay) => { this.bmapRef.map.addOverlay(overlay) })
    }

    displayVehicleFlow = (tracks: Tracks) => {
        console.log("--->", tracks);
        const data = tracks.toPointList();
        console.log("--->", data);
        var layer = new mapvgl.LineFlowLayer({
            color: 'rgb(255, 255,0)',
            interval: 0.6,
            duration: 3,
            trailLength: 1,
            data: data,
        });
        this.bmapRef.addMapvglViewLayer('flow', layer);
        return layer;
    }

    displayVehicleFlowadAptation = (zoom: number) => {
        console.log("displayVehicleFlowadAptation", zoom);

        // if (zoom <= 10) {
        //     let viewlayer = this.bmapRef.getMapvglViewLayer('flow');
        //     viewlayer && viewlayer.setOptions({
        //         color: 'rgb(0, 255, 255)',
        //         interval: 0.7,
        //         duration: 4,
        //         trailLength: 1,
        //         // zoom: 4,
        //     });
        // } else if (zoom <= 12) {
        //     let viewlayer = this.bmapRef.getMapvglViewLayer('flow');
        //     viewlayer && viewlayer.setOptions({
        //         color: 'rgb(255, 255, 0)',
        //         interval: 0.2,
        //         duration: 4,
        //         trailLength: 2,
        //         // zoom: 4,
        //     });
        // } else
        if (zoom > 12) {
            this.disableDistrict();
        } else {
            this.enableDistrict();
        }

        if (zoom > 17) {
            this.bmapRef.disableMapvglViewLayer('flow');
        } else {
            this.bmapRef.enableMapvglViewLayer('flow');
        }

    }

    districtsAptation = (zoom: number) => {
        if (zoom <= 11) {
            // let viewlayer = this.bmapRef.getMapvglViewLayer('flow');
            // viewlayer && viewlayer.setOptions({
            //     color: 'rgb(1, 255, 255,0.5)',
            //     interval: 0.2,
            //     duration: 3,
            //     trailLength: 1,
            //     zoom: 4,
            // });
        } else if (zoom >= 17 && zoom <= 20) {

        } else if (zoom >= 21 && zoom <= 22) {
            // this.bmapRef.removeMapvglViewLayer('flow');
        }
    }

    mapLoaded = (e) => {
        //初始化3D矢量图层
        this.initDistrictsPrism(gz);
        //开启3D矢量图层
        this.enableDistrict();
        // 开启车流量线路图层
        this.displayVehicleFlow(new Tracks(tracks));
    }

    onZoomend = (e) => {
        const size = e.target.getZoom();
        if (size < 12) {
            this.bmapRef.map.setTilt(0);
        } if (size >= 12 && size < 14) {
            this.bmapRef.map.setTilt(30);
        } else if (size >= 14 && size < 16) {
            this.bmapRef.map.setTilt(55);
        }
        else if (size >= 16 && size <= 22) {
            this.bmapRef.map.setTilt(65);
        }

        this.displayVehicleFlowadAptation(size);
    }

    onZoomstart = (e) => {
        const size = e.target.getZoom();
    }

    rightCilck = (e) => {
        this.zoomOut();
        // this.disableDistrict() // 测试关闭3D矢量图层
    }

    leftCilck = (e) => {
        this.zoomIn();
        // this.enableDistrict() // 测试开启3D矢量图层
        // this.bmapRef.map.setCenter(literalToPoint(e.target.lnglat));
        console.log(
            "map zoom", this.bmapRef.map.getZoom(),
            "map evt", e,
            "latlng", e.latlng,
        )
        // this.bmapRef.map.setCenter(e.latlng);
    }

    prism = (key: number, name: string, center: Point, points: any): BMapGL.Overlay => {
        const fillColor = sRGBHex[key];
        const fillOpacity = 0;
        const overlay = new BMapGL.Prism(
            points,
            0,
            {
                topFillColor: fillColor,
                topFillOpacity: fillOpacity,
                sideFillColor: fillColor,
                sideFillOpacity: fillOpacity,
                enableMassClear: true,
            });

        overlay.addEventListener('click', (e) => {
            alert("onclick")
            this.bmapRef.map.setCenter(literalToPoint(center));
        })
        overlay.addEventListener('mouseover', (e) => {
            // this.bmapRef.map.setCenter(literalToPoint(center));
            e.target.setTopFillColor(lighten(fillColor));
            e.target.setTopFillOpacity(0.5);
        })
        overlay.addEventListener('mouseout', (e) => {
            e.target.setTopFillColor(fillColor);
            e.target.setTopFillOpacity(fillOpacity);
        })
        return overlay;
    }


    initDistrictsPrism = (region: Region) => {
        for (let i = 0; i < region.features.length; i++) {
            const feature = region.features[i];
            const { geometry, properties } = feature;
            const { coordinates } = geometry;

            for (let j = 0; j < coordinates.length; j++) {
                const coordinate = coordinates[j];
                for (let k = 0; k < coordinate.length; k++) {
                    const area = coordinate[k];
                    this.districtPrism.set(
                        properties.name,
                        this.prism(
                            i,
                            properties.name,
                            properties.center,
                            convert(area),
                        )
                    );
                }
            }
        }
    }

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
                center={'广州市'}
                ref={(ref: any) => { ref ? (this.bmapRef = ref) : null; }}
                zoomControl={false}
                mapTypeControl={false}
                scaleControl={false}
                navigationControl={false}
                listeners={{
                    onClick: this.leftCilck,
                    onRightclick: this.rightCilck,
                    onLoad: this.mapLoaded,
                    onZoomend: this.onZoomend,
                    onZoomstart: this.onZoomstart,
                }}>
                {this.trackAnimation(line139)}
            </BaiduMap>
        );
    }
}