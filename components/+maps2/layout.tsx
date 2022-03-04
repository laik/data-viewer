import { observable } from 'mobx';
import React from 'react';
import { bind } from '../../core/utils';
import { BaiduMap, BMapRef } from '../bmap';
import { BMapTrackAnimation } from '../bmap/animation';
import { BMapPrism } from '../bmap/custom-overlay';
import { withMapApi } from '../bmap/wrapper';
import line139 from './data/139line.json';
import hp from './data/hp.json';

const mapvgl = require('mapvgl');

@withMapApi
@bind()
export default class Layout extends React.Component {
	@observable bmapRef: BMapRef = null;

	convert(src: number[][]): any {
		let paths = [];
		for (let i = 0; i < src.length; i++) {
			paths.push([src[i][0], src[i][1]]);
		}
		return paths;
	}

	mapOnCilck(e) {
		switch (this.bmapRef.map.getZoom()) {
			case 12:
				this.bmapRef.map.setZoom(16);
				this.bmapRef.map.setTilt(0);
				var layer = new mapvgl.TextLayer({
					color: '#fff',
					fontFamily: 'Microsoft Yahei',
					fontSize: 14,
					flat: false,
					collides: true,
					offset: [0, 0],
					padding: [2, 2],
					data: [
						{
							geometry: {
								type: 'Point',
								coordinates: [113.420416, 23.172711],
							},
							properties: {
								text: '文字', // 展示的文字
							},
						},
					],
				});
				this.bmapRef.addMapvglViewLayer('circle', layer);
				break;
			case 16:
				this.bmapRef.map.setZoom(18);
				this.bmapRef.map.setTilt(45);
                BMapTrackAnimation.start()
				break;
			case 18:
				this.bmapRef.map.setZoom(20);
				this.bmapRef.map.setTilt(45);
                BMapTrackAnimation.cancel()
				break;
			case 22:
				this.bmapRef.map.setZoom(12);
				this.bmapRef.removeMapvglViewLayer('circle');
				break;
		}
	}

	districtsPrism = (data: any[]): JSX.Element => {
		let path = [];
		for (let i = 0; i < data.length; i++) {
			path.push(new BMapGL.Point(Number(data[i][0]), Number(data[i][1])));
		}
		return (
			<BMapPrism
				points={path}
				altitude={3000}
				topFillColor={'#5679ea'}
				topFillOpacity={0.6}
				sideFillColor={'#5679ea'}
				sideFillOpacity={0.9}
				enableMassClear={true}
			/>
		);
	};

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
		let hppath = [];
		for (let i = 0; i < hp.length; i++) {
			const points = hp[i];
			let lng = points[0];
			let lat = points[1];
			hppath.push(new BMapGL.Point(Number(lng), Number(lat)));
		}

		return (
			<BaiduMap
				ref={(ref: any) => {
					ref ? (this.bmapRef = ref) : null;
				}}
				listeners={{
					onClick: this.mapOnCilck,
				}}>
				{this.districtsPrism(hp)}
                {this.trackAnimation(line139)}
			</BaiduMap>
		);
	}
}
