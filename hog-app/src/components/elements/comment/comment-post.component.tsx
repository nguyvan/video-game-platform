import React from "react";
import { SVGSendMessage } from "../../../assets/svg/SVGSendMessage.image";
import { UserI } from "../../../storage/features/userSlice";
import { useAppSelector } from "../../../storage/storage";
import { UserDisplay } from "../user-display/user-display.component";
import "./comment-post.component.scss";
import { postComment } from "../../../api/actions/postComment";
import { SocketContext } from "../../../contexts/socket.context";
import ObjectId from "bson-objectid";

interface CommentPostI {
    idPost: string;
}

export const CommentPost = ({ idPost }: CommentPostI) => {
    const user = useAppSelector((state) => state.user.user) as UserI;

    const [content, setContent] = React.useState<string>("");

    const { socket } = React.useContext(SocketContext);

    const handleChangeComment = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setContent(event.target.value);
    };

    const handleOnClick = async () => {
        if (content) {
            await postComment(idPost, content);
            const comment = {
                _id: new ObjectId().toString(),
                content,
                date: new Date().toISOString(),
                user,
                idUser: user._id,
                idPost: idPost,
            };
            socket?.postComment(comment);
            setContent("");
        }
    };

    return (
        <div className='comment-post-container'>
            <div className='user-position'>
                <UserDisplay
                    user={user}
                    displayName={false}
                    clickable={false}
                />
            </div>
            <div className='place-comment'>
                <textarea
                    className='comment-post-content'
                    value={content}
                    onChange={handleChangeComment}
                />
                <div className='icon-send-comment' onClick={handleOnClick}>
                    <SVGSendMessage color={"white"} />
                </div>
            </div>
        </div>
    );
};
