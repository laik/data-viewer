import { MapChildrenProps } from 'react-bmapgl/common';
import MapvglView from 'react-bmapgl/Layer/MapvglView';

export interface MapvglViewProps extends MapChildrenProps {
	/** 后处理效果数组 */
	effects?: ('bloom' | 'bright' | 'blur')[];
	preserveDrawingBuffer?: boolean;
	children?: React.ReactElement[] | React.ReactElement;
}

export function BMapMapvglView(props: MapvglViewProps) {
  const { children } = props;
  return <MapvglView {...props}>{children}</MapvglView>;
};

BMapMapvglView.defaultProps = {
  map: null
};