import React from "react";
import "./input.component.scss";
import { InputType } from "../../../pages/auth/constant/type.constant";

interface InputI {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;
    type?: InputType;
}

export const Input = ({
    value,
    setValue,
    placeholder,
    type = InputType.TEXT,
}: InputI) => {
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    return (
        <input
            type={type}
            className='input'
            placeholder={placeholder}
            value={value}
            onChange={handleOnChange}
        />
    );
};
