import {Component} from "react";
import AuthPage from "../page/AuthPage";
import PlacementExample from "../typicalElements/Toast";
import load from "../../utils/FetchLoad";
import deleteCookie from "../../utils/DeleteCookie";
import MainPage from "../page/MainPage";
import getCookie from "../../utils/GetCookie";

let defaultState = {
    isAuth: false,
    isSignup: false,
    messages: {},
    userInfo: {}
}

export default class StartBoard extends Component {
    constructor() {
        super();
        this.state = defaultState
    }

    render() {
        return (
            <div className="start-board text-light">
                {
                    this.state.isAuth ?
                        <MainPage userInfo={this.state.userInfo}
                                  logout={() => this.logout()}
                                  addMessage={message => this.addMessage(message)}/> :
                        <AuthPage isSignup={this.state.isSignup}
                                  isSignupSet={isSignup => this.setState({isSignup: isSignup})}
                                  successLogin={() => this.componentDidMount()}
                                  addMessage={message => this.addMessage(message)}/>
                }
                <PlacementExample
                    messages={this.state.messages}
                    deleteMessage={key => this.deleteMessage(key)}
                />
            </div>
        )
    }

    async componentDidMount() {
        if (getCookie('token') !== undefined) {
            this.checkToken()
        }
    }

    checkToken () {
        load({
            path: '/check-token',
            path_group: '/auth'
        }).then(data => {
            if (data.success) {
                this.setState({
                    isAuth: true,
                    userInfo: data.user_info
                })
            } else {
                deleteCookie('token')
                this.setState({
                    ...defaultState
                })
            }
        })
    }

    logout() {
        load({
            path: "/logout",
            path_group:"/auth"
        }).then(data => {
            if (data.success) {
                this.setState({
                    isAuth: false,
                })
                deleteCookie('token')
            }
        })
    }

    addMessage(message) {
        const messages= {...this.state.messages}
        messages[Object.keys(this.state.messages).length] = {
            message: message,
            date: new Date()
        }
        this.setState({
            messages: messages,
        })
    }

    deleteMessage(key) {
        const messages= {...this.state.messages}
        delete messages[key]
        this.setState({
            messages: messages,
        })
    }
}