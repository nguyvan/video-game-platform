import { PostReturnI } from "../../../api/new-feed/getPost";
import { UserDisplay } from "../user-display/user-display.component";
import "./post-title.component.scss";

export const PostTitle = ({ post }: { post: PostReturnI }) => {
    return (
        <div className='post-container'>
            <UserDisplay user={post.user} />
            <div className='title-container'>{post.title}</div>
        </div>
    );
};
