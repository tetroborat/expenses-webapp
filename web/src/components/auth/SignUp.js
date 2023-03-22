import {Component} from "react";
import {FloatingLabel, Form} from "react-bootstrap";
import load from "../../utils/FetchLoad";
import ActionButton from "../typicalElements/ActionButton";


export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            email: null,
            password: null,
            password2: null,
            isLoading: false,
            validated: false,
            role: "user"
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <Form noValidate className="text-dark h-50 w-50 mx-auto"
                  validated={this.state.validated}
                  onSubmit={this.handleSubmit}>
                <FloatingLabel controlId="name" label="Имя" className="mb-2">
                    <Form.Control name="name" type="text" placeholder="Имя" required autocomplete="given-name"
                                  onChange={event => this.handleInputChange(event.target)}/>
                </FloatingLabel>
                <FloatingLabel controlId="email" label="E-mail" className="mb-2">
                    <Form.Control name="email" type="email" placeholder="E-mail" required autocomplete="email"
                                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                  onChange={event => this.handleInputChange(event.target)}/>
                </FloatingLabel>
                <FloatingLabel controlId="password" label="Пароль" className="mb-2">
                    <Form.Control name="password" type="password" placeholder="Пароль" required
                                  onChange={event => this.handleInputChange(event.target)}/>
                </FloatingLabel>
                <FloatingLabel controlId="password2" label="Повтор пароля" className="mb-4">
                    <Form.Control name="password2" type="password" placeholder="Повтор пароля" required
                                  onChange={event => this.handleInputChange(event.target)}/>
                </FloatingLabel>
                <ActionButton
                    isLoading={this.state.isLoading}
                    content="Зарегистрироваться"
                />
            </Form>
        )
    }

    handleInputChange(target) {
        if (target.name !== 'name') {
            target.value = target.value.replace(/[\u0430-\u044f\u0451]/ig, '')
        }
        this.setState({
            [target.name]: target.value
        }, () => {
            if (target.type === 'password') {
                document.querySelectorAll('input[expenseType=password]').forEach(
                    item => {
                        item.setCustomValidity(
                            this.state.password !== this.state.password2 ? "Пароли отличаются" : ""
                        )
                    }
                )
            }
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
                path: "/signup",
                path_group:"/auth",
                method: 'POST',
                body: {
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password,
                    role: "user"
                }
            }).then(data => {
                if (data.success) {
                    this.props.addMessage(<span><b>{this.state.name}</b>, вы зарегистрированы. Авторизуйтесь для продолжения</span>)
                    this.props.succesResult()
                }
                this.setState({
                    isLoading: false
                })
            })
        }
    }
}
