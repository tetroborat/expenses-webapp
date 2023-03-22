import {Image} from "react-bootstrap";
import SignUp from "../auth/SignUp";
import Login from "../auth/Login";

export default function AuthPage(props) {
    return (
        <>
            <div className="mb-5 position-relative d-flex justify-content-center align-items-center text-white">
                <Image draggable="false" width={300} src="logo-md.svg" alt="Expanses"/>
            </div>
            <div className="mt-5">
                <div className="w-50 mx-auto d-flex text-light mb-4 login-button-group">
                    <h3 className={"m-auto py-2 px-4 login-button " + (props.isSignup ? "disable" : "")}
                        onClick={() => props.isSignupSet(false)}>
                        Авторизация
                    </h3>
                    <h3 className={"m-auto py-2 px-4 login-button " + (props.isSignup ? "" : "disable")}
                        onClick={() => props.isSignupSet(true)}>
                        Регистрация
                    </h3>
                </div>
                {
                    props.isSignup ?
                        <SignUp
                            addMessage={message => props.addMessage(message)}
                            succesResult={() => props.isSignupSet(false)}/> :
                        <Login
                            addMessage={message => props.addMessage(message)}
                            succesResult={props.successLogin}/>
                }
            </div>
        </>
    )
}