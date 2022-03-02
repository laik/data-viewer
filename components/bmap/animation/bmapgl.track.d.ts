declare namespace BMapGLLib {
	interface TrackAnimationOptions {
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
	class TrackAnimation {
		constructor(
			map: BMapGL.Map,
			poyline: BMapGL.Polyline,
			options?: TrackAnimationOptions
		);
		/** 开始动画 */
		start(): void;
		/** 终止动画 */
		cancel(): void;
		/** 设置动画轨迹折线覆盖物 */
		setPolyline(polyline: BMapGL.Polyline): void;
		/** 获取动画轨迹折线覆盖物 */
		getPolyline(): BMapGL.Polyline;
		/** 动画开始延迟，单位ms */
		setDelay(delay: number): void;
		/** 设置动画持续时间。建议根据轨迹长度调整，地图在轨迹播放过程中动态渲染，动画持续时间太短影响地图渲染效果。 */
		setDuration(duration: number): void;
		/** 获取动画持续时间 */
		getDuration(): number;
		/** 开启动画结束后总览视图缩放（调整地图到能看到整个轨迹的视野），默认开启 */
		enableOverallView(): void;
		/** 关闭动画结束后总览视图缩放（调整地图到能看到整个轨迹的视野），默认关闭 */
		disableOverallView(): void;
		/** 设置动画中的地图倾斜角度，默认55度 */
		setTilt(tilt: number): void;
		/** 获取动画中的地图倾斜角度 */
		getTilt(): number;
		/** 设置动画中的缩放级别，默认会根据轨迹情况调整到一个合适的级别 */
		setZoom(zoom: number): void;
		/** 设置动画中的缩放级别 */
		getZoom(): number;
	}
}
