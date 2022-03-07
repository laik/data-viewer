import sparsePoints from "./sparse";



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


// "_id": "6221e67f8c4c22028a241361",
// "d": "4/3/2022 10:14:23.849",
// "b": "4/3/2022 10:08:40",
// "c": "4/3/2022 10:13:05",
// "tid": "862932047937363",
// "vid": "9212882",
// "a": "[ [ \"113.204529\", \"23.195906\", \"1646388520\", \"0.0\" ], [ \"113.204559\", \"23.195926\", \"1646388526\", \"1.0\" ], [ \"113.204589\", \"23.195987\", \"1646388532\", \"0.0\" ], [ \"113.204599\", \"23.195981\", \"1646388539\", \"0.0\" ], [ \"113.204609\", \"23.196013\", \"1646388545\", \"3.0\" ], [ \"113.204629\", \"23.196028\", \"1646388551\", \"2.0\" ], [ \"113.204639\", \"23.196068\", \"1646388557\", \"4.0\" ], [ \"113.20477\", \"23.196341\", \"1646388563\", \"24.0\" ], [ \"113.20495\", \"23.196665\", \"1646388569\", \"24.0\" ], [ \"113.20503\", \"23.19682\", \"1646388575\", \"23.0\" ], [ \"113.205335\", \"23.197466\", \"1646388581\", \"32.0\" ], [ \"113.205441\", \"23.197706\", \"1646388587\", \"22.0\" ], [ \"113.205687\", \"23.198171\", \"1646388593\", \"39.0\" ], [ \"113.206011\", \"23.198841\", \"1646388599\", \"50.0\" ], [ \"113.206282\", \"23.199418\", \"1646388605\", \"30.0\" ], [ \"113.206497\", \"23.199844\", \"1646388611\", \"32.0\" ], [ \"113.206672\", \"23.20033\", \"1646388617\", \"30.0\" ], [ \"113.206787\", \"23.200648\", \"1646388623\", \"21.0\" ], [ \"113.206822\", \"23.200731\", \"1646388629\", \"19.0\" ], [ \"113.207043\", \"23.201234\", \"1646388635\", \"24.0\" ], [ \"113.207443\", \"23.201999\", \"1646388641\", \"41.0\" ], [ \"113.207703\", \"23.202569\", \"1646388647\", \"40.0\" ], [ \"113.207933\", \"23.203141\", \"1646388653\", \"41.0\" ], [ \"113.208003\", \"23.203333\", \"1646388659\", \"37.0\" ], [ \"113.208253\", \"23.204002\", \"1646388665\", \"21.0\" ], [ \"113.208433\", \"23.204425\", \"1646388671\", \"31.0\" ], [ \"113.20862\", \"23.204888\", \"1646388677\", \"31.0\" ], [ \"113.208704\", \"23.205118\", \"1646388683\", \"31.0\" ], [ \"113.20878\", \"23.205335\", \"1646388689\", \"0.0\" ], [ \"113.208784\", \"23.205392\", \"1646388695\", \"10.0\" ], [ \"113.208814\", \"23.205442\", \"1646388701\", \"15.0\" ], [ \"113.209268\", \"23.205776\", \"1646388707\", \"30.0\" ], [ \"113.209775\", \"23.20573\", \"1646388713\", \"29.0\" ], [ \"113.210155\", \"23.205758\", \"1646388719\", \"21.0\" ], [ \"113.210395\", \"23.205877\", \"1646388725\", \"10.0\" ], [ \"113.210425\", \"23.205922\", \"1646388731\", \"2.0\" ], [ \"113.210425\", \"23.20593\", \"1646388737\", \"2.0\" ], [ \"113.210325\", \"23.206096\", \"1646388743\", \"18.0\" ], [ \"113.210155\", \"23.206384\", \"1646388749\", \"23.0\" ], [ \"113.209954\", \"23.206681\", \"1646388755\", \"22.0\" ], [ \"113.209774\", \"23.206905\", \"1646388761\", \"12.0\" ], [ \"113.209749\", \"23.206929\", \"1646388767\", \"0.0\" ], [ \"113.209754\", \"23.206904\", \"1646388773\", \"1.0\" ], [ \"113.209704\", \"23.20691\", \"1646388779\", \"1.0\" ], [ \"113.209684\", \"23.206892\", \"1646388785\", \"1.0\" ] ]",
// "et": "4/3/2022 20:32:58"


export type TrackPoint = number[];

export interface Track {
    _id: string;
    a: TrackPoint[];
    b: string;
    c: string;
    d: string;
    tid: string;
    vid: string;
    et: string;
}
export class Tracks {
    records: Track[];

    constructor(data) {
        Object.assign(this, data);
    }

    pointList = () => {
        return this.
            records.
            map(record => {
                let item = {
                    geometry: {
                        type: 'LineString',
                        coordinates: [],
                    }
                };
                record.a.map(point => {
                    item.geometry.coordinates.
                        push([point[0], point[1]]);
                })
                return item;
            }).flat();
    }

    lastPointList = () => {
        return this.
            records.
            map(record => {
                const point = record.a.pop();
                const coordinates = point && [point[0], point[1]];
                return {
                    geometry: {
                        type: 'Point',
                        coordinates: coordinates,
                    }
                };
            }).flat();
    }

    getVid = (index: number) => {
        return this.records[index].vid;
    }

    getPointList = (index: number) => {
        return this.records[index].a;
    }

    getLastPoint = (index: number): BMapGL.Point => {
        const point = this.records[index].a[this.records[index].a.length - 1];
        return new BMapGL.Point(Number(point[0]), Number(point[1]))
    }

    getPolyLines = (index: number) => {
        let points = this.records[index].a.map(point => {
            return { "lng": point[0], "lat": point[1] }
        }).flat();
        // 轨迹抽稀
        return sparsePoints(points, 0.0002).map(point =>
            new BMapGL.Point(Number(point.lng), Number(point.lat))
        ).flat()
    }

    getDuration = (index: number) => {
        return (Date.parse(this.records[index].c) - Date.parse(this.records[index].b)) / 10;
    }
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