import { SVGPropsI } from "./SVG.interface";

export const SVGCommentChat = (props: SVGPropsI) => {
    const height = props.height ? props.height.toString() : "30";
    const width = props.width ? props.width.toString() : "30";
    return (
        <svg
            width={width}
            height={height}
            viewBox='0 0 201 210'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                d='M10.3545 10H190.289V146.504H100.322L48.9119 199.589V146.504H10.3545V10Z'
                stroke='#F7F7FA'
                strokeWidth='20'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    );
};
