import { computed } from 'mobx';
import { observer } from 'mobx-react';
import MapvglView from 'react-bmapgl/Layer/MapvglView';
import Map, { MapProps } from 'react-bmapgl/Map';


export interface Point extends BMapGL.Point {

}


export interface Bmap3Props extends MapProps {
    ref: (ref: Bmap3) => void;
}

@observer
export class Bmap3 extends Map {
    mapvglView = new MapvglView({ map: this.map, effects: ['bright'] });

    constructor(props: Bmap3Props) {
        super(props);
    }

    @computed get self() {
        return this.map;
    }

    addOverlay = (points: Point[], altitude: number): Bmap3 => {
        this.map.addOverlay(
            new BMapGL.Prism(
                points,
                altitude,
                {
                    topFillColor: '#5679ea',
                    topFillOpacity: 0.6,
                    sideFillColor: '#5679ea',
                    sideFillOpacity: 0.9,
                    enableMassClear: true,
                },
            )
        );
        return this;
    }

    addLayer(layer): Bmap3 {
        console.log("", this.mapvglView.view.addLayer(layer));
        return this;
    }

}
