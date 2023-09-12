import { SVGPropsI } from "./SVG.interface";

export const SVGOption = (props: SVGPropsI) => {
    const height = props.height ? props.height.toString() : "40";
    const width = props.width ? props.width.toString() : "40";
    return (
        <svg viewBox='0 0 100 80' width={width} height={height}>
            <rect width='100' height='20'></rect>
            <rect y='30' width='100' height='20'></rect>
            <rect y='60' width='100' height='20'></rect>
        </svg>
    );
};
