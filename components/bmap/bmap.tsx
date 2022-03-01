import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ControlProps } from 'react-bmapgl/Control/Control';
import MapTypeControl from 'react-bmapgl/Control/MapTypeControl';
import NavigationControl from 'react-bmapgl/Control/NavigationControl';
import ScaleControl from 'react-bmapgl/Control/ScaleControl';
import ZoomControl from 'react-bmapgl/Control/ZoomControl';
import Map, { MapProps } from 'react-bmapgl/Map';

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
	children?: React.ReactElement[] | React.ReactElement;
	handleMapClick?: () => void;
}

@observer
export class BaiduMap extends React.Component<BaiduMapProps> {
	static defaultProps = {};
	@observable mapRef = null;

	handleMapClick = (e) => {};

	render() {
		const {
			mapTypeControl,
			navigationControl,
			scaleControl,
			zoomControl,
			mapProps,
			mapTypeControlProps,
			navigationControlProps,
			scaleControlProps,
			zoomControlProps,
			children,
			handleMapClick,
		} = this.props;

		return (
			<Map
				center={new BMapGL.Point(116.404, 39.925)}
				ref={(ref) => {
					ref ? (this.mapRef = ref.map) : null;
				}}
				onClick={handleMapClick}
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
				{children
					? Array.isArray(children)
						? children.map((child) =>
								React.cloneElement(child, { map: this.mapRef })
						  )
						: React.cloneElement(children, { map: this.mapRef })
					: null}
			</Map>
		);
	}
}

BaiduMap.defaultProps = {
	mapTypeControl: true,
	navigationControl: true,
	scaleControl: true,
	zoomControl: true,
	mapProps: {
		zoom: 9,
		tilt: 50,
	},
	mapTypeControlProps: {},
	navigationControlProps: {},
	scaleControlProps: {},
	zoomControlProps: {},
};
