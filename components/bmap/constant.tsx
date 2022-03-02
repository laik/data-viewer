// 文档 https://lbs.baidu.com/solutions/mapvdata
/** 基础点图层 */
export const PointLayerType = 'PointLayer';
export interface PointLayerOptions {
	/** 颜色，同css颜色 */
	color?: string;
	/** 展示点的形状 */
	shape?: 'circle' | 'square';
	/** 点大小 默认: 5 */
	size?: number;
	/** 绘制大小的方式，即指定size属性的单位 */
	unit?: 'px' | 'm';
	/** 边框宽度 默认: 0 */
	borderWidth?: number;
	/** 边框颜色，同css颜色 */
	borderColor?: string;
	/** 点叠加模式，可选lighter */
	blend?: string;
}

/** Icon图标图层 */
export const IconLayerType = 'IconLayer';
export interface IconLayerOptions {
	/** icon图标 object(canvas dom) 、string(图片url地址) */
	icon?: string;
	/** 设置icon图标宽度 */
	width?: number;
	/** 设置icon图标高度 */
	height?: number;
	/** 绘制大小的方式，即指定width和height属性的单位 */
	unit?: 'px' | 'm';
	/** 设置icon缩放 */
	scale?: number;
	/** 设置icon按顺时针旋转角度 */
	angle?: number;
	/** 图层的透明度，值为0-1 */
	opacity?: number;
	/** icon是否随地图倾斜，即平躺在地图上 */
	flat?: boolean;
	/** icon图标偏移值，基于图标中心点偏移，[{number}x, {number}y] */
	offset?: [number, number];
	/** 生成icon雪碧图时，图标间的空隙 */
	padding?: [number, number];
}

/** 点轨迹图层 */
export const PointTripLayerType = 'PointTripLayer';
export interface PointTripLayerOptions {
	/** 颜色，同css颜色 */
	color?: string;
	/** 动画开始时间 */
	startTime?: number;
	/** 动画结束时间 */
	endTime?: number;
	/** 执行每次动画的步长 */
	step?: number;
	/** 动画的拖尾时长 */
	trailLength?: number;
}

/** 热力点图层 */
export const HeatPointLayerType = 'HeatPointLayer';
export interface HeatPointLayerType {
	/** 解释：展示方式 */
	style?: 'grid' | 'normal';
	/** 聚合半径，当style属性为grid时有效 */
	girdSize?: number;
	/** 渐变色 */
	gradient?: object;
	/** 最大阈值 */
	max?: number;
	/** 最小阈值 */
	min?: number;
}

/** 热点图图层 */
export const HeatmapLayerType = 'HeatmapLayer';
export interface HeatmapLayerOptions {
	/** 最大阈值 */
	max?: number;
	/** 最小阈值 */
	min?: number;
	/** 热力画笔笔触大小 */
	size?: number;
	/** 对应size的单位 */
	unit?: 'px' | 'm';
	/** 形成网格的最大高度，默认0效果最好，如无三维高度需求可不打开 */
	height?: number;
}

/** 热力柱图层 */
export const HeatGridLayerType = 'HeatGridLayer';
export interface HeatGridLayerOptions {
	/** 解释：展示方式 */
	style?: 'grid' | 'normal';
	/** 聚合半径，当style属性为grid时有效 */
	girdSize?: number;
	/** 渐变色 */
	gradient?: object;
	/** 最大阈值 */
	max?: number;
	/** 最小阈值 */
	min?: number;
	/** 最大高度 */
	maxHeight?: number;
	/** 最小高度 */
	minHeight?: number;
}

/** 烟花点图层 */
export const SparkLayerType = 'SparkLayer';
export interface SparkLayerOptions {
	/** 颜色，同css颜色 */
	color?: string;
	/** 烟花线的高度 */
	height?: number;
	/** 动画的速度 */
	step?: number;
	/** 动画开始时间 */
	startTime?: number;
	/** 动画结束时间 */
	endTime?: number;
}

/** 圆图层 */
export const CircleLayerType = 'CircleLayer';
export interface CircleLayerOptions {
	/** 设置圆的类型 */
	type?: 'simple' | 'wave' | 'bubble';
	/** 颜色，同css颜色 */
	color?: string;
	/** 圆的半径大小，带扩散效果时指的是中心圆的半径大小*/
	size?: number;
	/** 扩散效果的半径大小，设置值时需要比size的值大，否则看不出扩散效果，也可设置为函数，传入参数为中心圆半径 */
	radius?: number | ((size: number) => number);
	/** 扩散效果的动画周期 */
	duration?: number;
	/** 扩散效果的间隔时间 */
	trial?: number;
	/** 扩散效果的开始时间是否随机，设置为‘false’则表现为节奏一致 */
	random?: boolean;
}

/** 波纹点图层 */
export const RippleLayerType = 'RippleLayer';
export interface RippleLayerOptions {
	/** 颜色，同css颜色 */
	color?: string;
	/** 点大小 */
	size?: number;
	/** 对应size的单位 */
	unit?: 'px' | 'm';
	/** 动画循环一次的时间，时间越短，动画速度越快 */
	duration?: number;
}

/** 文字图层 */
export const TextLayerType = 'TextLayer';
export interface TextLayerOptions {
	/** 文字字体 */
	fontFamily?: string;
	/** 文字颜色，同css颜色 */
	color?: string;
	/** 文字大小 */
	fontSize?: string;
	/** 绘制大小的方式，即指定fontSize属性的单位 */
	unit?: 'px' | 'm';
	/** 设置icon按顺时针旋转角度 */
	angle?: number;
	/** icon是否随地图倾斜，即平躺在地图上 */
	flat?: boolean;
	/** 是否开启碰撞检测，开启后重叠部分的文字会被隐藏 */
	collides?: boolean;
	/** 文字偏移量，基于文字中心点偏移，[{number}x, {number}y] */
	offset?: [number, number];
	/** 文字内边距，[{number}左右边距, {number}上下边距] */
	padding?: [number, number];
	/** 文字外边距，[{number}左右边距, {number}上下边距] */
	margin?: [number, number];
}

/** 雷达图层 */
export const FanLayerType = 'FanLayer';
export interface FanLayerOptions {
	/** 雷达颜色，同css颜色 */
	color?: string;
	/** 雷达大小 */
	size?: number;
	/** 雷达扫描动画的步长，步长越大动画速度越快 */
	step?: number;
}

/** 基础线图层 */
export const SimpleLineLayerType = 'SimpleLineLayer';
export interface SimpleLineLayerOptions {
	/** 文字颜色，同css颜色 */
	color?: string;
	/** 线叠加模式，可选lighter */
	blend?: string;
}

/** 宽线图层 */
export const LineLayerType = 'LineLayer';
export interface LineLayerOptions {
	/** 文字颜色，同css颜色 */
	color?: string;
	/** 线叠加模式，可选lighter */
	blend?: string;
	/** 线的宽度 */
	width?: number;
	/** 绘制大小的方式，即指定size属性的单位 */
	unit?: 'px' | 'm';
	/** 定义虚线间隔的数组，数组长度为2。数组的两位分别表示实线和虚线的长度，单位像素，如[10, 20]表示实线10px，虚线20px */
	dashArray?: number[];
	/** 虚线偏移量，单位像素，可以通过实时改变该值来实现动画 */
	dashOffset?: number;
	/** 线的端头，可选butt 平头、square 方头、round 圆头 */
	lineCap?: 'butt' | 'square' | 'round';
	/** 线的连接拐角，可选miter 尖角、bevel 平角、round 圆角 */
	lineJoin?: 'miter' | 'bevel' | 'round';
	/** 由于在尖角情况下角度特别小时，尖角特别长，故用该参数来控制尖角突出部分的最大长度 */
	miterLimit?: string;
	/** 抗锯齿，默认关闭为false */
	antialias?: boolean;
	/** 沿法线方向的偏移，几乎很少使用到，设置该属性后只能用butt端头和miter连接，不然会出现问题 */
	offset?: number;
	// 动画属性
	/** 设置该参数来实现蝌蚪线动画，下面的属性生效依赖该值为true。注意，该属性只在初始化时读取一次，实例化后不可通过setOptions方法来重置。 */
	animation?: boolean;
	/** 该参数指定每条线段的长度，值为粒子长度占数据中最长的线整体长度的比例 */
	interval?: number;
	/** 动画的循环时间，单位为秒 */
	duration?: number;
	/** 动画的拖尾时长 */
	trailLength?: number;
	/** 地图视野大于等于一定级别时开启动画，默认值为3，即一直开启 */
	minZoom?: number;
	/** 地图视野小于等于一定级别时开启动画，默认值为21，即一直开启 */
	maxZoom?: number;
	// 贴图属性
	/** 设置该参数，可以在线上叠加一些图形来适用于一些场景。注意，该属性只在初始化时读取一次，实例化后不可通过setOptions方法来重置 */
	style?: 'road' | 'arrow';
	/** 控制贴图的样式，对象具有color和width属性 */
	styleOptions?: object;
}

/** 立体墙图层  */
export const WallLayerType = 'WallLayer';
export interface WallLayerOptions {
	/** 文字颜色，同css颜色 */
	color?: string;
	/** 渐变颜色模式，设置后color属性会失效，数据类型为Object。Object只有0和1两个键，0表示远地处的颜色，1表示近地处的颜色 */
	gradient?: object;
	/** 立体墙的高度 */
	height?: number;
	/** 纹理贴图，注意，宽高必须为2的次幂 */
	texture?: string;
	/** 开启精准贴图模式，纹理会按顶点间的实际距离对应拉伸，当使用的纹理有实际数据意义时开启 */
	enablePreciseMap?: boolean;
	/** 重复贴图，单位为米，如值为500代表500米重复一次贴图，值为0时不重复贴图 */
	repeatMap?: number;
}

/** 热力线图层 */
export const HeatLineLayerType = 'HeatLineLayer';
export interface HeatLineLayerOptions {
	/** 颜色，同css颜色 */
	color?: string;
	/** 展示点的形状 */
	shape?: 'circle' | 'square';
	/** 点大小 */
	size?: number;
	/** 绘制大小的方式，即指定size属性的单位 */
	unit?: 'px' | 'm';
	/** 边框宽度 默认: 0 */
	borderWidth?: number;
	/** 边框颜色，同css颜色 */
	borderColor?: string;
	/** 线叠加模式，可选lighter */
	blend?: string;
}

/** 蝌蚪线图层 */
export const LineFlowLayerType = 'LineFlowLayer';
export interface LineFlowLayerOptions {
	/** 颜色，同css颜色 */
	color?: string;
	/** 线叠加模式，可选lighter */
	blend?: string;
	/** 线的宽度 */
	width?: number;
	/** 该参数指定每条线段的长度，值为粒子长度占数据中最长的线整体长度的比例 */
	interval?: number;
	/** 动画的循环时间，单位为秒 */
	duration?: number;
	/** 动画的拖尾时长 */
	trailLength?: number;
	/** 地图视野大于等于一定级别时开启动画，默认值为3，即一直开启 */
	minZoom?: number;
	/** 地图视野小于等于一定级别时开启动画，默认值为21，即一直开启 */
	maxZoom?: number;
}

/** 线轨迹图层  */
export const LineTripLayerType = 'LineTripLayer';
export interface LineTripLayerOptions {
	/** 颜色，同css颜色 */
	color?: string;
	/** 动画开始时间 */
	startTime?: number;
	/** 动画结束时间 */
	endTime?: number;
	/** 执行每次动画的步长 */
	step?: number;
	/** 动画的拖尾时长 */
	trailLength?: number;
}

/** 墙轨迹图层  */
export const WallTripLayerType = 'WallTripLayer';
export interface WallTripLayerOptions {
	/** 立体墙的高度 */
	height?: number;
	/** 执行每次动画的步长 */
	step?: number;
	/** 动画的拖尾时长 */
	trailLength?: number;
	/** 动画开始时间 */
	startTime?: number;
	/** 动画结束时间 */
	endTime?: number;
}

/** 飞线图层 */
export const FlyLineLayerType = 'FlyLineLayer';
export interface FlyLineLayerOptions {
	/** 飞线动画方式 */
	style?: 'normal' | 'chaos';
	/** 底线颜色，同css颜色 */
	color?: string;
	/** 飞线动画颜色，同css颜色 */
	textureColor?: string;
	/** 飞线动画的宽度 */
	textureWidth?: number;
	/** 飞线动画的长度，占整条线的百分比，取值0-100 */
	textureLength?: number;
	/** 飞线动画的步长，步长越大动画速度越快 */
	step?: number;
}

/** 基础面图层 */
export const ShapeLayerType = 'ShapeLayer';
export interface ShapeLayerOptions {
	/** 颜色，同css颜色 */
	color?: string;
	/** 楼块透明度，0.0表示完全透明，1.0表示完全不透明，浮点数表示 */
	opacity?: number;
	/** 纹理贴图，注意，宽高必须为2的次幂 */
	texture: string;
	/** 点叠加模式，可选lighter */
	blend?: string;
	/** 楼块初始化升起动画的时间，单位毫秒 */
	riseTime?: number;
	/** 一些特效 */
	style?: 'normal' | 'window' | 'windowAnimation' | 'gradual';
}

/** 线状面图层 */
export const ShapeLineLayerType = 'ShapeLineLayer';
export interface ShapeLineLayerOptions {
	/** 颜色，同css颜色 */
	color?: string;
}

/** 平面图层 */
export const PolygonLayerType = 'PolygonLayer';
export interface PolygonLayerOptions {
	/** 描边线颜色，同css颜色 */
	lineColor?: string;
	/** 描边线宽度 */
	lineWidth?: number;
	/** 线的连接拐角，可选miter 尖角、bevel 平角、round 圆角 */
	lineJoin?: string;
	/** 定义虚线间隔的数组，数组长度为2。数组的两位分别表示实线和虚线的长度，单位像素，如[10, 20]表示实线10px，虚线20px */
	dashArray?: [number, number];
	/** 填充面颜色，同css颜色 */
	fillColor?: string;
	/** 填充面透明度，0.0表示完全透明，1.0表示完全不透明，浮点数表示 */
	fillOpacity?: number;
}

/** 遮罩图层 */
export const MaskLayerType = 'MaskLayer';
export interface MaskLayerOptions {
	/** 颜色，同css颜色 */
	color?: string;
	/** 遮罩高度，浮点数表示 */
	height?: number;
}

/** 点聚合图层 */
export const ClusterLayerType = 'ClusterLayer';
export interface ClusterLayerOptions {
	/** 聚合点展示的最小直径 */
	minSize?: number;
	/** 聚合点展示的最大直径 */
	maxSize?: number;
	/** 聚合半径，像素值 */
	clusterRadius?: number;
	/** 是否显示文字 */
	showText?: boolean;
	/** 聚合的最大地图级别，当地图级别高于此值时不再聚合 */
	maxZoom?: number;
	/** 聚合的最小地图级别，当地图级别低于此值时不再聚合 */
	minZoom?: number;
	/** 聚合点的颜色梯度，属性名0~1之间，属性值同css颜色值，通过Intensity拾取 */
	gradient?: object;
	/** 设置文字属性，支持文字图层所有参数 */
	textOptions?: object;
	/** 设置非聚合点显示的icon属性，而非显示一个点，支持Icon图层所有参数 */
	iconOptions?: object;
	/** 是否开启鼠标拾取，若想使用click等事件，需设置为true */
	enablePicked?: boolean;
}

/** 蜂窝图层 */
export const HoneycombLayerType = 'HoneycombLayer';
export interface HoneycombLayerOptions {
	/** 单个蜂窝图的横向宽度 */
	size?: number;
	/** 蜂窝图最大值的高度，设置为0时显示为平面 */
	height?: number;
	/** 是否开启点聚合，开启后会根据地图级别提前对距离较近的点进行聚合，牺牲精确度提高展示时的性能，建议数据量较大时打开 */
	enableCluster?: boolean;
	/** 是否显示文字 */
	showText?: boolean;
	/** 最大地图级别，当地图级别高于此值时不再更新图层数据 */
	maxZoom?: number;
	/** 最小地图级别，当地图级别低于此值时不再更新图层数据 */
	minZoom?: number;
	/** 蜂窝图的颜色梯度，属性名0~1之间，属性值同css颜色值，通过Intensity拾取 */
	gradient?: object;
	/** 设置文字属性，支持文字图层所有参数 */
	textOptions?: object;
}

/** 标注点图层 */
export const MarkerListLayerType = 'MarkerListLayer';
export interface MarkerListLayerOptions {
	/** 内部点颜色，同css颜色 */
	fillColor?: string;
	/** 内部点大小，单位像素 */
	fillSize?: number;
	/** 内部点边框颜色，同css颜色  */
	fillBorderColor?: string;
	/** 内部点边框宽度 */
	fillBorderWidth?: string;
	/** 外部光晕颜色，同css颜色 */
	shadowColor?: string;
	/** 外部光晕大小，单位像素 */
	shadowSize?: string;
	/** 外部光晕边框颜色，同css颜色 */
	shadowBorderColor?: string;
	/** 外部光晕边框宽度 */
	shadowBorderWidth?: number;
	/** 文字颜色，同css颜色 */
	fontColor?: string;
	/** 文字大小，单位像素 */
	fontSize?: number;
	/** 文字字体 */
	fontFamily?: string;
}
