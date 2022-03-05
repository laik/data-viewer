

export type Point = number[];
export type Points = Point[];

export interface Region {
    type: string;
    features: {
        type: string;
        properties: {
            adcode: number,
            name: string,
            center: Point,
            centroid: Point,
        };
        geometry: {
            coordinates: Points[][];
        };
    }[];
}

export function colorRGB() {
    return '#' + (function (h) {
        return new Array(7 - h.length).join("0") + h
    })((Math.random() * 0x1000000 << 0).toString(16))
}

export function convert(src: number[][]): any {
    let paths = [];
    for (let i = 0; i < src.length; i++) {
        const points = src[i];
        let lng = points[0];
        let lat = points[1];
        paths.push(new BMapGL.Point(Number(lng), Number(lat)));
    }
    return paths;
}

export function literalToPoint(src: number[]): any {
    return new BMapGL.Point(Number(src[0]), Number(src[1]));
}

export const sRGBHex = [
    "#b1d0d2",
    "#b1d0d2",
    "#1d63e1",
    "#397837",
    "#50a006",
    "#efca1b",
    "#007347",
    "#0d5d73",
    "#6f440a",
    "#48426c",
    "#1f32e4",
    "#f9d1dc",
    "#24d1e1",
    "#078bb7",
    "#b96f99",
    "#3ac8cf",
    "#87fad6",
    "#982f8c",
    "#d59a0d",
    "#da2e39",
    "#d3e3e7",
    "#99f1fd",
    "#70775e",
    "#e0fe18",
    "#61b8e5",
    "#3e01d7",
    "#953c35",
    "#2f83e7",
    "#65ffb9",
    "#19c8ce",
    "#332bd2",
    "#74264c",
    "#6db004",
    "#5d2736",
    "#aea1a7",
    "#926474",
    "#07b17c",
    "#193a17",
    "#a458c9",
    "#dab1dc"
]