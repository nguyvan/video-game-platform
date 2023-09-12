import { createSearchParams, useNavigate } from "react-router-dom";
import "./user-display.component.scss";

interface UserI {
    _id: string;
    username: string;
    email: string;
    urlImage?: string;
    bio?: string;
}

export const UserDisplay = ({
    user,
    displayName = true,
    clickable = true,
    withMargin = true,
}: {
    user: UserI;
    displayName?: boolean;
    clickable?: boolean;
    withMargin?: boolean;
}) => {
    const navigate = useNavigate();

    const handleToProfile = () => {
        if (clickable) {
            navigate({
                pathname: "profile",
                search: `${createSearchParams({
                    q: user._id,
                }).toString()}`,
            });
        }
    };

    return (
        <div
            className='header-container'
            onClick={handleToProfile}
            style={{ marginBottom: withMargin ? "1vh" : 0 }}
        >
            {user.urlImage ? (
                <img src={user.urlImage} alt='' className='image-avatar' />
            ) : (
                <div className='image-no-avatar'>
                    <span>{user.username?.at(0)?.toUpperCase()}</span>
                </div>
            )}
            {displayName ? (
                <div className='comment-name'>{user.username}</div>
            ) : (
                <></>
            )}
        </div>
    );
};
