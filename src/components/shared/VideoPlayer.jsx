import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Play, Maximize } from 'lucide-react';

/**
 * VideoPlayer component - Shows a poster thumbnail with a play button,
 * and swaps to the video (with controls) once clicked.
 * A ref exposes playFrom(seconds), used for chapter links.
 * lightPoster: for pale posters, drops the dark gradient and sets the label in a dark pill.
 */
const VideoPlayer = forwardRef(({
  src,
  poster,
  title,
  duration,
  lightPoster = false,
  className = '',
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  // Where to start once the video element has loaded (set by playFrom before it exists)
  const startAtRef = useRef(0);

  useImperativeHandle(ref, () => ({
    playFrom(seconds) {
      const video = videoRef.current;
      if (video) {
        video.currentTime = seconds;
        video.play().catch(() => {});
      } else {
        startAtRef.current = seconds;
        setIsPlaying(true);
      }
    },
  }), []);

  const handleLoadedMetadata = (event) => {
    if (startAtRef.current) {
      event.currentTarget.currentTime = startAtRef.current;
      startAtRef.current = 0;
    }
  };

  // Use the standard Fullscreen API, falling back to WebKit (Safari / iOS)
  const enterFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen().catch(() => {});
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
  };

  return (
    <div className={`relative aspect-video rounded-xl overflow-hidden bg-forest-deep shadow-lg ${className}`}>
      {isPlaying ? (
        <>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            onLoadedMetadata={handleLoadedMetadata}
            className="absolute inset-0 w-full h-full object-contain bg-forest-deep"
          >
            Your browser does not support embedded video.
          </video>
          <button
            type="button"
            onClick={enterFullscreen}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-forest-deep/70 text-white flex items-center justify-center hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Watch full screen"
            title="Full screen"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="group absolute inset-0 w-full h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-accent"
          aria-label={`Play video: ${title}`}
        >
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {!lightPoster && (
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 via-transparent to-transparent group-hover:from-forest-deep/75 transition-colors" />
          )}
          <span
            className={`absolute left-4 bottom-4 md:left-6 md:bottom-6 flex items-center gap-3 ${
              lightPoster ? 'bg-forest-deep/90 rounded-full p-1.5 sm:pr-5 shadow-lg' : ''
            }`}
          >
            <span className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">
              <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5" fill="currentColor" />
            </span>
            <span className="hidden sm:inline text-white font-semibold text-sm md:text-base text-left">
              Watch the video
            </span>
          </span>
          {duration && (
            <span className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-3 py-1 rounded-full bg-forest-deep/80 text-white text-xs font-semibold tracking-wide">
              {duration}
            </span>
          )}
        </button>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
