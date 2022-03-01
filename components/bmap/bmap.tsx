import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ControlProps } from 'react-bmapgl/Control/Control';
import MapTypeControl from 'react-bmapgl/Control/MapTypeControl';
import NavigationControl from 'react-bmapgl/Control/NavigationControl';
import ScaleControl from 'react-bmapgl/Control/ScaleControl';
import ZoomControl from 'react-bmapgl/Control/ZoomControl';
import Map, { MapProps } from 'react-bmapgl/Map';
import gz from './gz.json';
import { BMapPrism } from './overlay';
import th from './th.json';
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
	children?: React.ReactElement[] | React.ReactElement;
}

interface Results {
	boundaries: string[];
}

@withMapApi
@observer
export class BaiduMap extends React.Component<BaiduMapProps> {
	static defaultProps = {};
	@observable mapRef = null;
	static path = [];

	constructor(props) {
		super(props);
	}

	handleMapClick = (e) => {
		console.log(e);
	}


	handleClick(e) {
		console.log("---->e", e.target);
	}

	gzPrism() {
		let path = [];

		// const bd = new BMapGL.Boundary();
		// // @ts-ignore
		// bd.get('天河区', function (rs: Results) {
		// 	console.log("---->rs", rs)
		// 	let count = rs.boundaries.length;
		// 	for (let i = 0; i < count; i++) {
		// 		let str = rs.boundaries[i].replace(' ', '');
		// 		let points = str.split(';');
		// 		for (let j = 0; j < points.length; j++) {
		// 			let lng = points[j].split(',')[0];
		// 			let lat = points[j].split(',')[1];
		// 			path.push(new BMapGL.Point(Number(lng), Number(lat)));
		// 		}
		// 	}
		// });

		for (let i = 0; i < gz.length; i++) {
			let str = gz[i].replace(' ', '');
			const points = str.split(';');
			for (let j = 0; j < points.length; j++) {
				let lng = points[j].split(',')[0];
				let lat = points[j].split(',')[1];
				path.push(new BMapGL.Point(Number(lng), Number(lat)));
			}
		}

		return <BMapPrism
			points={path}
			altitude={5000}
			options={{
				topFillColor: '#ff0000',
				topFillOpacity: 0.1,
				sideFillColor: '#ff00ea',
				sideFillOpacity: 0.2,
			}}
			listeners={{ "click": this.handleClick }}
		/>
	}
	thPrism() {
		let path = [];
		for (let i = 0; i < th.length; i++) {
			let str = th[i].replace(' ', '');
			const points = str.split(';');
			for (let j = 0; j < points.length; j++) {
				let lng = points[j].split(',')[0];
				let lat = points[j].split(',')[1];
				path.push(new BMapGL.Point(Number(lng), Number(lat)));
			}
		}

		return <BMapPrism
			points={path}
			altitude={5000}
			options={{
				topFillColor: '#555555',
				topFillOpacity: 0.6,
				sideFillColor: '#5579ea',
				sideFillOpacity: 0.6,
			}}
			listeners={{ "click": this.handleClick }}
		/>
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
		} = this.props;


		console.log("-------->path", BaiduMap.path);
		return (
			<Map
				center={'广州市'}
				mapStyleV2={{ styleId: '00b4cbb970cc388d95e664915d263104' }}
				zoom={25}
				ref={(ref) => {
					ref ? this.mapRef = ref.map : null;
				}}
				onClick={this.handleMapClick}
				{...mapProps}>

				{this.gzPrism()}
				{this.thPrism()}

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
		zoom: 12,
		tilt: 40,
	},
	mapTypeControlProps: {},
	navigationControlProps: {},
	scaleControlProps: {},
	zoomControlProps: {},
};
