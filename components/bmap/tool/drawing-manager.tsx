import DrawingManager, {
	DrawingManagerProps,
} from 'react-bmapgl/Library/DrawingManager';

export function BMapDrawingManager(props: DrawingManagerProps) {
	return <DrawingManager {...props} />;
}

BMapDrawingManager.defaultProps = {
	map: null,
};
