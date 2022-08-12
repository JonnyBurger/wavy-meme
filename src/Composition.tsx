import {staticFile, useCurrentFrame, Video} from 'remotion';
import {AbsoluteFill} from 'remotion';
import {useEffect} from 'react';
import {useCallback} from 'react';
import {useVideoConfig} from 'remotion';
import {useRef} from 'react';

export const VideoOnCanvas: React.FC = () => {
	const video = useRef<HTMLVideoElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const {width, height} = useVideoConfig();
	const frame = useCurrentFrame();
	// Process a frame
	const onVideoFrame = useCallback(() => {
		if (!canvas.current || !video.current) {
			return;
		}
		const context = canvas.current.getContext('2d');
		if (!context) {
			return;
		}
		context.drawImage(video.current, 0, 0, width, height);
		const imageFrame = context.getImageData(0, 0, width, height);
		const {length} = imageFrame.data;

		const data = new ImageData(width, height);

		// If the pixel is very green, reduce the alpha channel
		for (let i = 0; i < length; i += 4) {
			const row = i / (width * 4);
			const red = imageFrame.data[i + 0];
			const green = imageFrame.data[i + 1];
			const blue = imageFrame.data[i + 2];

			const moveLeft = Math.cos(row / 100 + frame / 10) * 80;
			const indexShift = Math.floor(moveLeft) * 4;

			data.data[i + indexShift] = red;
			data.data[i + 1 + indexShift] = green;
			data.data[i + 2 + indexShift] = blue;
			data.data[i + 3 + indexShift] = 255;
		}
		context.putImageData(data, 0, 0);
	}, [frame, height, width]);

	// Synchronize the video with the canvas
	useEffect(() => {
		const {current} = video;
		if (!current?.requestVideoFrameCallback) {
			return;
		}
		let handle = 0;
		const callback = () => {
			onVideoFrame();
			handle = current.requestVideoFrameCallback(callback);
		};
		callback();
		return () => {
			current.cancelVideoFrameCallback(handle);
		};
	}, [onVideoFrame]);

	return (
		<AbsoluteFill>
			<AbsoluteFill>
				<Video
					ref={video}
					// Hide the original video tag
					style={{opacity: 0}}
					startFrom={30}
					src={staticFile('treadmill.mp4')}
				/>
			</AbsoluteFill>
			<AbsoluteFill>
				<canvas
					ref={canvas}
					style={{
						transform: `scale(1.3)`,
					}}
					width={width}
					height={height}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
