import { MapChildrenProps } from 'react-bmapgl/common';
import MapvglLayer from 'react-bmapgl/Layer/MapvglLayer';
import { MapVGLViewChildrenProps } from 'react-bmapgl/Layer/MapvglView';

export interface MapvglLayerProps
	extends MapChildrenProps,
		MapVGLViewChildrenProps {
	/** 绘制图层的构造函数名称，注意`区分大小写` */
	type: string;
	/** 绘制图层的参数，详情参考MapVGL各图层的文档 */
	options: MapVGL.LayerOptions;
	/** MapVGL绘制使用的GeoJSON数据 */
	data: MapVGL.GeoJSON[];
	/** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
	coordType?: 'bd09ll' | 'bd09mc';
	/** 自动聚焦视野 */
	autoViewport?: boolean;
	/** `autoViewport`打开时生效，配置视野的参数 */
	viewportOptions?: BMapGL.ViewportOptions;
	/** 获取内部方法 */
	getMethods?: Function;
}

export function BMapMapvglLayer(props: MapvglLayerProps) {
	return <MapvglLayer {...props} />;
}

BMapMapvglLayer.defaultProps = {
	map: null,
};
