
import { MapApiLoaderHOC } from 'react-bmapgl/Map';

export const AK = 'l1i69UZi7aKCrzchRYRvPuUUQSvupFYO'

export function withMapApi(ComposedComponent): any {
  return MapApiLoaderHOC({ak: AK})(ComposedComponent);
}