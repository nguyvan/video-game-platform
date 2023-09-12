import { SVGPropsI } from "./SVG.interface";

export const SVGEmailMessage = (props: SVGPropsI) => {
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
            <rect
                x='3'
                y='5'
                width='18'
                height='14'
                rx='1'
                stroke={props.color}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M20 5.5L12 13L4 5.5'
                stroke={props.color}
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    );
};
