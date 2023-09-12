import { SVGPropsI } from "./SVG.interface";

export const SVGStar = (props: SVGPropsI) => {
    const height = props.height ? props.height.toString() : "24";
    const width = props.width ? props.width.toString() : "24";
    return (
        <svg
            width={width}
            height={height}
            viewBox='0 0 183 130'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                d='M91.5 0L112.941 49.4053H182.326L126.192 79.9394L147.633 129.345L91.5 98.8106L35.3665 129.345L56.8076 79.9394L0.674103 49.4053H70.0589L91.5 0Z'
                fill={props.color}
            />
        </svg>
    );
};
