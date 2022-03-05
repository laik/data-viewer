

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
