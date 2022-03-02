import React from 'react';
import { BaiduMap } from '../bmap';
import { BMapPrism } from '../bmap/custom-overlay';
import { withMapApi } from '../bmap/wrapper';

@withMapApi
export default class Layout extends React.Component {

    handleClick(e) {
        console.log("---->e", e.target);
    }

    gzPrism() {
        let path = [];

        const bd = new BMapGL.Boundary();
        // @ts-ignore
        bd.get('天河区', function (rs: Results) {
            console.log("---->rs", rs)
            let count = rs.boundaries.length;
            for (let i = 0; i < count; i++) {
                let str = rs.boundaries[i].replace(' ', '');
                let points = str.split(';');
                for (let j = 0; j < points.length; j++) {
                    let lng = points[j].split(',')[0];
                    let lat = points[j].split(',')[1];
                    path.push(new BMapGL.Point(Number(lng), Number(lat)));
                }
            }
        });

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
            altitude={2000}
            options={{
                topFillColor: '#ECF23B',
                topFillOpacity: 0.2,
                sideFillColor: '#ECF23B',
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
            altitude={2000}
            options={{
                topFillColor: '#ECF23B',
                topFillOpacity: 0.2,
                sideFillColor: '##ECF23B',
                sideFillOpacity: 0.2,
            }}
            listeners={{ "click": this.handleClick }}
        />
    }

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
