import React from "react";
import { CommentReturnI, getComments } from "../../../api/new-feed/getComment";
import "./comments.component.scss";
import { Comment } from "./comment.component";
import { SocketContext } from "../../../contexts/socket.context";

interface CommentsI {
    idPost: string;
}

export const Comments = ({ idPost }: CommentsI) => {
    const [comments, setComments] = React.useState<CommentReturnI[] | []>([]);
    const [skip, setSkip] = React.useState<number>(0);
    const ref = React.useRef<HTMLDivElement>(null);
    const { socket } = React.useContext(SocketContext);

    const receiveComment = (args: CommentReturnI) => {
        if (args.idPost === idPost) {
            setComments((comments) => [...comments, args]);
        }
    };

    const trackScrolling = () => {
        if (ref.current) {
            const { scrollTop, scrollHeight, clientHeight } = ref.current;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight;
            if (isNearBottom) {
                setSkip((skip) => skip + 1);
            }
        }
    };

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        const isNearBottom =
            target.scrollTop + target.clientHeight >= target.scrollHeight;
        if (isNearBottom) {
            setSkip((skip) => skip + 1);
        }
    };

    React.useEffect(() => {
        socket?.connect();
        socket?.receiveComment(receiveComment);
        return () => {
            socket?.disconnect();
        };
    }, []);

    React.useEffect(() => {
        if (ref.current) {
            const element: HTMLDivElement = ref.current;
            element.addEventListener("scroll", trackScrolling);
            return () => {
                element.removeEventListener("scroll", trackScrolling);
            };
        }
    }, []);

    React.useEffect(() => {
        (async () => {
            setSkip(0);
            const response = await getComments(idPost);
            setComments(response);
        })();
    }, [idPost]);

    React.useEffect(() => {
        (async () => {
            const response = await getComments(idPost, skip);
            setComments((comments) => {
                if (comments.length) {
                    if (skip) {
                        return [...comments, ...response];
                    } else {
                        return comments;
                    }
                } else {
                    return response;
                }
            });
        })();
    }, [skip]);

    return (
        <div className='comment-container'>
            {comments.length ? (
                <div
                    className='comment-content'
                    ref={ref}
                    onScroll={handleScroll}
                >
                    {comments?.map((comment) => (
                        <Comment
                            comment={comment}
                            key={comment._id + new Date().toString()}
                        />
                    ))}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
