import { createSearchParams, useNavigate } from "react-router-dom";
import { NotifReturnI } from "../../../../api/notifs/getNotif";
import { distanceTime } from "../../../../utils/time.utl";
import "./notif.component.scss";
import { useAppDispatch } from "../../../../storage/storage";
import { closeModal } from "../../../../storage/features/modalNotifSlice";

export const NotifItem = ({ notif }: { notif: NotifReturnI }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleToNotif = () => {
        dispatch(closeModal());
        navigate({
            pathname: "/",
            search: `${createSearchParams({
                q: notif.idPost,
            }).toString()}`,
        });
    };

    return (
        <div className='notif-container' onClick={handleToNotif}>
            <div className='notif-header-container'>
                <div className='notif-header-content'>
                    {notif.user.urlImage ? (
                        <img
                            src={notif.user.urlImage}
                            alt=''
                            className='image-avatar'
                        />
                    ) : (
                        <div className='image-no-avatar'>
                            <span>
                                {notif.user.username?.at(0)?.toUpperCase()}
                            </span>
                        </div>
                    )}
                    <span className='title'>{notif.title}</span>
                </div>
                <span className={notif.isClicked ? "time-click" : "time"}>
                    {distanceTime(notif.date)}
                </span>
            </div>
        </div>
    );
};
