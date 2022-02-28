import React from "react";
import { Map, MapApiLoaderHOC } from "react-bmapgl";


class Baidu extends React.Component {
    componentDidMount() {
    }
    render() {
        return (<Map
            style={{ height: 450 }}
            center={new BMapGL.Point(116.404449, 39.914889)}
            zoom={12}
        />);
    }
}

export default MapApiLoaderHOC({ ak: 'l1i69UZi7aKCrzchRYRvPuUUQSvupFYO' })(Baidu)
