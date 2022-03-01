import React from 'react';
import { BaiduMap } from '../bmap';
import { BMapPrism } from '../bmap/overlay';
import { BMapMapvglLayer, BMapMapvglView } from '../bmap/vgl';
export default class Layout extends React.Component {
	componentDidMount() {}
	render() {
		return (
			<BaiduMap>
				<BMapPrism
					points={[]}
					altitude={5000}
					options={{
						topFillColor: '#5679ea',
						topFillOpacity: 0.6,
						sideFillColor: '#5679ea',
						sideFillOpacity: 0.9,
					}}
				/>
			</BaiduMap>
		);
	}
}
