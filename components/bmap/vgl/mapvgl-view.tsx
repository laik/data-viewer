import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { MapChildrenProps } from 'react-bmapgl/common';
import MapvglView from 'react-bmapgl/Layer/MapvglView';

export interface MapvglViewProps extends MapChildrenProps {
	/** 后处理效果数组 */
	effects?: ('bloom' | 'bright' | 'blur')[];
	preserveDrawingBuffer?: boolean;
	children?: React.ReactElement[] | React.ReactElement;
}

@observer
class IMapvglView extends React.Component<MapvglViewProps> {
	@observable viewRef = null;

	render() {
		const { children } = this.props;
		return (
			<MapvglView
				ref={(ref) => {
					ref ? (this.viewRef = ref.view) : null;
				}}
				{...this.props}>
				{children
					? Array.isArray(children)
						? children.map((child) =>
								React.cloneElement(child, {
									map: this.props.map,
									view: this.viewRef,
								})
						  )
						: React.cloneElement(children, {
								map: this.props.map,
								view: this.viewRef,
						  })
					: null}
			</MapvglView>
		);
	}
}

export function BMapMapvglView(props: MapvglViewProps) {
	const { children } = props;
	return <IMapvglView {...props}>{children}</IMapvglView>;
}

BMapMapvglView.defaultProps = {
	map: null,
};
