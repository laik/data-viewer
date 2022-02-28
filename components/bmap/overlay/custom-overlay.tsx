import { MapChildrenProps } from 'react-bmapgl/common';
import CustomOverlay from 'react-bmapgl/Overlay/CustomOverlay';

// https://huiyan.baidu.com/github/react-bmapgl/#/%E8%A6%86%E7%9B%96%E7%89%A9/CustomOverlay

export interface BMapCustomOverlayProps extends MapChildrenProps {
	/** 标注点的坐标 */
	position: BMapGL.Point;
	/** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
	coordType?: 'bd09ll' | 'bd09mc';
	/** 自动聚焦视野 */
	autoViewport?: boolean;
	/** 标注的偏移值 */
	offset?: BMapGL.Size;
	/** 元素的zIndex属性 */
	zIndex?: number;
	/** 标注的偏移单位，可选米或者像素 */
	unit?: 'm' | 'px';
}

export function BMapCustomOverlay(props: BMapCustomOverlayProps) {
	return <CustomOverlay {...props} />;
}

BMapCustomOverlay.defaultProps = {
	map: null,
};
