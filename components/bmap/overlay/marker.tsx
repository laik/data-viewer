import { MapChildrenProps } from 'react-bmapgl/common';
import Marker from 'react-bmapgl/Overlay/Marker';

// https://huiyan.baidu.com/github/react-bmapgl/#/%E8%A6%86%E7%9B%96%E7%89%A9/Marker

type IconString =
	| 'simple_red'
	| 'simple_blue'
	| 'loc_red'
	| 'loc_blue'
	| 'start'
	| 'end'
	| 'location'
	| 'red1'
	| 'red2'
	| 'red3'
	| 'red4'
	| 'red5'
	| 'red6'
	| 'red7'
	| 'red8'
	| 'red9'
	| 'red10'
	| 'blue1'
	| 'blue2'
	| 'blue3'
	| 'blue4'
	| 'blue5'
	| 'blue6'
	| 'blue7'
	| 'blue8'
	| 'blue9'
	| 'blue10';
interface BMapMarkerProps extends MapChildrenProps {
	/** 标注点的坐标 */
	position: BMapGL.Point;
	/** 标注的Icon图标 */
	icon: BMapGL.Icon | IconString;
	/** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
	coordType?: 'bd09ll' | 'bd09mc';
	/** 自动聚焦视野 */
	autoViewport?: boolean;
	/** 标注的像素偏移 */
	offset?: BMapGL.Size;
	/** 是否在调用`Map.clearOverlays()`时清除此覆盖物 */
	enableMassClear?: boolean;
	/** 是否可拖拽 */
	enableDragging?: boolean;
	/** 是否将标注置于其他标注之上。默认情况下纬度低盖住纬度高的标注 */
	isTop?: boolean;
	/** 鼠标左键单击事件的回调函数 */
	onClick?(e: Event): void;
	/** 鼠标左键双击事件的回调函数 */
	onDbclick?(e: Event): void;
	/** 鼠标右键单击事件的回调函数 */
	onRightclick?(e: Event): void;
	/** 鼠标指针移入Marker事件的回调函数 */
	onMouseover?(e: Event): void;
	/** 鼠标指针移出Marker事件的回调函数 */
	onMouseout?(e: Event): void;
}

export function BMapMarker(props: BMapMarkerProps) {
	return <Marker {...props} />;
}

BMapMarker.defaultProps = {
	map: null,
};
