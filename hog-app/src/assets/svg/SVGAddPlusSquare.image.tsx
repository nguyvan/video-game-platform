import { SVGPropsI } from "./SVG.interface";

export const SVGAddPlusSquare = (props: SVGPropsI) => {
    const height = props.height ? props.height.toString() : "24";
    const width = props.width ? props.width.toString() : "24";
    return (
        <svg
            width={width}
            height={height}
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                d='M12 7V12M12 12V17M12 12H7M12 12H17M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z'
                stroke={props.color}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    );
};