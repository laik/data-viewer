import { observable } from 'mobx';
import React from 'react';
import { BaiduMap } from '../bmap';
import { BMapTrackAnimation } from '../bmap/animation';
import { BMapPrism } from '../bmap/custom-overlay';
import { withMapApi } from '../bmap/wrapper';
import hp from './data/hp.json';
import lw from './data/lw.json';

@withMapApi
export default class Layout extends React.Component {
	@observable view = null;
	@observable bmapRef = null;

	handleBMapPrismClick(e) {
		console.log('---->e', e.target);
		console.log('---->view', this.bmapRef.view);
		console.log('---->map', this.bmapRef.map);
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
