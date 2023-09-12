import React from "react";
import Navbar from "../elements/navbar/navbar.component";
import "../../assets/css/home-layout.component.scss";
import { useAppDispatch } from "../../storage/storage";
import { getUserById } from "../../api/new-feed/getUser";
import { updateUser } from "../../storage/features/userSlice";

interface HomeLayoutI {
    children: React.ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutI) => {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        (async () => {
            const userUpdate = await getUserById();
            dispatch(updateUser(userUpdate));
        })();
    }, []);

    return (
        <div className='background'>
            <Navbar />
            <div className='container'>{children}</div>
        </div>
    );
};
