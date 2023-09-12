import "../../../../assets/css/background.home.scss";
import CardViolet from "../../../../assets/images/card_violet.png";
import CardBlack from "../../../../assets/images/card_black.png";
import CardHolo from "../../../../assets/images/card_holo.png";
import CardBlur from "../../../../assets/images/card_blur.png";

interface BackgroundComponentI {
    children: React.ReactNode;
}

export const BackgroundComponent = ({ children }: BackgroundComponentI) => {
    return (
        <div className='login-container'>
            <img src={CardViolet} className='login-image' id='card-violet' />
            <img src={CardBlack} className='login-image' id='card-black' />
            <img src={CardHolo} className='login-image' id='card-holo' />
            <img src={CardBlur} className='login-image' id='card-blur' />
            <div className='gradient' id='gradient-1'>
                <div id='eclipse' />
                <div id='planet-1' />
                <div id='planet-2' />
            </div>
            <div className='logo' />
            <div className='gradient' id='gradient-2'>
                <div id='eclipse-2' />
                <div id='rectangle' />
            </div>
            <div className='gradient' id='gradient-3'>
                <div id='eclipse-3' />
                <div id='planet-4' />
            </div>
            {children}
        </div>
    );
};
