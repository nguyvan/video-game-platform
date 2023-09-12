import React from "react";
import { PostReturnI } from "../../../api/new-feed/getPost";
import "./principal-video.component.scss";
import { PostTitle } from "../post-title/post-title.component";
import { Comments } from "../comment/comments.component";
import { Video } from "../video/video.component";
import { CommentPost } from "../comment/comment-post.component";

export const PrincipalVideo = ({ post }: { post: PostReturnI | undefined }) => {
    if (!post) {
        return <></>;
    }

    return (
        <div className='hightlight-post-container'>
            <span id='logo-text'>HIT</span>
            <div className='responsive-container'>
                <div className='image-container'>
                    <Video
                        idPost={post?._id as string}
                        urlPoster={post?.urlImage}
                        urlVideo={post?.urlVideo}
                    />
                </div>
                <div className='post-title-container'>
                    <PostTitle post={post} />
                    <Comments idPost={post._id} />
                    <CommentPost idPost={post._id} />
                </div>
            </div>
        </div>
    );
};
