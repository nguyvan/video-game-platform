import React from "react";
import { useAppSelector } from "../../../../storage/storage";
import { UserI } from "../../../../storage/features/userSlice";
import { Button } from "../../../../components/elements/button/button.component";
import "./modalItem.component.scss";
import { updateProfile } from "../../../../api/actions/updateProfile";

export const ModalItem = ({ handleClose }: { handleClose: () => void }) => {
    const user = useAppSelector((state) => state.user.user) as UserI;
    const ref = React.useRef<HTMLInputElement>(null);
    const [username, setUsername] = React.useState<string>(user.username);
    const [bio, setBio] = React.useState<string>(user.bio ? user.bio : "");
    const urlImage = user.urlImage;

    const [imageToUpload, setImageToUpload] = React.useState<File>();

    const handleClickChange = () => {
        if (ref.current) {
            ref.current.click();
        }
    };

    const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files![0].type.match(/image/g)) {
            setImageToUpload(event.target.files![0]);
        }
    };

    const handleChangeUsername = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUsername(event.target.value);
    };

    const handleChangeBio = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(event.target.value);
    };

    const handleValidate = async () => {
        const formData = new FormData();
        formData.set("bio", bio);
        formData.set(
            "username",
            !username || username === user.username ? "" : username
        );
        if (imageToUpload) {
            formData.set("files", imageToUpload);
        }
        await updateProfile(formData);
        handleClose();
        window.location.reload();
    };

    return (
        <div className='modal-item-container'>
            <div className='modal-item-content'>
                {imageToUpload ? (
                    <img
                        src={URL.createObjectURL(imageToUpload)}
                        alt=''
                        className='image-avatar'
                    />
                ) : urlImage ? (
                    <img src={urlImage} alt='' className='image-avatar' />
                ) : (
                    <div className='image-no-avatar'>
                        <span>{username?.at(0)?.toUpperCase()}</span>
                    </div>
                )}
                <input
                    className='input-file-none'
                    type='file'
                    onChange={handleChangeImage}
                    multiple={false}
                    ref={ref}
                    accept='image/*'
                />
                <Button
                    title='edit'
                    onClick={handleClickChange}
                    className='button'
                />
            </div>
            <input
                type='text'
                placeholder='username'
                value={username}
                onChange={handleChangeUsername}
                className='input-username'
            />
            <textarea
                placeholder='bio'
                rows={10}
                value={bio}
                onChange={handleChangeBio}
                className='input-bio'
            />
            <Button
                title='validate'
                onClick={handleValidate}
                className='button-validate'
            />
        </div>
    );
};
