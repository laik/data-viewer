import { MapApiLoaderHOC } from 'react-bmapgl/Map';

export const AK = 'l1i69UZi7aKCrzchRYRvPuUUQSvupFYO';

const loadTrackAnimationJS = () => {
	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = `//api.map.baidu.com/library/TrackAnimation/src/TrackAnimation_min.js`;
	document.body.appendChild(script);
};

export function withMapApi(ComposedComponent): any {
	loadTrackAnimationJS();
	return MapApiLoaderHOC({ ak: AK })(ComposedComponent);
}
