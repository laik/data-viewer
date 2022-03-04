import { observer } from 'mobx-react';
import { default as MapvglLayer } from 'react-bmapgl/Layer/MapvglLayer';
import MapvglView from 'react-bmapgl/Layer/MapvglView';
import Map, { MapProps } from 'react-bmapgl/Map';
export interface Point extends BMapGL.Point { }

export interface Bmap3Props extends MapProps {
    ref: (ref: Bmap3) => void;
}

@observer
export class Bmap3 extends Map {
    mview: MapvglView;

    constructor(props: Bmap3Props) {
        super(props);
    }

    addOverlay = (overlays: BMapGL.Overlay[]): Bmap3 => {
        overlays.forEach(overlay => {
            this.map.addOverlay(overlay)
        })
        return this;
    }

    addLayer(type, data, options, props?): Bmap3 {
        if (!this.mview) {
            this.mview =
                new MapvglView(
                    { map: this.map, effects: ['bright'] }
                );
        }
        let layerRef;
        this.mview.
            renderChildren(
                <MapvglLayer
                    ref={(ref) => { layerRef = ref.layer; console.log("--", ref.layer) }}
                    type={type}
                    data={data}
                    options={options}
                    {...props}
                />
            );
        // console.log('---->layerRef', layerRef);
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