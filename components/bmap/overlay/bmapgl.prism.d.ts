/// <reference path="./bmapgl.base.d.ts" />
/// <reference path="./bmapgl.core.d.ts" />

declare namespace BMapGL {
  interface PrismOptions {
    /** 顶面填充颜色 */
    topFillColor?: string;
    /** 顶面填充颜色透明度，取值范围0-1 */
    topFillOpacity?: number;
    /** 侧面填充颜色 */
    sideFillColor?: string;
    /** 侧面填充颜色透明度，取值范围0-1 */
    sideFillOpacity?: number;
    /** 是否在调用map.clearOverlays清除此覆盖物，默认为true */
    enableMassClear?: boolean;
  }
  interface Prism extends BMapGL.Overlay {}
  class Prism {
    constructor(points: BMapGL.Point[], altitude: number, options?: PrismOptions)
  }
}