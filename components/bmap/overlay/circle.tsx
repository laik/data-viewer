import Circle from 'react-bmapgl/Overlay/Circle';
import { GraphyProps } from 'react-bmapgl/Overlay/Graphy';

// https://huiyan.baidu.com/github/react-bmapgl/#/%E8%A6%86%E7%9B%96%E7%89%A9/Circle

export interface BMapCircleProps extends GraphyProps {
	/** 圆形的坐标数组 */
	center: BMapGL.Point;
	/** 圆形的半径，单位为米 */
	radius: number;
	/** 描边的颜色，同CSS颜色 */
	strokeColor?: string;
	/** 描边的宽度，单位为像素 */
	strokeWeight?: number;
	/** 描边的透明度，范围`0-1` */
	strokeOpacity?: number;
	/** 描边的样式，为实线、虚线、或者点状线 */
	strokeStyle?: 'solid' | 'dashed' | 'dotted';
	/** 面填充颜色，同CSS颜色 */
	fillColor?: string;
	/** 面填充的透明度，范围`0-1` */
	fillOpacity?: number;
	/** 可通过`map.clearOverlays()`方法移除 */
	enableMassClear?: boolean;
	/** 开启可编辑模式 */
	enableEditing?: boolean;
}

export function BMapCircle(props: BMapCircleProps) {
	return <Circle {...props} />;
}

BMapCircle.defaultProps = {
	map: null,
};
