import { SVGPropsI } from "./SVG.interface";

export const SVGUserAccount = (props: SVGPropsI) => {
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
            <circle
                cx='12'
                cy='7'
                r='4'
                stroke={props.color}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M4 21V17C4 15.8954 4.89543 15 6 15H18C19.1046 15 20 15.8954 20 17V21'
                stroke={props.color}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    );
};
