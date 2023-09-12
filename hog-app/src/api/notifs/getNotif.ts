import axios from "../../lib/axios";
import { UserReturnI } from "../new-feed/getUser";

export interface NotifReturnI {
    _id: string;
    type: string;
    title: string;
    date: string;
    user: UserReturnI;
    idUser: string;
    idSender: string;
    idPost: string;
    isViewed: boolean;
    isClicked: boolean;
}

export const getNbNotif = async (isLiked: boolean): Promise<number> => {
    const response = await axios.get<{ nbNotif: number }>(
        "/user/notif/number",
        {
            params: {
                isLiked,
            },
        }
    );
    return response.data.nbNotif;
};

export const getNotifs = async (
    isLiked: boolean,
    skip: number
): Promise<NotifReturnI[]> => {
    const response = await axios.get<{ notifs: NotifReturnI[] }>(
        "/user/notifs",
        {
            params: {
                isLiked,
                skip,
            },
        }
    );

    return response.data.notifs;
};

export const viewNotif = async (isLiked: boolean): Promise<void> => {
    await axios.patch("/user/notif/view", {
        isLiked,
    });
};
