import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ControlProps } from 'react-bmapgl/Control/Control';
import MapTypeControl from 'react-bmapgl/Control/MapTypeControl';
import NavigationControl from 'react-bmapgl/Control/NavigationControl';
import ScaleControl from 'react-bmapgl/Control/ScaleControl';
import ZoomControl from 'react-bmapgl/Control/ZoomControl';
import Map, { MapProps } from 'react-bmapgl/Map';
import { withMapApi } from './wrapper';



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
	children?: React.ReactElement[];
	inject?: (map: BaiduMap) => void;
}
@withMapApi
@observer
export class BaiduMap extends React.Component<BaiduMapProps> {
	static defaultProps = {};
	@observable mapRef = null;
	@observable children: React.ReactElement[] = [];
	static path = [];

	constructor(props) {
		super(props);
		this.children.push(...props.children);
	}

	addChild(child) {
		this.children.push(child);
	}

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
			inject,
		} = this.props;

		return (
			<Map
				center={'广州市'}
				zoom={12}
				minZoom={12}
				maxZoom={22}
				mapStyleV2={{ styleId: '7e65c2caad216624f9c4a03e1f012b23' }}
				style={{ width: '100%', height: '100%' }}

				ref={(ref) => {
					ref ? this.mapRef = ref.map : null;
					inject && inject(this);
				}}

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
				{this.children.map((child) => React.cloneElement(child, { map: this.mapRef }))}
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
