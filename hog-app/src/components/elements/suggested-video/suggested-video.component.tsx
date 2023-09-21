import React from "react";
import { likePost } from "../../../api/actions/likePost";
import { SVGCommentChat } from "../../../assets/svg/SVGCommentChat.image";
import { SVGHeartLove } from "../../../assets/svg/SVGHeartLove.image";
import { SVGShare } from "../../../assets/svg/SVGShare.image";
import { typeVideo } from "../../../types/video";
import { ButtonAction } from "../button/button.component";
import { UserDisplay } from "../user-display/user-display.component";
import { Video } from "../video/video.component";
import "./suggested-video.component.scss";
import { useAppDispatch } from "../../../storage/storage";
import { openModalShare } from "../../../storage/features/modalShareSlice";

interface PostI {
    _id: string;
    title: string;
    date: string;
    user: {
        _id: string;
        username: string;
        email: string;
    };
    isLiked: boolean;
    nbComments: number;
    nbLikes: number;
    nbShares: number;
    urlVideo: string;
    urlImage: string;
    idUser: string;
}

export const SuggestedVideo = ({ post }: { post: PostI }) => {
    const dispatch = useAppDispatch();
    const [isLiked, setIsLiked] = React.useState<boolean>(post.isLiked);
    const [nbLikes, setNbLikes] = React.useState<number>(post.nbLikes ?? 0);

    const handleLikes = () => {
        setIsLiked((isLiked) => {
            if (isLiked) {
                setNbLikes((nbLikes) => {
                    return nbLikes - 1 <= 0 ? 0 : nbLikes - 1;
                });
            } else {
                setNbLikes((nbLikes) => {
                    return nbLikes + 1;
                });
            }
            return !isLiked;
        });
    };

    const buttons = [
        {
            onClick: async () => {
                handleLikes();
                await likePost(post._id);
            },
            icon: (
                <SVGHeartLove
                    color={isLiked ? "red" : "white"}
                    width={36}
                    height={36}
                />
            ),
            nbAction: nbLikes ?? 0,
        },
        {
            onClick: () => {
                return;
            },
            icon: <SVGCommentChat color={"white"} width={32} height={32} />,
            nbAction: post.nbComments,
        },
        {
            onClick: () => {
                dispatch(openModalShare(post._id));
            },
            icon: <SVGShare color={"white"} width={36} height={36} />,
            nbAction: post.nbShares ?? 0,
        },
    ];

    return (
        <div className='suggest-post-box'>
            <UserDisplay user={post.user} />
            <Video
                idPost={post._id}
                urlPoster={post.urlImage}
                urlVideo={post.urlVideo}
                type={typeVideo.SUGGESTED_VIDEO}
            />
            <div className='icon-container'>
                {buttons.map((value, index) => (
                    <ButtonAction
                        key={index}
                        onClick={value.onClick}
                        icon={value.icon}
                        nbAction={value.nbAction}
                        textStyle={{ color: "white" }}
                    />
                ))}
            </div>
        </div>
    );
};
