import React from "react";
import { Arc, Map, MapApiLoaderHOC, TrafficLayer } from "react-bmapgl";

class Baidu extends React.Component {
    componentDidMount() {
    }

    render() {

        const data = [
            { geometry: { type: 'Point', coordinates: [116.403748, 39.915055] }, properties: { count: 40 } },
            { geometry: { type: 'Point', coordinates: [116.403748, 39.915055] }, properties: { count: 100 } },
            { geometry: { type: 'Point', coordinates: [116.403748, 39.915055] }, properties: { count: 100 } },
            {
                geometry: { type: 'Point', coordinates: [1116.403748, 39.915055] },
                properties: { count: 50, color: [1, 0.8, 0.1, 0.6] }
            },
            { geometry: { type: 'Point', coordinates: [116.403748, 39.915055] }, properties: { count: 10 } },
        ];


        const view = {
            color: 'rgba(50, 50, 200, 1)',
            shape: 'circle', // 默认为正方形，可传circle改为圆形
            blend: 'lighter',
            size: 2,
            data: [{
                geometry: {
                    type: 'Point',
                    coordinates: [116.403748, 39.915055]
                }
            }]
        };

        
        return <Map
            heading={-45.3}
            center={new BMapGL.Point(116.304564, 40.056951)}
            zoom={12}
            tilt={60}
            enableTilt={true}
        >
            <TrafficLayer map={undefined} />
            {/* <MapvglView map={undefined} data={data}/> */}

            {/* <PanoramaLayer map={undefined} /> */}


            {/* <MapvglLayer data={data} /> */}
            {/* <Point> */}

            <Arc
                autoViewport
                showStartPoint
                showEndPoint
                enableAnimation
                data={[
                    {
                        from: {
                            city: '北京'
                        },
                        to: {
                            city: '南京'
                        }
                    },
                    {
                        color: '#392',
                        from: {
                            city: '北京',
                        },
                        to: {
                            name: '哈哈',
                            point: new BMapGL.Point(101.45934, 39.135305),
                        }
                    },
                    {
                        from: {
                            city: '北京'
                        },
                        to: {
                            city: '成都'
                        }
                    },
                    {
                        from: {
                            city: '北京'
                        },
                        to: {
                            city: '广州'
                        }
                    }
                ]} map={undefined} />
        </Map>
    }
}

export default MapApiLoaderHOC({ ak: 'l1i69UZi7aKCrzchRYRvPuUUQSvupFYO' })(Baidu)
