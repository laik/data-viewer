import { computed } from 'mobx';
import { observer } from 'mobx-react';
import Map, { MapProps } from 'react-bmapgl/Map';


export interface Point extends BMapGL.Point {

}


export interface Bmap2Props extends MapProps {
    ref: (ref: Bmap3) => void;
}

@observer
export class Bmap3 extends Map {
    view: MapVGL.View;

    constructor(props: Bmap2Props) {
        super(props);
    }

    @computed get self() { return this.map; }

    put(points: Point[], altitude: number): Bmap3 {
        this.map.addOverlay(
            new BMapGL.Prism(
                points,
                altitude,
                {
                    topFillColor: '#ffffff',
                    topFillOpacity: 0.6,
                    sideFillColor: '#ffffff',
                    sideFillOpacity: 0.9,
                    enableMassClear: true,
                },
            )
        );
        return this;
    }

    addLayer(opt: MapVGL.LayerOptions): Bmap3 {
        if (!this.view) {
            this.view = new MapVGL.View({ map: this.map });
        }
        const layer = new MapVGL.Layer(this.map, opt);
        this.view.addLayer(layer);
        return this;
    }

}
