import { SVGStar } from "../../../assets/svg/SVGStar.image";
import { Button } from "../../../components/elements/button/button.component";
import { UserI } from "../../../storage/features/userSlice";
import "./info.component.scss";
import { useAppDispatch, useAppSelector } from "../../../storage/storage";
import { DisplayNumber } from "./display-number.component";
import { openModalEdit } from "../../../storage/features/modalEditSlice";

const displayInfo = [
    {
        title: "members",
        nb: 12453,
    },
    {
        title: "videos",
        nb: 32,
    },
    {
        title: "follow",
        nb: 15,
    },
];

export const InfoProfile = ({ user }: { user: UserI }) => {
    const mainUser = useAppSelector((selector) => selector.user.user) as UserI;
    const dispatch = useAppDispatch();

    const handleOpenModalEdit = () => {
        dispatch(openModalEdit());
    };

    const isEditable = () => {
        if (!!mainUser._id && mainUser._id! === user._id) {
            return true;
        }
        return false;
    };
    return (
        <div className='profile-content'>
            <div
                className='header-container'
                onClick={() => {
                    return;
                }}
            >
                {user.urlImage ? (
                    <img src={user.urlImage} alt='' className='image-avatar' />
                ) : (
                    <div className='image-no-avatar'>
                        <span>{user.username?.at(0)?.toUpperCase()}</span>
                    </div>
                )}
                <div className='rate-content'>
                    <div className='comment-name'>{user.username}</div>
                    <div className='editable-content'>
                        <div className='star-container'>
                            {[...Array(5)].map((value, index) => {
                                const color =
                                    index <= 3 ? "#FFE03E" : "#D9D9D9";
                                return (
                                    <div key={index} className='star-item'>
                                        <SVGStar
                                            width={40}
                                            height={40}
                                            color={color}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        {isEditable() ? (
                            <Button
                                title='Edit'
                                onClick={handleOpenModalEdit}
                                style={{ backgroundColor: "#462C53" }}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
            {user.bio && user.bio.trim() ? (
                <div className='bio-content'>{user.bio}</div>
            ) : (
                <></>
            )}
            <div className='display-number-container'>
                {displayInfo.map((value, index) => (
                    <DisplayNumber
                        title={value.title}
                        nb={value.nb}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
};
