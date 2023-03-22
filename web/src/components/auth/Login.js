import {Component} from "react";
import {FloatingLabel, Form} from "react-bootstrap";
import load from "../../utils/FetchLoad";
import ActionButton from "../typicalElements/ActionButton";
import setCookie from "../../utils/SetCookie";


export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            isLoading: false,
            validated: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <Form noValidate className="text-dark h-50 w-50 mx-auto"
                  validated={this.state.validated}
                  onSubmit={this.handleSubmit}>
                <FloatingLabel controlId="email" label="E-mail" className="mb-2">
                    <Form.Control name="email" type="email" placeholder="E-mail" required autocomplete="email"
                                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                  onChange={event => this.handleInputChange(event.target)}/>
                </FloatingLabel>
                <FloatingLabel controlId="password" label="Пароль" className="mb-4">
                    <Form.Control name="password" type="password" placeholder="Пароль" required
                                  onChange={event => this.handleInputChange(event.target)}/>
                </FloatingLabel>
                <ActionButton
                    isLoading={this.state.isLoading}
                    content="Войти"
                />
            </Form>
        )
    }

    handleInputChange(target) {
        target.value = target.value.replace(/[\u0430-\u044f\u0451]/ig, '')
        this.setState({
            [target.name]: target.value
        });
    }

    handleSubmit(event) {
        this.setState({
            isLoading: true
        })
        event.preventDefault();
        if (event.currentTarget.checkValidity() === false) {
            this.setState({
                validated: true,
                isLoading: false
            })
        } else {
            load({
                path: "/login",
                path_group:"/auth",
                method: 'POST',
                body: {
                    email: this.state.email,
                    password: this.state.password,
                }
            }).then(data => {
                if (data.success) {
                    let options = data.token
                    let name = options.name, value = options.value
                    delete options.name; delete options.value
                    setCookie(name, value, options)
                    this.props.succesResult()
                } else {
                    this.props.addMessage(data.message)
                }
                this.setState({
                    isLoading: false
                })
            })
        }
    }
}
