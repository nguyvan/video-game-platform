import React, { useRef } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { formatTime } from "../../../utils/time.utl";
import { typeVideo } from "../../../types/video";
import "./video.component.scss";

interface VideoI {
    urlPoster?: string;
    urlVideo?: string;
    idPost: string;
    type?: typeVideo;
}

export const Video = ({
    urlPoster,
    urlVideo,
    idPost,
    type = typeVideo.PRINCIPAL_VIDEO,
}: VideoI) => {
    const ref = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();

    const [currentTime, setCurrentTime] = React.useState<string>("");
    const [duration, setDuration] = React.useState<string>("");

    const [pauseTime, setPauseTime] = React.useState<number>(0);

    const handleSelectVideo = () => {
        navigate({
            pathname: "/",
            search: `${createSearchParams({
                q: idPost,
            }).toString()}`,
        });
    };

    const handleLoadMetadata = () => {
        if (ref && ref.current) {
            const video: HTMLVideoElement = ref.current!;
            if (!video) return;
            else {
                setDuration(formatTime(video.duration));
            }
        }
    };

    const onMouseOver = async () => {
        if (ref && ref.current) {
            const video = ref.current!;
            if (!video) return;
            else {
                video.currentTime = pauseTime;
                const isPlaying =
                    video.currentTime > 0 &&
                    !video.paused &&
                    !video.ended &&
                    video.readyState > video.HAVE_CURRENT_DATA;
                if (!isPlaying) {
                    await video.play();
                }
            }
        }
    };

    const onMouseLeave = () => {
        if (ref && ref.current) {
            const video = ref.current;
            if (!video) return;
            else {
                video.play().then(() => {
                    video.load();
                    video.pause();
                });
            }
        }
    };

    const onTimeUpdate = () => {
        if (ref && ref.current) {
            const video = ref.current!;
            if (!video) return;
            else {
                setCurrentTime(
                    video.paused ? "" : formatTime(video.currentTime)
                );
                setPauseTime(!video.paused ? video.currentTime : pauseTime);
            }
        }
    };

    if (type === typeVideo.PRINCIPAL_VIDEO) {
        return (
            <video
                poster={urlPoster}
                controls
                id='video-poster'
                width='100%'
                height='auto'
            >
                <source src={urlVideo} type='video/mp4' />
            </video>
        );
    } else {
        return (
            <div
                className='video-container-suggest'
                onClick={handleSelectVideo}
            >
                <video
                    poster={urlPoster}
                    controls={false}
                    ref={ref}
                    onLoadedMetadata={handleLoadMetadata}
                    onMouseOver={onMouseOver}
                    onMouseLeave={onMouseLeave}
                    muted={true}
                    onTimeUpdate={onTimeUpdate}
                >
                    <source src={urlVideo} type='video/mp4' />
                </video>
                {duration ? (
                    <div className='duration'>
                        {currentTime ? currentTime + "/" : ""}
                        {duration}
                    </div>
                ) : (
                    <></>
                )}
            </div>
        );
    }
};
