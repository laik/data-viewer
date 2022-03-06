import { lighten } from '@jiaminghi/color';
import { observable } from 'mobx';
import Image from 'next/image';
import React from 'react';
import { bind } from '../../core/utils';
import { BaiduMap, BMapRef } from '../bmap';
import { withMapApi } from '../bmap/wrapper';
import gz from './data/gz.json';
import tracks from './data/tracks.json';
import { convert, literalToPoint, Point, Region, sRGBHex, Tracks } from './tool';
const mapvgl = require('mapvgl');

export function Car() {
    return <Image src="./car.svg" alt="car" width="64" height="64" />
}

const car = require('./vehicle.png');

@withMapApi
@bind()
export default class Layout extends React.Component {
    @observable bmapRef: BMapRef = null;
    @observable districtPrism = observable.map({});
    @observable ani: BMapGLLib.TrackAnimation = null;
    @observable aniCancel = null;

    setzoom = (size: number) => { this.bmapRef.map.setZoom(size) }
    getzoom = (): number => { return this.bmapRef.map.getZoom() }
    zoomOut = () => { this.setzoom(this.getzoom() - 2) }
    zoomIn = () => { this.setzoom(this.getzoom() + 2) }

    // 关闭行政区域覆盖
    disableDistrict = () => { this.bmapRef.map.clearOverlays(); }
    // 开启行政区域覆盖
    enableDistrict = () => {
        this.districtPrism.forEach((overlay) => { this.bmapRef.map.addOverlay(overlay) })
    }

    // 显示车流
    displayVehicleFlow = (tracks: Tracks) => {
        this.bmapRef.addMapvglViewLayer('flow',
            new mapvgl.LineFlowLayer({
                color: '#B8E90B',
                interval: 0.6,
                duration: 3,
                trailLength: 1,
                data: tracks.pointList(),
            })
        );
    }
    //关闭车流
    disableVehicleFlow = () => { this.bmapRef.disableMapvglViewLayer('flow') }
    //开启车流
    enableVehicleFlow = () => { this.bmapRef.enableMapvglViewLayer('flow') }

    displayVehicleFlowadAptation = (zoom: number) => {
        console.log("displayVehicleFlowadAptation", zoom);
        if (zoom > 12) {
            this.disableDistrict();
        } else {
            this.enableDistrict();
        }

        if (zoom > 14) {
            // this.disableVehicleFlow();
            this.enableCarPostiton();
        } else {
            this.enableVehicleFlow();
            this.disableCarPostiton();
        }
    }

    districtsAptation = (zoom: number) => { }

    mapLoaded = (e) => {
        //初始化3D矢量图层
        this.initDistrictsPrism(gz);
        //开启3D矢量图层
        this.enableDistrict();

        let _tracks = new Tracks(tracks);
        // 开启车流量线路图层
        this.displayVehicleFlow(_tracks);
        // 开启车最终点
        this.displayCarPostiton(_tracks);

        // this.enableCarPostiton();
        this.bmapRef.map.enableContinuousZoom()
    }

    onZoomend = (e) => {
        const size = e.target.getZoom();
        if (size < 12) {
            this.bmapRef.map.setTilt(0);
        } else if (size === 12) {
        } else if (size > 12 && size < 14) {
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

    rightCilck = (e) => { this.ani && this.aniCancel(); this.zoomOut(); }
    leftdbCilck = (e) => { this.zoomIn(); }

    displayCarPostiton = (tracks: Tracks) => {
        this.bmapRef.putMapvglViewLayer('car',
            new mapvgl.IconLayer({
                icon: './vehicle.png',
                enablePicked: true, // 是否可以拾取
                autoSelect: true, // 根据鼠标位置来自动设置选中项
                // flat: true,   // 平躺在地面上
                selectedColor: '#B8F705', // 选中项颜色
                // opacity: 0.8,
                data: tracks.lastPointList(),
                onClick: (e) => { // 点击事件
                    if (e.dataIndex === -1) { return }
                    alert(`播放vid${tracks.getVid(e.dataIndex)}...`);
                    if (this.ani) {
                        this.aniCancel();
                    }
                    const polyLinPath = tracks.getPolyLines(e.dataIndex);
                    const duration = tracks.getDuration(e.dataIndex);
                    // 声明动画对象
                    this.disableVehicleFlow();
                    this.disableCarPostiton();
                    this.bmapRef.map.centerAndZoom(polyLinPath[0], 18);
                    let pl = new BMapGL.Polyline(polyLinPath,
                        {
                            strokeColor: '#FF009D',
                            strokeWeight: 0.5,
                            strokeOpacity: 2,
                            strokeStyle: 'solid',
                            enableMassClear: true,
                            enableClicking: true,
                        }
                    )
                    this.ani = new BMapGLLib.TrackAnimation(
                        this.bmapRef.map,
                        pl,
                        {
                            duration: polyLinPath.length * 1500, // 通过轨迹行程时间计算 // 轨迹点个数*1500 回放
                            delay: 500,
                            overallView: true,
                            tilt: 70,
                            zoom: 18,
                        });
                    // 监听事件                    
                    // 开始播放动画
                    this.ani.start();
                    this.aniCancel = () => {
                        if (!this.ani) { return; }
                        this.ani.cancel();
                        this.bmapRef.map.removeOverlay(pl);
                        this.ani = null;
                    }
                    setTimeout(() => {
                        this.aniCancel();
                    }, duration);

                },
            }),
        );
    }

    enableCarPostiton = () => { this.bmapRef.enableMapvglViewLayer('car') }
    disableCarPostiton = () => { this.bmapRef.disableMapvglViewLayer('car') }

    prism = (key: number, name: string, center: Point, points: any): BMapGL.Overlay => {
        const fillColor = sRGBHex[key];
        const fillOpacity = 0;
        const overlay = new BMapGL.Prism(points, 0, {
            topFillColor: fillColor,
            topFillOpacity: fillOpacity,
            sideFillColor: fillColor,
            sideFillOpacity: fillOpacity,
            enableMassClear: true,
        });
        overlay.addEventListener('click', (e) => {
            this.bmapRef.map.centerAndZoom(
                literalToPoint(center),
                this.getzoom() > 12 ? this.getzoom() : 12,
            );
        })
        overlay.addEventListener('mouseover', (e) => {
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
                        this.prism(i, properties.name,
                            properties.center,
                            convert(area),
                        )
                    );
                }
            }
        }
    }

    render() {
        return (
            <BaiduMap
                center={'广州市'}
                // styleId={'00b4cbb970cc388d95e664915d263104'}
                ref={(ref: any) => { ref ? (this.bmapRef = ref) : null; }}
                zoomControl={false}
                mapTypeControl={false}
                scaleControl={false}
                navigationControl={false}
                listeners={{
                    onDblclick: this.leftdbCilck,
                    onRightclick: this.rightCilck,
                    onLoad: this.mapLoaded,
                    onZoomend: this.onZoomend,
                    onZoomstart: this.onZoomstart,
                }}>
            </BaiduMap>
        );
    }
}