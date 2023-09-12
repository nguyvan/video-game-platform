import { SVGPropsI } from "./SVG.interface";

const SVGClose = (props: SVGPropsI) => {
    const height = props.height ? props.height.toString() : "45";
    const width = props.width ? props.width.toString() : "45";
    return (
        <svg
            width={width}
            height={height}
            viewBox='0 0 48 48'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
        >
            <rect width='48' height='48' fill='white' fillOpacity={1} />
            <path
                d='M14 14L34 34'
                stroke='#333'
                strokeWidth={1}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M14 34L34 14'
                stroke='#333'
                strokeWidth={1}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    );
};

export default SVGClose;
