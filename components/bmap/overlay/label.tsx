import { MapChildrenProps } from 'react-bmapgl/common';
import Label from 'react-bmapgl/Overlay/Label';

// https://huiyan.baidu.com/github/react-bmapgl/#/%E8%A6%86%E7%9B%96%E7%89%A9/Label

export interface BMapLabelProps extends MapChildrenProps {
	/** 坐标体系，可选百度经纬度坐标或百度墨卡托坐标 */
	coordType?: 'bd09ll' | 'bd09mc';
	/** 文本标注的坐标 */
	position: BMapGL.Point;
	/** 设置文本标注的内容 */
	text: string;
	/** 文本标注的像素偏移 */
	offset?: BMapGL.Size;
	/** 设置文本标注的样式 */
	style?: { [name: string]: React.ReactText };
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

export function BMapLabel(props: BMapLabelProps) {
	return <Label {...props} />;
}

BMapLabel.defaultProps = {
	map: null,
};
