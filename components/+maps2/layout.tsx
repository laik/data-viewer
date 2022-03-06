import { lighten } from '@jiaminghi/color';
import { observable } from 'mobx';
import Image from 'next/image';
import React from 'react';
import { bind } from '../../core/utils';
import { BaiduMap, BMapRef } from '../bmap';
import { BMapTrackAnimation } from '../bmap/animation';
import { withMapApi } from '../bmap/wrapper';
import gz from './data/gz.json';
import tracks from './data/tracks.json';
import { convert, literalToPoint, Point, Region, sRGBHex, Tracks } from './tool';

export function Car() {
    return <Image src="./car.svg" alt="car" width="64" height="64" />
}

const mapvgl = require('mapvgl');
@withMapApi
@bind()
export default class Layout extends React.Component {
    @observable bmapRef: BMapRef = null;
    @observable districtPrism = observable.map({});
    @observable ani = null;

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
                color: 'rgb(184, 247, 5)',
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
            this.disableVehicleFlow();
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

    rightCilck = (e) => { this.ani && this.ani.cancel(); this.zoomOut(); }
    leftdbCilck = (e) => { this.zoomIn(); }

    displayCarPostiton = (tracks: Tracks) => {
        this.bmapRef.putMapvglViewLayer('car',
            new mapvgl.IconLayer({
                icon: Car.name,
                enablePicked: true, // 是否可以拾取
                autoSelect: true, // 根据鼠标位置来自动设置选中项
                // flat: true,   // 平躺在地面上
                selectedColor: '#B8F705', // 选中项颜色
                // opacity: 0.8,
                data: tracks.lastPointList(),
                onClick: (e) => { // 点击事件
                    console.log("----?", e)
                    if (e.dataIndex === -1) {
                        return;
                    }
                    alert(`点击了第${e.dataIndex}个点`);
                    const polyLinPath = tracks.getPolyLines(e.dataIndex);
                    const duration = tracks.getDuration(e.dataIndex) / 15;


                    // 声明动画对象
                    this.disableVehicleFlow();
                    this.ani = new BMapGLLib.TrackAnimation(
                        this.bmapRef.map,
                        new BMapGL.Polyline(polyLinPath,
                            {
                                strokeColor: '#B8F705',
                                strokeWeight: 1,
                                strokeOpacity: 1,
                                strokeStyle: 'solid',
                                // enableMassClear: true,
                                // enableEditing: false,
                                enableClicking: true,
                            }
                        ),
                        {
                            duration: duration, // 通过轨迹行程时间计算
                            delay: 500,
                            overallView: true,
                            tilt: 60,
                            zoom: 19.5,
                        });
                    // 监听事件                    
                    // 开始播放动画
                    this.ani.start();
                    setTimeout(() => {
                        this.ani.cancel();
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