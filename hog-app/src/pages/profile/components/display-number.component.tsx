import "./display-number.component.scss";

interface DisplayNumberI {
    title: string;
    nb: number;
}

export const DisplayNumber = ({ title, nb }: DisplayNumberI) => {
    const formatNb = (nb: number): string => {
        if (nb >= 1000000000) {
            return `${Math.floor(nb / 1000000000)}B`;
        } else if (nb >= 1000000) {
            return `${Math.floor(nb / 1000000)}M`;
        } else if (nb >= 1000) {
            return `${Math.floor(nb / 1000)}K`;
        }
        return nb.toString();
    };

    return (
        <div className='display-number-content'>
            <div className='title'>{title}</div>
            <div className='number-circle'>
                <span>{formatNb(nb)}</span>
            </div>
        </div>
    );
};
