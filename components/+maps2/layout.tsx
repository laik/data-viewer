import { observable } from 'mobx';
import React from 'react';
import { MapvglLayer } from 'react-bmapgl';
import { bind } from '../../core/utils';
import { BaiduMap } from '../bmap';
import { BMapTrackAnimation } from '../bmap/animation';
import { BMapPrism } from '../bmap/custom-overlay';
import { withMapApi } from '../bmap/wrapper';
import hp from './data/hp.json';
import lw from './data/lw.json';

function convert<T = [lng: number, lat: number][] | []>(src: number[][]): T {
	const dst: T = {} as T;
	src.forEach((row) => {
		const [x, y] = row;
		dst[x] = y;
	});
	return dst;
}

@withMapApi
@bind()
export default class Layout extends React.Component {
	@observable view = null;
	@observable bmapRef = null;

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

	handleBMapPrismClick(e) {
		console.log('---->e', e.target);
		console.log('---->bmapRef', this.bmapRef);
		console.log('---->view', this.bmapRef.viewRef);
		console.log('---->map', this.bmapRef.mapRef);

		this.bmapRef.addViewLayer(
			<MapvglLayer
				map={null}
				view={null}
				type='PointLayer'
				data={[
					{
						geometry: {
							type: 'Point',
							coordinates: [116.403748, 39.915055],
						},
					},
				]}
				options={{
					color: 'rgba(50, 50, 200, 1)',
					shape: 'circle', // 默认为圆形，可传square改为正方形
					blend: 'lighter',
					size: 2,
				}}
			/>
		);

		console.log('this.bmapRef.layers', this.bmapRef.layers);
	}

	render() {
		let lwpath = [];
		for (let i = 0; i < lw.length; i++) {
			const points = lw[i];
			let lng = points[0];
			let lat = points[1];
			lwpath.push(new BMapGL.Point(Number(lng), Number(lat)));
		}
		let hppath = [];
		for (let i = 0; i < hp.length; i++) {
			const points = hp[i];
			let lng = points[0];
			let lat = points[1];
			hppath.push(new BMapGL.Point(Number(lng), Number(lat)));
		}

		var pl = new BMapGL.Polyline(hppath);

		return (
			<BaiduMap ref={(ref) => (this.bmapRef = ref)} useView>
				<BMapPrism
					points={lwpath}
					altitude={3000}
					topFillColor={'#5679ea'}
					topFillOpacity={0.6}
					sideFillColor={'#5679ea'}
					sideFillOpacity={0.9}
					enableMassClear={true}
					listeners={{ click: this.handleBMapPrismClick }}
				/>
				<BMapPrism
					points={hppath}
					altitude={3000}
					topFillColor={'#5679ea'}
					topFillOpacity={0.6}
					sideFillColor={'#5679ea'}
					sideFillOpacity={0.9}
					enableMassClear={true}
					listeners={{ click: this.handleBMapPrismClick }}
				/>
				<BMapTrackAnimation
					poyline={pl}
					overallView={true}
					tilt={30}
					duration={20000}
					delay={3000}
				/>
			</BaiduMap>
		);
	}
}
