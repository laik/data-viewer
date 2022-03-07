import { lighten } from '@jiaminghi/color';
import { observable } from 'mobx';
import React from 'react';
import { bind } from '../../core/utils';
import { BaiduMap, BMapRef } from '../bmap';
import { withMapApi } from '../bmap/wrapper';
import yuxicity from './data/yuxi-city.json';
import tracks from './data/yuxi-tracks.json';
import yuxi from './data/yuxi.json';
import {
    convert,
    literalToPoint,
    Point,
    Region,
    sRGBHex,
    Tracks
} from './tool';
const mapvgl = require('mapvgl');

@withMapApi
@bind()
export default class Layout extends React.Component {
    @observable bmapRef: BMapRef = null;
    @observable districtPrism = observable.map({});
    @observable ani: BMapGLLib.TrackAnimation = null;
    @observable aniCancel = null;
    @observable holding = false;
    @observable cityName = "玉溪市";

    setzoom = (size: number) => {
        this.bmapRef.map.setZoom(size);
    };
    getzoom = (): number => {
        return this.bmapRef.map.getZoom();
    };
    zoomOut = () => {
        this.setzoom(this.getzoom() - 2);
    };
    zoomIn = () => {
        this.setzoom(this.getzoom() + 2);
    };

    // 关闭行政区域覆盖
    disableDistrict = () => {
        this.bmapRef.map.clearOverlays();
    };
    // 开启行政区域覆盖
    enableDistrict = () => {
        this.districtPrism.forEach((overlay) => {
            this.bmapRef.map.addOverlay(overlay);
        });
    };

    // 显示车流
    displayVehicleFlow = (tracks: Tracks) => {
        this.bmapRef.addMapvglViewLayer(
            'flow',
            new mapvgl.LineFlowLayer({
                color: '#B8E90B',
                interval: 0.6,
                duration: 3,
                trailLength: 1,
                data: tracks.pointList(),
            })
        );
    };
    //关闭车流
    disableVehicleFlow = () => {
        this.bmapRef.disableMapvglViewLayer('flow');
    };
    //开启车流
    enableVehicleFlow = () => {
        this.bmapRef.enableMapvglViewLayer('flow');
    };

    displayVehicleFlowadAptation = (zoom: number) => {
        console.log("displayVehicleFlowadAptation", zoom);
        if (zoom > 12) {
            this.disableDistrict();
        } else {
            this.enableDistrict();
        }

        if (!this.holding) {
            if (zoom > 14) {
                // this.disableVehicleFlow();
                this.enableCarPostiton();
            } else {
                // this.enableVehicleFlow();
                this.disableCarPostiton();
            }
        }
    }

    districtsAptation = (zoom: number) => { };

    mapLoaded = (e) => {
        //初始化3D矢量图层
        this.initDistrictsPrism(yuxi);
        // 
        this.initCityMarker();
        let _ = yuxicity;
        //开启3D矢量图层
        this.enableDistrict();

        let _tracks = new Tracks(tracks);
        // 开启车流量线路图层
        this.displayVehicleFlow(_tracks);
        // 开启车最终点
        this.displayCarPostiton(_tracks);

        // this.enableCarPostiton();
        this.bmapRef.map.enableContinuousZoom();
    };

    onZoomend = (e) => {
        const size = e.target.getZoom();
        if (size < 12) {
            this.bmapRef.map.setTilt(0);
        } else if (size === 12) {
        } else if (size > 12 && size < 14) {
            this.bmapRef.map.setTilt(30);
        } else if (size >= 14 && size < 16) {
            this.bmapRef.map.setTilt(55);
        } else if (size >= 16 && size <= 22) {
            this.bmapRef.map.setTilt(65);
        }
        this.displayVehicleFlowadAptation(size);
    };

    onZoomstart = (e) => {
        const size = e.target.getZoom();
    };

    rightCilck = (e) => {
        this.ani && this.aniCancel();
        this.zoomOut();
    };
    leftdbCilck = (e) => {
        this.zoomIn();
    };

    displayCarPostiton = (tracks: Tracks) => {
        this.bmapRef.putMapvglViewLayer(
            'car',
            new mapvgl.IconLayer({
                icon: '/vehicle1.png',
                width: 30,
                height: 30,
                // offset: [0, -153 / 2 / 2],
                enablePicked: true, // 是否可以拾取
                autoSelect: true, // 根据鼠标位置来自动设置选中项
                flat: false,   // 平躺在地面上
                selectedColor: '#B8F705', // 选中项颜色
                angle: 1,
                // opacity: 0.8,
                data: tracks.lastPointList(),
                onClick: (e) => {
                    if (e.dataIndex === -1) { return }
                    // alert(`播放vid${tracks.getVid(e.dataIndex)}...`);
                    this.holding = true;
                    if (this.ani) {
                        this.aniCancel();
                    }
                    const polyLinPath = tracks.getPolyLines(e.dataIndex);
                    const duration = (polyLinPath.length * 1500) + 500;
                    // 声明动画对象
                    this.disableVehicleFlow();
                    this.disableCarPostiton();
                    this.disableDistrict();
                    this.bmapRef.map.centerAndZoom(polyLinPath[0], 18);
                    let pl = new BMapGL.Polyline(polyLinPath,
                        {
                            strokeColor: '#FF009D',
                            strokeWeight: 2,
                            strokeOpacity: 10,
                            strokeStyle: 'dashed',//dashed,solid
                            enableMassClear: true,
                            enableClicking: true,
                        }
                    )
                    this.ani = new BMapGLLib.TrackAnimation(
                        this.bmapRef.map,
                        pl,
                        {
                            duration: duration, // 通过轨迹行程时间计算 // 轨迹点个数*1500 回放
                            delay: 1000,
                            overallView: true,
                            zoom: 18,
                        });
                    // 监听事件                    
                    // 开始播放动画
                    this.ani.start();
                    this.aniCancel = () => {
                        this.holding = false;
                        if (!this.ani) { return; }
                        this.ani.cancel();
                        this.bmapRef.map.removeOverlay(pl);
                        this.ani = null;
                        this.enableCarPostiton();
                        this.enableVehicleFlow();
                        // this.enableDistrict();
                        this.bmapRef.map.centerAndZoom(polyLinPath[0], 14);
                    }
                    setTimeout(() => {
                        this.aniCancel();
                    }, duration + 2000);
                },
                onMousemove: (e) => {
                    if (e.dataIndex === -1) { return }
                    console.log("---", e);
                    // 可以添加文字图层显示车量信息
                }
            })
        );
    };

    enableCarPostiton = () => {
        this.bmapRef.enableMapvglViewLayer('car');
    };
    disableCarPostiton = () => {
        this.bmapRef.disableMapvglViewLayer('car');
    };

    prism = (
        key: number,
        name: string,
        center: Point,
        points: any
    ): BMapGL.Overlay => {
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
                this.getzoom() > 12 ? this.getzoom() : 12
            );
        });
        overlay.addEventListener('mouseover', (e) => {
            e.target.setTopFillColor(lighten(fillColor));
            e.target.setTopFillOpacity(0.5);
        });
        overlay.addEventListener('mouseout', (e) => {
            e.target.setTopFillColor(fillColor);
            e.target.setTopFillOpacity(fillOpacity);
        });
        return overlay;
    };

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
                        properties.name + j, //同一个行政区会有多个prism组成
                        this.prism(i,
                            properties.name,
                            properties.center,
                            convert(area),
                        )
                    );
                }
            }
        }
    };

    initCityMarker = () => { new BMapGL.Boundary().get(this.cityName, this.city); }

    city = (rs: any) => {
        var count = rs.boundaries.length; //行政区域的点有多少个
        for (var i = 0; i < count; i++) {
            var ply = new BMapGL.Polygon(
                rs.boundaries[i],
                {
                    strokeWeight: 0,
                    strokeColor: "#262626",
                    fillColor: "#262626",
                    strokeOpacity: 0.1,
                    enableMassClear: false,
                    enableClicking: false,
                }); //建立多边形覆盖物
            this.bmapRef.map.addOverlay(ply);  //添加覆盖物
            this.bmapRef.map.setViewport(ply.getPath());    //调整视野         
        }
    }


    render() {
        return (
            <BaiduMap
                center={this.cityName}
                styleId={'00b4cbb970cc388d95e664915d263104'}
                ref={(ref: any) => {
                    ref ? (this.bmapRef = ref) : null;
                }}
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
                }}
            />
        );
    }
}
