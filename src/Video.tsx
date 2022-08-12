import {Composition} from 'remotion';
import {VideoOnCanvas} from './Composition';

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={VideoOnCanvas}
				durationInFrames={250}
				fps={30}
				width={720}
				height={1280}
			/>
		</>
	);
};
