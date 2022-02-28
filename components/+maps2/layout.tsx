import React from 'react';
import { BaiduMap } from '../bmap';
import { BMapMapvglLayer, BMapMapvglView } from '../bmap/vgl';
export default class Layout extends React.Component {
	componentDidMount() {}
	render() {
		return (
			<BaiduMap>
				<BMapMapvglView effects={['bright']}>
					<BMapMapvglLayer
						type='PointLayer'
						data={[]}
						options={{
							blend: 'lighter',
							size: 12,
							color: 'rgb(255, 53, 0, 0.6)',
						}}
					/>
				</BMapMapvglView>
			</BaiduMap>
		);
	}
}
