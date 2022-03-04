import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { ReactNode } from 'react';
import { MapvglLayer } from 'react-bmapgl';
import { ControlProps } from 'react-bmapgl/Control/Control';
import MapTypeControl from 'react-bmapgl/Control/MapTypeControl';
import NavigationControl from 'react-bmapgl/Control/NavigationControl';
import ScaleControl from 'react-bmapgl/Control/ScaleControl';
import ZoomControl from 'react-bmapgl/Control/ZoomControl';
import MapvglView from 'react-bmapgl/Layer/MapvglView';
import Map, { MapProps } from 'react-bmapgl/Map';
import { BMapMapvglView } from './vgl';

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

function ZoomSelect(props: { zoom: number; onChange }) {
	const [zoom, setZoom] = React.useState(12);

	const handleChange = (event) => {
		setZoom(event.target.value);
		props.onChange(event.target.value);
	};

	return (
		<FormControl fullWidth size='small' sx={{ mb: 1, mt: 1 }}>
			<InputLabel id='zoom-label'>级数</InputLabel>
			<Select
				labelId='zoom-label'
				id='zoom-select'
				label='级数'
				value={zoom}
				onChange={handleChange}>
				<MenuItem value={12}>12</MenuItem>
				<MenuItem value={16}>16</MenuItem>
				<MenuItem value={18}>18</MenuItem>
				<MenuItem value={22}>22</MenuItem>
			</Select>
		</FormControl>
	);
}

// 百度地图图层组件
export interface BaiduMapProps {
	mapTypeControl?: boolean;
	navigationControl?: boolean;
	scaleControl?: boolean;
	zoomControl?: boolean;
	mapProps?: MapProps;
	mapTypeControlProps?: ControlProps;
	navigationControlProps?: ControlProps;
	scaleControlProps?: ControlProps;
	zoomControlProps?: ControlProps;
	/** 开启图层管理器 */
	useView?: boolean;
	/** 添加监听事件处理*/
	listeners?: {
		eventsMap: (evt) => void;
	};
	mapRef?: (ref: BMapGL.Map) => void;
	mapOnCilck?: (evt) => void;
	viewRef?: (ref: MapVGL.View) => void;
	baiduRef?: (ref: BaiduMap) => void;
}

@observer
export class BaiduMap extends React.Component<BaiduMapProps> {
	static defaultProps = {};

	@observable mapRef: BMapGL.Map = null;
	@observable viewRef: MapVGL.View = null;
	@observable mapvglView: MapvglView = null;

	@observable layersElement: React.ReactElement[] = [];
	@observable layers: MapVGL.Layer[] = [];

	@observable listeners = this.props.listeners || {};
	@observable zoom = this.props.mapProps.zoom || 12;
	@observable children: ReactNode[] = [];


	@observable openView = false;
	

	constructor(props) {
		super(props);
	}

	@action
	addChild = (child) => {
		this.children.push(child);
	}

	@action
	addViewLayer(layer: React.ReactElement) {
		this.layersElement.push(layer);
	};

	@computed get getlayers() {
		return this.layers
	}

	@computed get isopenView() {
		return this.openView
	}

	open() {
		this.openView = true
		console.log("openView", this.openView, this.viewRef)
		const layer = this.layers[0];
		// this.viewRef.removeLayer(layer);
	}

	circleLayer = () => {
		let layer;
		const c = <MapvglLayer
			map={this.mapRef}
			view={this.viewRef}
			type='CircleLayer'
			data={[
				{
					geometry: {
						type: 'Point',
						coordinates: [113.420416, 23.172711],
					},
				},
				{
					geometry: {
						type: 'Point',
						coordinates: [113.410416, 23.162211],
					},
				},
			]}
			options={{
				color: 'rgba(50, 50, 200, 1)',
				shape: 'circle', // 默认为圆形，可传square改为正方形
				blend: 'lighter',
				size: 5,
			}}
		/>
		this.layersElement.push(c);
		this.layers.push(layer);

		return c;
	}

	addview = () => {

	}
	render() {
		const {
			mapTypeControl,
			navigationControl,
			scaleControl,
			zoomControl,
			mapTypeControlProps,
			navigationControlProps,
			scaleControlProps,
			zoomControlProps,
			children,
			mapRef,
			viewRef,
			mapOnCilck,
			baiduRef,
		} = this.props;

		const mapProps = {
			...this.props.mapProps,
			...this.listeners,
		};

		this.children.push(children);

		baiduRef(this);
		return (
			<Box sx={{ m: 2 }}>
				<ZoomSelect
					zoom={this.zoom}
					onChange={(zoom) => ((this.zoom = zoom), this.mapRef.setZoom(zoom))}
				/>
				<Map
					center={'广州市'}
					style={{ height: '800px' }}
					ref={(ref) => {
						ref && ref.map ? this.mapRef = ref.map : null;
						ref && ref.map && mapRef ? mapRef(ref.map) : null;
					}}
					onClick={mapOnCilck}
					{...mapProps}>
					{mapTypeControl ? (
						<MapTypeControl map={this.mapRef} {...mapTypeControlProps} />
					) : null}
					{navigationControl ? (
						<NavigationControl map={this.mapRef} {...navigationControlProps} />
					) : null}
					{scaleControl ? (
						<ScaleControl map={this.mapRef} {...scaleControlProps} />
					) : null}
					{zoomControl ? (
						<ZoomControl map={this.mapRef} {...zoomControlProps} />
					) : null}
					{this.children}


					<BMapMapvglView
						effects={['bloom']}
					>
						{this.circleLayer()}
					</BMapMapvglView>
					{/* <div></div> */}
					{/* {this.layers.map((layer) => {
						<MapvglView
							map={this.mapRef}
							ref={(ref) => {
								ref && ref.view ? (this.viewRef = ref.view) : null;
								viewRef && viewRef(ref.view);
								console.log("layer->", layer);
							}}>
							{layer}

						</MapvglView>
					})} */}

				</Map>
			</Box >
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
		zoom: 12,
		maxZoom: 22,
		// minZoom: 12,
		tilt: 10,
	},
	mapTypeControlProps: {},
	navigationControlProps: {},
	scaleControlProps: {},
	zoomControlProps: {},
};
