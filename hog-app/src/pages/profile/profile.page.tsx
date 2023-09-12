import "./profile.page.scss";
import logo from "../../assets/images/logo.png";
import { UserI } from "../../storage/features/userSlice";
import { InfoProfile } from "./components/info.component";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUserById } from "../../api/new-feed/getUser";
import React from "react";
import { PostReturnI, getPosts } from "../../api/new-feed/getPost";
import { VideoPrincipal } from "./components/video/video-principal.component";
import { Videos } from "./components/video/videos.component";
import { useAppDispatch, useAppSelector } from "../../storage/storage";
import { closeModalEdit } from "../../storage/features/modalEditSlice";
import { ModalBase } from "../../components/elements/modal/modal.base";
import { ModalItem } from "./components/modalItem/modalItem.component";

export const ProfilePage = () => {
    const navigate = useNavigate();

    const [params] = useSearchParams();
    const [user, setUser] = React.useState<UserI>();

    const [skip, setSkip] = React.useState<number>(0);
    const [posts, setPosts] = React.useState<PostReturnI[] | []>([]);

    const dispatch = useAppDispatch();
    const modalEdit = useAppSelector((state) => state.modalEdit.modalEdit);

    const handleCloseModalEdit = () => {
        dispatch(closeModalEdit());
    };

    const handleToHome = () => {
        navigate("/");
    };

    React.useEffect(() => {
        (async () => {
            const id = params.get("q");
            const response = await getUserById(id);
            setUser(response);
        })();
    }, []);

    React.useEffect(() => {
        (async () => {
            setSkip(0);
            const id = params.get("q");
            const response = await getPosts(0, false, id);
            setPosts(response);
        })();
    }, [params]);

    React.useEffect(() => {
        (async () => {
            const id = params.get("q");
            const response = await getPosts(skip, false, id);
            setPosts((posts) => {
                if (posts.length) {
                    if (skip) {
                        return [...posts, ...response];
                    } else {
                        return posts;
                    }
                } else {
                    return response;
                }
            });
        })();
    }, [skip]);

    return (
        <div className='background'>
            <div className='container'>
                <img src={logo} className='logo' onClick={handleToHome} />
                <div className='content'>
                    <div className='content-header'>
                        {user ? <InfoProfile user={user!} /> : <></>}
                        {posts.at(0) ? (
                            <VideoPrincipal
                                idPost={posts.at(0)?._id as string}
                                urlPoster={posts.at(0)?.urlImage}
                                urlVideo={posts.at(0)?.urlVideo}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                    <Videos posts={posts} setSkip={setSkip} />
                </div>
            </div>
            <ModalBase
                isOpen={modalEdit.isOpen}
                handleClose={handleCloseModalEdit}
                className='modal-edit'
                isOverlay={true}
                isFixed={true}
            >
                <ModalItem handleClose={handleCloseModalEdit} />
            </ModalBase>
        </div>
    );
};
