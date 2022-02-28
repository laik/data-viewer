import { MapChildrenProps } from 'react-bmapgl/common';
import InfoWindow from 'react-bmapgl/Overlay/InfoWindow';

// https://huiyan.baidu.com/github/react-bmapgl/#/%E8%A6%86%E7%9B%96%E7%89%A9/InfoWindow

export interface BMapInfoWindowProps extends MapChildrenProps {
	/** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
	coordType?: 'bd09ll' | 'bd09mc';
	/** 信息窗口的坐标 */
	position: BMapGL.Point;
	/** 设置信息窗口的标题 */
	title?: string;
	/** 快速设置信息窗口的内容文本 */
	text?: string;
	/** 信息窗口的像素偏移 */
	offset?: BMapGL.Size;
	/** 是否在调用`Map.clearOverlays()`时清除此覆盖物 */
	enableMassClear?: boolean;
	/** 信息窗口宽度 */
	width?: number;
	/** 信息窗口高度 */
	height?: number;
	/** 信息窗口关闭事件的回调函数 */
	onClose?(e: Event): void;
	/** 信息窗口开启事件的回调函数 */
	onOpen?(e: Event): void;
	/** 鼠标点击信息窗口关闭按钮事件的回调函数 */
	onClickclose?(e: Event): void;
}

export function BMapInfoWindow(props: BMapInfoWindowProps) {
	return <InfoWindow {...props} />;
}

BMapInfoWindow.defaultProps = {
	map: null,
};
