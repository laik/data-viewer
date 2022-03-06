import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ControlProps } from 'react-bmapgl/Control/Control';
import MapTypeControl from 'react-bmapgl/Control/MapTypeControl';
import NavigationControl from 'react-bmapgl/Control/NavigationControl';
import ZoomControl from 'react-bmapgl/Control/ZoomControl';
import MapvglView from 'react-bmapgl/Layer/MapvglView';
import Map, { MapProps } from 'react-bmapgl/Map';

export interface BMapRef {
	map: BMapGL.Map;
	view: MapVGL.View;
	putMapvglViewLayer: (key: string, x: MapVGL.Layer) => void; // just add no enable display
	addMapvglViewLayer: (key: string, x: MapVGL.Layer) => void;
	removeMapvglViewLayer: (key: string) => void;
	getMapvglViewLayer: (key: string) => MapVGL.Layer;
	disableMapvglViewLayer: (key: string) => void;
	enableMapvglViewLayer: (key: string) => void;
	destroyMapvglView: () => void;
}

export type eventsMap =
	| 'onClick'
	| 'onDblclick'
	| 'onRightclick'
	| 'onRightdblclick'
	| 'onMaptypechange'
	| 'onMousemove'
	| 'onMouseover'
	| 'onMouseout'
	| 'onMovestart'
	| 'onMoving'
	| 'onMoveend'
	| 'onZoomstart'
	| 'onZoomend'
	| 'onAddoverlay'
	| 'onAddcontrol'
	| 'onRemovecontrol'
	| 'onRemoveoverlay'
	| 'onClearoverlays'
	| 'onDragstart'
	| 'onDragging'
	| 'onDragend'
	| 'onAddtilelayer'
	| 'onRemovetilelayer'
	| 'onLoad'
	| 'onResize'
	| 'onHotspotclick'
	| 'onHotspotover'
	| 'onHotspotout'
	| 'onTilesloaded'
	| 'onTouchstart'
	| 'onTouchmove'
	| 'onTouchend'
	| 'onLongpress';

// 百度地图图层组件
export interface BaiduMapProps {
	center: string;
	mapTypeControl?: boolean;
	navigationControl?: boolean;
	scaleControl?: boolean;
	zoomControl?: boolean;
	mapProps?: MapProps;
	mapTypeControlProps?: ControlProps;
	navigationControlProps?: ControlProps;
	scaleControlProps?: ControlProps;
	zoomControlProps?: ControlProps;
	/** 添加监听事件处理*/
	listeners?: {
		[key: string]: (evt) => void;
	};
}

@observer
export class BaiduMap extends React.Component<BaiduMapProps> {
	static defaultProps = {};

	@observable listeners = this.props.listeners || {};
	@observable map: BMapGL.Map = null;
	@observable view: MapVGL.View = null;
	@observable layers = observable.map({});

	mapTypeControl = () => {
		/** 地图类型控件 3D/2D */
		if (!this.props.mapTypeControl) return;
		const { mapTypeControlProps } = this.props;
		return <MapTypeControl map={this.map} {...mapTypeControlProps} />;
	};

	navigationControl = () => {
		/** 3D控件 */
		if (!this.props.navigationControl) return;
		const { navigationControlProps } = this.props;
		return <NavigationControl map={this.map} {...navigationControlProps} />;
	};

	scaleControl = () => {
		/** 比例尺控件 */
		if (!this.props.navigationControl) return;
		const { navigationControlProps } = this.props;
		return <NavigationControl map={this.map} {...navigationControlProps} />;
	};

	zoomControl = () => {
		/** 缩放控件 */
		if (!this.props.zoomControl) return;
		const { zoomControlProps } = this.props;
		return <ZoomControl map={this.map} {...zoomControlProps} />;
	};

	control = () => {
		/** 渲染控件 */
		return (
			<>
				{this.mapTypeControl()}
				{this.navigationControl()}
				{this.scaleControl()}
				{this.zoomControl()}
			</>
		);
	};

	mapvglView = () => {
		/** MapVGL图层管理器 */
		return (
			<MapvglView
				effects={['bloom']}
				map={this.map}
				ref={(ref) => (ref ? (this.view = ref.view) : null)}
			/>
		);
	};

	addMapvglViewLayer = (key: string, x: MapVGL.Layer) => {
		/** 添加MapVGL图层  */
		this.layers[key] = x;
		this.view.addLayer(x);
	};

	putMapvglViewLayer = (key: string, x: MapVGL.Layer) => {
		/** 添加MapVGL图层  */
		this.layers[key] = x;
	};

	disableMapvglViewLayer = (key: string) => {
		/** 关闭MapVGL图层  */
		this.view.removeLayer(this.layers[key]);
	};

	enableMapvglViewLayer = (key: string) => {
		/** 开启MapVGL图层  */
		this.layers[key] && this.view.addLayer(this.layers[key]);
	};

	removeMapvglViewLayer = (key: string) => {
		/** 移除MapVGL图层  */
		this.view.removeLayer(this.layers[key]);
		this.layers.delete(key);
	};

	getMapvglViewLayer = (key: string) => {
		return this.layers[key]
	}

	destroyMapvglView = () => {
		/** 清空MapVGL图层管理器 */
		if (!this.view) return;
		this.view.destroy();
		this.layers.clear();
	};

	render() {
		const { children, center } = this.props;
		const mapProps = {
			...this.props.mapProps,
			...this.listeners, // eventmap 监听事件绑定
		};

		return (
			<Map
				center={center}
				style={{ height: '100%' }}
				mapStyleV2={{ styleId: '00b4cbb970cc388d95e664915d263104' }}
				ref={(ref) => {
					ref && ref.map ? (this.map = ref.map) : null;
				}}
				{...mapProps}>
				{this.control()}
				{this.mapvglView()}
				{children}
			</Map>
		);
	}
}

BaiduMap.defaultProps = {
	mapTypeControl: true,
	navigationControl: true,
	scaleControl: true,
	zoomControl: true,
	useView: false,
	mapProps: {
		zoom: 4,
		maxZoom: 22,
		minZoom: 10,
		tilt: 0,
	},
	mapTypeControlProps: {},
	navigationControlProps: {},
	scaleControlProps: {},
	zoomControlProps: {},
};
