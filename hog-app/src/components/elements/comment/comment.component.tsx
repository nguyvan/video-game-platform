import { UserDisplay } from "../user-display/user-display.component";
import "./comment.component.scss";

export interface CommentI {
    _id: string;
    idUser: string;
    idPost: string;
    content: string;
    date: string;
    user: {
        _id: string;
        username: string;
        email: string;
        urlImage: string;
        bio: string;
    };
}

export const Comment = ({ comment }: { comment: CommentI }) => {
    return (
        <div className='item-comment'>
            <UserDisplay user={comment.user} />
            <div className='comment-content'>{comment.content}</div>
        </div>
    );
};
