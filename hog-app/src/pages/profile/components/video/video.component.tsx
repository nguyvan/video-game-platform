import { Video } from "../../../../components/elements/video/video.component";
import { typeVideo } from "../../../../types/video";
import "./video.component.scss";

interface VideoI {
    urlPoster?: string;
    urlVideo?: string;
    idPost: string;
}

export const VideoComponent = ({ urlPoster, urlVideo, idPost }: VideoI) => {
    return (
        <div className='video-item-container'>
            <div className='video-item-content'>
                <Video
                    urlPoster={urlPoster}
                    urlVideo={urlVideo}
                    idPost={idPost}
                    type={typeVideo.SUGGESTED_VIDEO}
                />
            </div>
        </div>
    );
};
