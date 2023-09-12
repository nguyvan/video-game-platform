import React from "react";

import "./navbar.scss";
import logo from "../../../assets/images/logo.png";

import { SVGSearch } from "../../../assets/svg/SVGSearch.image";
import { SVGAddPlusSquare } from "../../../assets/svg/SVGAddPlusSquare.image";
import { SVGHeartLove } from "../../../assets/svg/SVGHeartLove.image";
import { SVGEmailMessage } from "../../../assets/svg/SVGEmailMessage.image";
import { SVGUserAccount } from "../../../assets/svg/SVGUserAccount.image";
import { SVGOption } from "../../../assets/svg/SVGOption.image";
import { ButtonAction } from "../button/button.component";
import { useNavigate } from "react-router-dom";
import { getNbNotif, viewNotif } from "../../../api/notifs/getNotif";
import { SocketContext } from "../../../contexts/socket.context";
import { useAppDispatch, useAppSelector } from "../../../storage/storage";
import {
    closeModal,
    openModal,
} from "../../../storage/features/modalNotifSlice";
import { typeModal } from "../../../types/modal";
import { ModalBase } from "../modal/modal.base";
import { CreatePost } from "./components/create-post.component";

const Navbar = () => {
    const ref = React.useRef<HTMLUListElement>(null);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [isOpenCreatePost, setIsOpenCreatePost] =
        React.useState<boolean>(false);

    const handleToggleCreatePost = () => {
        setIsOpenCreatePost((isOpenCreatePost) => !isOpenCreatePost);
    };

    const dispatch = useAppDispatch();
    const modalNotif = useAppSelector((state) => state.modalNotif.modalNotif);

    const [nbNotifLove, setNbNotifLove] = React.useState<number>(0);
    const [nbNotif, setNbNotif] = React.useState<number>(0);

    const { socket } = React.useContext(SocketContext);

    const navigate = useNavigate();

    const handleCloseModal = () => {
        if (modalNotif.isOpen) {
            dispatch(closeModal());
        }
    };

    const updateNbNotif = async () => {
        const nbNotifLove_ = await getNbNotif(true);
        const nbNotif_ = await getNbNotif(false);
        setNbNotifLove(nbNotifLove_);
        setNbNotif(nbNotif_);
    };

    const buttons = [
        {
            onClick: () => {
                handleToggleCreatePost();
            },
            icon: <SVGAddPlusSquare color='black' />,
        },
        {
            onClick: async () => {
                await viewNotif(true);
                dispatch(openModal(typeModal.LIKE));
                setNbNotifLove(0);
            },
            icon: <SVGHeartLove color='black' />,
            nbNotif: nbNotifLove,
        },
        {
            onClick: async () => {
                await viewNotif(false);
                dispatch(openModal(typeModal.NORMAL));
                setNbNotif(0);
            },
            icon: <SVGEmailMessage color='black' width={26} height={26} />,
            nbNotif,
        },
        {
            onClick: () => {
                navigate("/profile");
            },
            icon: <SVGUserAccount color='black' />,
        },
    ];

    const handleClick = () => {
        setIsOpen((isOpen) => {
            if (ref.current) {
                ref.current!.style.display = isOpen ? "none" : "flex";
                return !isOpen;
            }
            return isOpen;
        });
    };

    const handleResize = React.useCallback(
        (isOpen: boolean) => {
            if (window.innerWidth < 680) {
                if (isOpen) {
                    if (ref.current) {
                        ref.current!.style.display = "flex";
                    }
                } else {
                    if (ref.current) {
                        ref.current!.style.display = "none";
                    }
                }
            } else {
                if (ref.current) {
                    ref.current!.style.display = "flex";
                }
            }
        },
        [isOpen]
    );

    React.useEffect(() => {
        window.addEventListener("resize", handleResize.bind(this, isOpen));
        return () => {
            window.removeEventListener(
                "resize",
                handleResize.bind(this, isOpen)
            );
        };
    }, [handleResize, isOpen]);

    React.useEffect(() => {
        updateNbNotif();
    }, []);

    React.useEffect(() => {
        socket?.connect();
        socket?.receiveNotif(updateNbNotif);
        return () => {
            socket?.disconnect();
        };
    }, []);

    return (
        <div className='navbar-container' onClick={handleCloseModal}>
            <img src={logo} className='logo' />
            <div className='search-bar'>
                <div className='search-content'>
                    <SVGSearch className='svg-search' />
                    <input type='text' placeholder='SEARCH'></input>
                </div>
            </div>
            <ul ref={ref}>
                {buttons.map((value, index) => (
                    <li key={index}>
                        <ButtonAction
                            onClick={value.onClick}
                            icon={value.icon}
                            nbNotif={value.nbNotif}
                        />
                    </li>
                ))}
            </ul>
            <button className='btn-list' onClick={handleClick}>
                <SVGOption />
            </button>
            <ModalBase
                handleClose={handleToggleCreatePost}
                isOpen={isOpenCreatePost}
                isOverlay={true}
                isFixed={true}
                className='createpost-container'
            >
                <CreatePost handleClose={handleToggleCreatePost} />
            </ModalBase>
        </div>
    );
};

export default Navbar;
