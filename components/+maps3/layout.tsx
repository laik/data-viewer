import { observable } from 'mobx';
import React from 'react';
import { bind } from '../../core/utils';
import { BaiduMap, BMapRef } from '../bmap';
import { withMapApi } from '../bmap/wrapper';
import hp from './data/hp.json';
import lw from './data/lw.json';

const mapvgl = require('mapvgl');

function createPrism(points, altitude, opt): BMapGL.Overlay {
	return new BMapGL.Prism(points, altitude, opt);
}

@withMapApi
@bind()
export default class Layout extends React.Component {
	@observable bmapRef: BMapRef = null;

	convert(src: number[][]): any {
		let paths = [];
		for (let i = 0; i < src.length; i++) {
			const points = src[i];
			let lng = points[0];
			let lat = points[1];
			paths.push(new BMapGL.Point(Number(lng), Number(lat)));
		}
		return paths;
	}

	convert2(src: number[][]): any {
		let paths = [];
		for (let i = 0; i < src.length; i++) {
			const points = src[i];
			let lng = points[0];
			let lat = points[1];
			paths.push([lng, lat]);
		}
		return paths;
	}

	onClick(e) {
		const prismOpt = {
			topFillColor: '#5679ea',
			topFillOpacity: 0.6,
			sideFillColor: '#5679ea',
			sideFillOpacity: 0.9,
			enableMassClear: true,
		};

		const prisms = [
			createPrism(this.convert(lw), 200, prismOpt),
			createPrism(this.convert(hp), 200, prismOpt),
		];
		prisms.map((item) => this.bmapRef.map.addOverlay(item));

		var layer = new mapvgl.CircleLayer({
			// 绘制带波纹扩散的圆
			type: 'wave',
			// 扩散半径，支持直接设置和回调两种形式
			radius: 25,
			// 周期影响扩散速度，越小越快
			duration: 1 / 3,
			// 拖尾影响波纹数，越大越多
			trail: 4,
			color: 'rgba(230, 242, 30)',
			size: 1000,
			data: [
				{
					geometry: {
						type: 'Point',
						coordinates: [113.420416, 23.172711],
					},
				},
			],
		});
		this.bmapRef.view.addLayer(layer);
	}

	render() {
		return (
			<BaiduMap
				ref={(ref: any) => {
					ref ? (this.bmapRef = ref) : null;
				}}
				listeners={{
					onClick: this.onClick,
				}}
			/>
		);
	}
}
