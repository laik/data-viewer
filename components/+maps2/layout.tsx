import React from 'react';
import { BaiduMap } from '../bmap';
import { BMapPrism } from '../bmap/custom-overlay';
import { withMapApi } from '../bmap/wrapper';

@withMapApi
export default class Layout extends React.Component {
	render() {
		return (
			<BaiduMap>
				<BMapPrism
					points={[]}
					altitude={5000}
					topFillColor={'#5679ea'}
					topFillOpacity={0.6}
					sideFillColor={'#5679ea'}
					sideFillOpacity={0.9}
				/>
			</BaiduMap>
		);
	}
}
