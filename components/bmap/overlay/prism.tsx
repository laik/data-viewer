import Graphy, { GraphyProps } from 'react-bmapgl/Overlay/Graphy';


export interface PrismProps extends GraphyProps {
	/** 底面坐标数组 */
	points: BMapGL.Point[];
	/** 高度 */
	altitude: number;
	/** 棱柱样式自定义配置，可选 */
	options?: BMapGL.PrismOptions;
	/** 添加监听事件处理*/
	listeners?: {
		[event: string]: (evt: string, callback: (...args: any[]) => void) => void;
	};
}

/**
 * 创建3D棱柱覆盖物，构造函数里需要定义底面和高度。
 */
export class Prism extends Graphy<PrismProps> {
	overlay: BMapGL.Prism;

	constructor(props: PrismProps) {
		super(props);
	}

	getOverlay() {
		const { points, altitude, options } = this.props;
		let prism = new BMapGL.Prism(points, altitude, options);
		for (let [evt, cb] of Object.entries(this.props.listeners)) {
			prism.addEventListener(evt, cb);
		}
		return prism;
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
