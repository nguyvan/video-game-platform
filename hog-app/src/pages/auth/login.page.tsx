import { BackgroundBase } from "./component/background/background.base.component";
import { ModalBase } from "./component/modal/modalbase.component";
import logo from "../../assets/images/logo.png";
import { style } from "./constant/style.constant";
import { Input } from "../../components/elements/input/input.component";
import React from "react";
import { Button } from "../../components/elements/button/button.component";
import { InputType } from "./constant/type.constant";
import { useNavigate } from "react-router-dom";
import { requestLogin } from "../../api/auth/login";
import { Auth } from "../../lib/auth";
import { typeToken } from "../../types/token";
import { SocketContext } from "../../contexts/socket.context";
import { SocketClient } from "../../services/socket";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const { setSocket } = React.useContext(SocketContext);
    const handleSignup = async () => {
        navigate("/signup");
    };

    const handleLogin = async () => {
        if (!username || !password) {
            return;
        } else {
            const { token, exp } = await requestLogin({ username, password });
            Auth.set(typeToken.ACCESS_TOKEN, token);
            Auth.set(typeToken.EXP_ACCESS_TOKEN, exp);
            navigate("/");
            const socketClient = new SocketClient();
            socketClient.initializeSocket();
            socketClient.connect();
            setSocket!(socketClient);
        }
    };
    return (
        <BackgroundBase>
            <ModalBase
                visible={true}
                renderHeader={() => (
                    <div style={style.headerContainer}>
                        <img src={logo} style={style.headerImage} />
                    </div>
                )}
                renderContent={() => (
                    <div style={style.contentContainer}>
                        <Input
                            value={username}
                            setValue={setUsername}
                            placeholder='identifiant ou e-mail'
                        />
                        <Input
                            type={InputType.PASSWORD}
                            value={password}
                            setValue={setPassword}
                            placeholder='mot de passe'
                        />
                    </div>
                )}
                renderFooter={() => (
                    <div style={style.footerContainer}>
                        <Button
                            title='login'
                            onClick={handleLogin}
                            style={style.footerButton}
                            textStyle={style.footerButtonText}
                        />
                        <Button
                            title='sign up'
                            onClick={handleSignup}
                            style={style.footerButton}
                            textStyle={style.footerButtonText}
                        />
                    </div>
                )}
            />
        </BackgroundBase>
    );
};
