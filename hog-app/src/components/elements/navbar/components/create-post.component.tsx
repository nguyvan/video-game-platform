import React from "react";
import "./create-post.component.scss";
import { Video } from "../../video/video.component";
import ObjectID from "bson-objectid";
import { typeVideo } from "../../../../types/video";
import SVGClose from "../../../../assets/svg/SVGClose.image";
import { Button } from "../../button/button.component";
import { style } from "../../../../pages/auth/constant/style.constant";
import { createPost } from "../../../../api/actions/createPost";

interface CreatePostI {
    handleClose: () => void;
}

const listVideo = [
    "video/x-flv",
    "video/mp4",
    "application/x-mpegURL",
    "video/MP2T",
    "video/3gpp",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
];

export const CreatePost = ({ handleClose }: CreatePostI) => {
    const videoRef = React.useRef<HTMLInputElement>(null);
    const imageRef = React.useRef<HTMLInputElement>(null);

    const [content, setContent] = React.useState<string>("");
    const [video, setVideo] = React.useState<File>();
    const [image, setImage] = React.useState<File>();

    const handleChangeContent = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setContent(event.target.value);
    };

    const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files![0].type.match(/image/g)) {
            setImage(event.target.files![0]);
        }
    };

    const handleChangeVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (listVideo.includes(event.target.files![0].type)) {
            setVideo(event.target.files![0]);
        }
    };

    const refreshInput = (event: React.MouseEvent<HTMLInputElement>) => {
        event.currentTarget.value = "";
    };

    const handleVideoClick = () => {
        if (videoRef.current) {
            videoRef.current.click();
        }
    };

    const closeVideo = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setVideo(undefined);
    };

    const handleImageClick = () => {
        if (imageRef.current) {
            imageRef.current.click();
        }
    };

    const closeImage = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setImage(undefined);
    };

    const post = async () => {
        if (content && video) {
            const formData = new FormData();
            formData.set("title", content);
            formData.append("files", video);
            if (image) {
                formData.append("files", image);
            }
            await createPost(formData);
            handleClose();
            window.location.reload();
        }
    };

    return (
        <div className='createpost-item-container'>
            <span className='title'>Create your own post</span>
            <textarea
                value={content}
                onChange={handleChangeContent}
                className='content'
                placeholder='enter your content'
            />
            <input
                className='createpost-input-media'
                type='file'
                onChange={handleChangeImage}
                multiple={false}
                ref={imageRef}
                accept='image/*'
                onClick={refreshInput}
            />
            <input
                className='createpost-input-media'
                type='file'
                onChange={handleChangeVideo}
                multiple={false}
                ref={videoRef}
                onClick={refreshInput}
            />
            {video ? (
                <div
                    className='media-container'
                    onClick={handleVideoClick}
                    style={{ padding: 0, overflow: "hidden" }}
                >
                    <div className='svg-close' onClick={closeVideo}>
                        <SVGClose />
                    </div>
                    <Video
                        idPost={new ObjectID().toHexString()}
                        urlPoster={image ? URL.createObjectURL(image) : image}
                        urlVideo={video ? URL.createObjectURL(video) : video}
                        type={typeVideo.SUGGESTED_VIDEO}
                    />
                </div>
            ) : (
                <div className='media-container' onClick={handleVideoClick}>
                    <div className='no-media-title'>Add a video</div>
                </div>
            )}
            {video ? (
                image ? (
                    <div
                        className='media-container'
                        onClick={handleImageClick}
                        style={{ padding: 0, overflow: "hidden" }}
                    >
                        <div className='svg-close' onClick={closeImage}>
                            <SVGClose />
                        </div>
                        <img
                            src={image ? URL.createObjectURL(image) : image}
                            alt='...loading'
                        />
                    </div>
                ) : (
                    <div className='media-container' onClick={handleImageClick}>
                        <div className='no-media-title'>Add a poster</div>
                    </div>
                )
            ) : (
                <></>
            )}
            <div className='button-createpost-container'>
                <Button
                    title='cancel'
                    onClick={handleClose}
                    className='button-item-createpost'
                    textStyle={style.footerButtonText}
                />
                <Button
                    title='post'
                    onClick={post}
                    className='button-item-createpost'
                    textStyle={style.footerButtonText}
                />
            </div>
        </div>
    );
};
