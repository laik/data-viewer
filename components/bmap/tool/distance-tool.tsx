import DistanceTool, {
	DistanceToolProps,
} from 'react-bmapgl/Library/DistanceTool';

export function BMapDistanceTool(props: DistanceToolProps) {
	return <DistanceTool {...props} />;
}

BMapDistanceTool.defaultProps = {
	map: null,
};
