import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../storage/storage";
import { ModalBase } from "../modal.base";
import { UserReturnI } from "../../../../api/new-feed/getUser";
import { getUsers } from "../../../../api/actions/getUsers";
import { SVGSearch } from "../../../../assets/svg/SVGSearch.image";
import "./modal-share.component.scss";
import { UserDisplay } from "../../user-display/user-display.component";
import SVGSquareChecked from "../../../../assets/svg/SVGSquareChecked.image";
import SVGSquare from "../../../../assets/svg/SVGSquare.image";
import { Button } from "../../button/button.component";
import { style } from "../../../../pages/auth/constant/style.constant";
import { closeModalShare } from "../../../../storage/features/modalShareSlice";
import { sharePost } from "../../../../api/actions/sharePost";

export const ModalShare = () => {
    const modalShare = useAppSelector((state) => state.modelShare.modalShare);
    const ditpatch = useAppDispatch();

    const ref = React.useRef<HTMLDivElement>(null);

    const [users, setUsers] = React.useState<UserReturnI[] | []>([]);
    const [selectedUsers, setSelectedUsers] = React.useState<
        UserReturnI[] | []
    >([]);

    const [skip, setSkip] = React.useState<number>(0);
    const [search, setSearch] = React.useState<string>("");

    const handleClose = () => {
        setUsers([]);
        setSelectedUsers([]);
        ditpatch(closeModalShare());
    };

    const share = async () => {
        await sharePost(
            selectedUsers.map((user) => user._id),
            modalShare.idPost!
        );
        handleClose();
    };

    const handleSelectUser = (user: UserReturnI) => {
        setSelectedUsers((selectedUsers) => {
            if (selectedUsers.find((user_) => user_._id === user._id)) {
                return selectedUsers.filter((user_) => user_._id !== user._id);
            } else {
                return [...selectedUsers, user];
            }
        });
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

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
    }, [ref.current]);

    React.useEffect(() => {
        (async () => {
            const response = await getUsers(
                skip,
                search ? search : undefined,
                false
            );
            setUsers((users) => {
                if (users.length) {
                    if (skip) {
                        return [...users, ...response];
                    } else {
                        return users;
                    }
                } else {
                    return response;
                }
            });
        })();
    }, [skip]);

    React.useEffect(() => {
        (async () => {
            setSkip(0);
            const response = await getUsers(0, search ? search : undefined);
            setUsers(response);
        })();
    }, [search, modalShare.idPost]);

    return modalShare.isOpen ? (
        <ModalBase
            isOpen={modalShare.isOpen}
            handleClose={() => {
                return;
            }}
            className='share-modal-parent'
            isFixed={true}
            isOverlay={true}
        >
            <div className='share-modal-container'>
                <div className='search-bar-container'>
                    <input
                        className='search-bar'
                        placeholder='Search'
                        value={search}
                        onChange={handleSearch}
                    />
                    <div className='svg-search-container'>
                        <SVGSearch width={24} height={24} />
                    </div>
                </div>
                <div
                    className='list-user-container'
                    ref={ref}
                    onScroll={handleScroll}
                >
                    {users.map((user) => (
                        <div className='user-item' key={user._id}>
                            <UserDisplay
                                user={user}
                                clickable={false}
                                withMargin={false}
                            />
                            <div
                                className='icon-container'
                                onClick={handleSelectUser.bind(this, user)}
                            >
                                {selectedUsers.length &&
                                selectedUsers.filter(
                                    (val) => val._id === user._id
                                ).length ? (
                                    <SVGSquareChecked width={24} height={24} />
                                ) : (
                                    <SVGSquare width={24} height={24} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='button-createpost-container'>
                    <Button
                        title='cancel'
                        onClick={handleClose}
                        className='button-item-createpost'
                        textStyle={style.footerButtonText}
                    />
                    <Button
                        title='share'
                        onClick={share}
                        className='button-item-createpost'
                        textStyle={style.footerButtonText}
                    />
                </div>
            </div>
        </ModalBase>
    ) : (
        <></>
    );
};
