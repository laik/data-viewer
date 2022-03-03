import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ControlProps } from 'react-bmapgl/Control/Control';
import MapTypeControl from 'react-bmapgl/Control/MapTypeControl';
import NavigationControl from 'react-bmapgl/Control/NavigationControl';
import ScaleControl from 'react-bmapgl/Control/ScaleControl';
import ZoomControl from 'react-bmapgl/Control/ZoomControl';
import MapvglView from 'react-bmapgl/Layer/MapvglView';
import Map, { MapProps } from 'react-bmapgl/Map';

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
}

@observer
export class BaiduMap extends React.Component<BaiduMapProps> {
	static defaultProps = {};

	@observable mapRef = null;
	@observable viewRef = null;

	@observable listeners = this.props.listeners || {};
	@observable zoom = this.props.mapProps.zoom || 12;

	renderView = () => {
		/** 图层管理器 */
		if (!this.props.useView) return null;
		return (
			<MapvglView
				map={this.mapRef}
				ref={(ref) => (ref && ref.view ? (this.viewRef = ref.view) : null)}
			/>
		);
	};

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
		} = this.props;

		const mapProps = {
			...this.props.mapProps,
			...this.listeners,
		};

		return (
			<Box sx={{ m: 2 }}>
				<ZoomSelect
					zoom={this.zoom}
					onChange={(zoom) => ((this.zoom = zoom), this.mapRef.setZoom(zoom))}
				/>
				<Map
					center={'广州市'}
					style={{ height: '800px' }}
					ref={(ref) => (ref && ref.map ? (this.mapRef = ref.map) : null)}
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
					{children}
					{this.renderView()}
				</Map>
			</Box>
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
		minZoom: 12,
		tilt: 10,
	},
	mapTypeControlProps: {},
	navigationControlProps: {},
	scaleControlProps: {},
	zoomControlProps: {},
};
