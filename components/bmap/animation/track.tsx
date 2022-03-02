import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component, MapChildrenProps } from 'react-bmapgl/common';

export interface BMapTrackAnimationProps extends MapChildrenProps {
	poyline: BMapGL.Polyline;
	/** 动画持续时常，单位ms */
	duration?: number;
	/** 动画开始延迟 */
	delay?: number;
	/** 是否在动画结束后总览视图缩放（调整地图到能看到整个轨迹的视野），默认开启 */
	overallView?: boolean;
	/** 设置动画中的地图倾斜角度，默认55度 */
	tilt?: number;
	/** 设置动画中的缩放级别，默认会根据轨迹情况调整到一个合适的级别 */
	zoom?: number;
}

@observer
export class BMapTrackAnimation extends Component<BMapTrackAnimationProps> {
	options = ['duration', 'delay', 'overallView', 'tilt', 'zoom'];
	static defaultProps: BMapTrackAnimationProps;
	@observable static trackAni: BMapGLLib.TrackAnimation = null;

	constructor(props) {
		super(props);
		const { map, poyline } = this.props;
		BMapTrackAnimation.trackAni = new BMapGLLib.TrackAnimation(
			map,
			poyline,
			this.getOptions()
		);
	}

	/** 开始动画 */
	static start() {
		BMapTrackAnimation.trackAni.start();
	}
	/** 终止动画 */
	static cancel() {
		BMapTrackAnimation.trackAni.cancel();
	}
	/** 设置动画轨迹折线覆盖物 */
	static setPolyline(polyline: BMapGL.Polyline): void {
		BMapTrackAnimation.trackAni.setPolyline(polyline);
	}
	/** 获取动画轨迹折线覆盖物 */
	static getPolyline(): BMapGL.Polyline {
		return BMapTrackAnimation.trackAni.getPolyline();
	}
	/** 动画开始延迟，单位ms */
	static setDelay(delay: number): void {
		BMapTrackAnimation.trackAni.setDelay(delay);
	}
	/** 设置动画持续时间。建议根据轨迹长度调整，地图在轨迹播放过程中动态渲染，动画持续时间太短影响地图渲染效果。 */
	static setDuration(duration: number): void {
		BMapTrackAnimation.trackAni.setDuration(duration);
	}
	/** 获取动画持续时间 */
	static getDuration(): number {
		return BMapTrackAnimation.trackAni.getDuration();
	}
	/** 开启动画结束后总览视图缩放（调整地图到能看到整个轨迹的视野），默认开启 */
	static enableOverallView(): void {
		BMapTrackAnimation.trackAni.enableOverallView();
	}
	/** 关闭动画结束后总览视图缩放（调整地图到能看到整个轨迹的视野），默认关闭 */
	static disableOverallView(): void {
		BMapTrackAnimation.trackAni.disableOverallView();
	}
	/** 设置动画中的地图倾斜角度，默认55度 */
	static setTilt(tilt: number): void {
		BMapTrackAnimation.trackAni.setTilt(tilt);
	}
	/** 获取动画中的地图倾斜角度 */
	static getTilt(): number {
		return BMapTrackAnimation.trackAni.getTilt();
	}
	/** 设置动画中的缩放级别，默认会根据轨迹情况调整到一个合适的级别 */
	static setZoom(zoom: number): void {
		BMapTrackAnimation.trackAni.setZoom(zoom);
	}
	/** 设置动画中的缩放级别 */
	static getZoom(): number {
		return BMapTrackAnimation.trackAni.getZoom();
	}

	render() {
		return null;
	}
}

BMapTrackAnimation.defaultProps = {
	map: null,
	poyline: null,
};
