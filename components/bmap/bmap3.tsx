import { observer } from 'mobx-react';
import MapvglView from 'react-bmapgl/Layer/MapvglView';
import Map, { MapProps } from 'react-bmapgl/Map';
export interface Point extends BMapGL.Point { }

export interface Bmap3Props extends MapProps {
    ref: (ref: Bmap3) => void;
}

@observer
export class Bmap3 extends Map {
    mapvglView = new MapvglView({ map: this.map, effects: ['bright'] });

    constructor(props: Bmap3Props) {
        super(props);
    }
    
    addOverlay = (overlay: BMapGL.Overlay): Bmap3 => {
        this.map.addOverlay(overlay)
        return this;
    }

    addLayer(layer): Bmap3 {
        console.log("---->", this.mapvglView.view);
        return this;
    }
    

}

export function createPrism(points, altitude, opt): BMapGL.Overlay {
    return new BMapGL.Prism(
        points,
        altitude,
        opt,
    )
}