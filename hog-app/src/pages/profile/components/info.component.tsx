// import { SVGStar } from "../../../assets/svg/SVGStar.image";
import { Button } from "../../../components/elements/button/button.component";
import { UserI } from "../../../storage/features/userSlice";
import "./info.component.scss";
import { useAppDispatch, useAppSelector } from "../../../storage/storage";
import { DisplayNumber } from "./display-number.component";
import { openModalEdit } from "../../../storage/features/modalEditSlice";
import { Logout } from "../../../api/actions/logout";
import { useNavigate } from "react-router-dom";
import { Auth } from "../../../lib/auth";
import { getNumberPost } from "../../../api/actions/getNumberPost";
import React from "react";

export const InfoProfile = ({ user }: { user: UserI }) => {
    const mainUser = useAppSelector((selector) => selector.user.user) as UserI;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [displayInfo, setDisplayInfo] = React.useState<
        { title: string; nb?: number }[]
    >([
        {
            title: "members",
            nb: undefined,
        },
        {
            title: "videos",
            nb: undefined,
        },
        {
            title: "follow",
            nb: undefined,
        },
    ]);

    const handleOpenModalEdit = () => {
        dispatch(openModalEdit());
    };

    const handleLogout = async () => {
        await Logout();
        Auth.removeAuthData();
        navigate("/");
    };

    const isEditable = () => {
        if (!!mainUser._id && mainUser._id! === user._id) {
            return true;
        }
        return false;
    };

    React.useEffect(() => {
        (async () => {
            const nbPost = await getNumberPost(user._id);
            const nbMembers = 12456;
            const nbFollow = 15;
            setDisplayInfo((displayInfo) =>
                displayInfo.map((value) => {
                    if (value.title === "videos") {
                        value.nb = nbPost;
                    } else if (value.title === "members") {
                        value.nb = nbMembers;
                    } else if (value.title === "follow") {
                        value.nb = nbFollow;
                    }
                    return value;
                })
            );
        })();
    }, [user._id]);
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
                        {/* <div className='star-container'>
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
                        </div> */}
                        {isEditable() ? (
                            <Button
                                title='Edit'
                                onClick={handleOpenModalEdit}
                                className='button-edit'
                                style={{
                                    backgroundColor: "#462C53",
                                    marginRight: 10,
                                }}
                            />
                        ) : (
                            <></>
                        )}
                        {isEditable() ? (
                            <Button
                                title='Logout'
                                onClick={handleLogout}
                                className='button-edit'
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
                {displayInfo.map((value, index) =>
                    value.nb ? (
                        <DisplayNumber
                            title={value.title}
                            nb={value.nb}
                            key={index}
                        />
                    ) : (
                        <div key={index}></div>
                    )
                )}
            </div>
        </div>
    );
};
