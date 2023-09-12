import { Video } from "../../../../components/elements/video/video.component";
import "./video-principal.component.scss";

interface VideoI {
    urlPoster?: string;
    urlVideo?: string;
    idPost: string;
}

export const VideoPrincipal = ({ urlPoster, urlVideo, idPost }: VideoI) => {
    return (
        <div className='video-principal-container'>
            <div className='video-principal-content'>
                <Video
                    urlPoster={urlPoster}
                    urlVideo={urlVideo}
                    idPost={idPost}
                />
            </div>
        </div>
    );
};
