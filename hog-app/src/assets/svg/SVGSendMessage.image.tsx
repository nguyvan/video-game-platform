import { SVGPropsI } from "./SVG.interface";

export const SVGSendMessage = (props: SVGPropsI) => {
    const height = props.height ? props.height.toString() : "24";
    const width = props.width ? props.width.toString() : "24";
    return (
        <svg
            height={height}
            width={width}
            viewBox='0 0 1024 1024'
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            fill={props.color}
        >
            <path d='M729.173333 469.333333L157.845333 226.496 243.52 469.333333h485.674667z m0 85.333334H243.541333L157.824 797.504 729.173333 554.666667zM45.12 163.541333c-12.352-34.986667 22.762667-67.989333 56.917333-53.482666l853.333334 362.666666c34.645333 14.72 34.645333 63.829333 0 78.549334l-853.333334 362.666666c-34.133333 14.506667-69.269333-18.474667-56.917333-53.482666L168.085333 512 45.098667 163.541333z' />
        </svg>
    );
};
