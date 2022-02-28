import { GraphyProps } from 'react-bmapgl/Overlay/Graphy';
import Polyline from 'react-bmapgl/Overlay/Polyline';

// https://huiyan.baidu.com/github/react-bmapgl/#/%E8%A6%86%E7%9B%96%E7%89%A9/Polyline

interface BMapPolylineProps
	extends Omit<Omit<GraphyProps, 'fillColor'>, 'fillOpacity'> {
	/** 折线的坐标数组 */
	path: BMapGL.Point[];
	/** 折线的颜色，同CSS颜色 */
	strokeColor?: string;
	/** 折线的宽度，单位为像素 */
	strokeWeight?: number;
	/** 线的透明度，范围`0-1` */
	strokeOpacity?: number;
	/** 设置线为实线、虚线、或者点状线 */
	strokeStyle?: 'solid' | 'dashed' | 'dotted';
	/** 可通过`map.clearOverlays()`方法移除 */
	enableMassClear?: boolean;
	/** 开启可编辑模式 */
	enableEditing?: boolean;
}

export function BMapPolyline(props: BMapPolylineProps) {
	return <Polyline {...props} />;
}

BMapPolyline.defaultProps = {
	map: null,
};
