import { MapChildrenProps } from 'react-bmapgl/common';
import MapvglView from 'react-bmapgl/Layer/MapvglView';

export interface MapvglViewProps extends MapChildrenProps {
	/** 后处理效果数组 */
	effects?: ('bloom' | 'bright' | 'blur')[];
	preserveDrawingBuffer?: boolean;
}

export function BMapMapvglView(props: MapvglViewProps) {
  return <MapvglView {...props}/>
};

BMapMapvglView.defaultProps = {
  map: null
};