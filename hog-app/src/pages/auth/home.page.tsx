import { Button } from "../../components/elements/button/button.component";
import { BackgroundComponent } from "./component/background/background.home.component";
import { useNavigate } from "react-router-dom";
import "./home.page.scss";

export const HomePage = () => {
    const navigate = useNavigate();

    const handleToPageLogin = () => {
        navigate("/login");
    };

    const handleToPageSignUp = () => {
        navigate("/signup");
    };

    return (
        <BackgroundComponent>
            <div className='button-container'>
                <Button
                    onClick={handleToPageLogin}
                    style={{ backgroundColor: "rgba(43, 47, 131, 0.6)" }}
                    title='connexion'
                />
                <Button
                    onClick={handleToPageSignUp}
                    style={{ backgroundColor: "#0E16D5", marginLeft: 50 }}
                    title="s'inscrire"
                />
            </div>
            <span className='login-title'>FOR GAMERS</span>
        </BackgroundComponent>
    );
};
