import React from "react";
import { NotifReturnI, getNotifs } from "../../../../api/notifs/getNotif";
import { useAppSelector } from "../../../../storage/storage";
import { typeModal } from "../../../../types/modal";
import { NotifItem } from "./notif.component";
import "./notifs.component.scss";

export const Notifs = () => {
    const [notifs, setNotifs] = React.useState<NotifReturnI[] | []>([]);
    const [skip, setSkip] = React.useState<number>(0);
    const modalNotif = useAppSelector((state) => state.modalNotif.modalNotif);
    const ref = React.useRef(null);

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
            const response = await getNotifs(
                modalNotif.type === typeModal.LIKE,
                0
            );
            setNotifs(response);
        })();
    }, [modalNotif.type]);

    React.useEffect(() => {
        (async () => {
            const response = await getNotifs(
                modalNotif.type === typeModal.LIKE,
                skip
            );
            setNotifs((notifs) => {
                if (notifs.length) {
                    if (skip) {
                        return [...notifs, ...response];
                    } else {
                        return notifs;
                    }
                } else {
                    return response;
                }
            });
        })();
    }, [skip]);

    return notifs.length ? (
        <div className='notifs-container'>
            <div className='notifs-content' ref={ref} onScroll={handleScroll}>
                <span className='title'>Notifications</span>
                {notifs.map((notif) => (
                    <NotifItem notif={notif} key={notif._id} />
                ))}
            </div>
        </div>
    ) : (
        <></>
    );
};
