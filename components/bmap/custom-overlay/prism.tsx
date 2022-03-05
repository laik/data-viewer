import Graphy, { GraphyProps } from 'react-bmapgl/Overlay/Graphy';


export enum PrismEvtType {
	CLICK = 'click',
	MOUSE_OVER = 'mouseover',
	MOUSE_OUT = 'mouseout',
}
export interface PrismProps extends GraphyProps {
	/** 底面坐标数组 */
	points: BMapGL.Point[] | [number, number][];
	/** 高度 */
	altitude: number;
	/** 棱柱样式自定义配置，可选 */
	/** 顶面填充颜色 */
	topFillColor?: string;
	/** 顶面填充颜色透明度，取值范围0-1 */
	topFillOpacity?: number;
	/** 侧面填充颜色 */
	sideFillColor?: string;
	/** 侧面填充颜色透明度，取值范围0-1 */
	sideFillOpacity?: number;
	/** 是否在调用map.clearOverlays清除此覆盖物，默认为true */
	enableMassClear?: boolean;
	/** 添加监听事件处理*/
	listeners?: {
		[event: string]: (evt: any, callback: (...args: any[]) => void) => void;
	};
	ref?: (ref: Prism) => void;
}

/**
 * 创建3D棱柱覆盖物，构造函数里需要定义底面和高度。
 */
export class Prism extends Graphy<PrismProps> {
	overlay: BMapGL.Prism;
	options = [
		'topFillColor',
		'topFillOpacity',
		'sideFillColor',
		'sideFillOpacity',
		'enableMassClear',
	];

	constructor(props: PrismProps) {
		super(props);

	}

	getOverlay() {
		const { altitude } = this.props;
		const points = this.parsePoints(this.props.points);
		this.overlay = new BMapGL.Prism(points, altitude, this.getOptions());
		if (this.props.listeners) {
			for (let [evt, cb] of Object.entries(this.props.listeners)) {
				this.overlay.addEventListener(evt, cb);
			}
		}
		return this.overlay;
	}

	parsePoints(posints: BMapGL.Point[] | [number, number][]): BMapGL.Point[] {
		let out: BMapGL.Point[] = posints.map(
			(position: BMapGL.Point | [number, number]) => {
				let point: BMapGL.Point;
				if (position instanceof Array) {
					point = new BMapGL.Point(position[0], position[1]);
				} else if (position instanceof BMapGL.Point) {
					point = position;
				} else {
					position = position as BMapGL.Point;
					point = new BMapGL.Point(position!.lng, position!.lat);
				}

				return point;
			}
		);

		return out;
	}

	render() {
		return null;
	}
}

export function BMapPrism(props: PrismProps) {
	return <Prism {...props} />;
}

BMapPrism.defaultProps = {
	map: null,
};
