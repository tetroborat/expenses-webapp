import ModalWindow from "../typicalElements/Modal";
import ActionButton from "../typicalElements/ActionButton";
import {Component, useState} from "react";
import {FloatingLabel, Form} from "react-bootstrap"
import load from "../../utils/FetchLoad";
import FormalizeBody from "../../utils/FormalizeBody";

export default function EditUserButton(props) {
    const [show, setShow] = useState(false);
    return (
        <>
            <ModalWindow
                body={<EditUserBody
                props={{...props,
                    successResult: setShow}}/>}
                show={show}
                cancelModal={setShow}
            />
            <span className="action-btn me-1" onClick={setShow}>
                <i className="bi bi-person-gear"></i>
            </span>
        </>
    )
}


class EditUserBody extends Component {
    constructor(props) {
        props = props.props
        super(props);
        this.state = {
            isLoading: false,
            validated: false,
            user: {
                name: props.userInfo.name,
                email: props.userInfo.email,
                currency_id: props.userInfo.currency.ID
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        let props = this.props.props
        return (
            <Form noValidate className="text-dark h-50 mx-auto"
                  validated={this.state.validated}
                  onSubmit={this.handleSubmit}>
                <div className="d-flex text-light mb-4 mt-3">
                    <h3 className="mx-auto">Изменить данные</h3>
                </div>
                <FloatingLabel controlId="name" label="Имя" className="mb-2">
                    <Form.Control name="name" type="text" placeholder="Имя"
                                  required autocomplete="given-name"
                                  defaultValue={this.state.user.name}
                                  onChange={event => this.handleInputChange(event.target)}/>
                </FloatingLabel>
                <FloatingLabel controlId="email" label="E-mail" className="mb-2">
                    <Form.Control name="email" type="email" placeholder="E-mail"
                                  required autocomplete="email"
                                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                  defaultValue={this.state.user.email}
                                  onChange={event => this.handleInputChange(event.target)}/>
                </FloatingLabel>
                <FloatingLabel controlId="currency_id" label="Валюта" className="mb-4">
                    <Form.Select name="currency_id" aria-label="Floating label select example"
                                 defaultValue={this.state.user.currency_id}
                                 onChange={event => this.handleInputChange(event.target)}>
                        {props.currencies.map(currency => {
                            return <option value={currency.id} key={currency.id} data-symbol={currency.symbol}>
                                {currency.name} {currency.symbol}
                            </option>
                        })}
                    </Form.Select>
                </FloatingLabel>
                <ActionButton
                    isLoading={this.state.isLoading}
                    content="Сохранить"
                />
            </Form>
        )
    }

    handleInputChange(target) {
        let user = this.state.user
        if (target.name !== 'name') {
            target.value = target.value.replace(/[\u0430-\u044f\u0451]/ig, '')
        } else if (target.type === 'select-one') {
            [target.name] = target.value
        }
        user[target.name] = target.value
        this.setState({
            user: user
        })
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
                path: "/edit_user",
                path_group:"/auth",
                method: 'POST',
                body: FormalizeBody(this.state.user)
            }).then(data => {
                let props = this.props.props
                if (data.success) {
                    props.addMessage(<span><b>{this.state.user.name}</b>
                        , изменения сохранены. <a href="/">Перезагрузите</a> страницу для продолжения</span>)
                    props.successResult()
                } else {
                    props.addMessage(<span><b>{this.state.user.name}</b>, что-то пошло не так. Попробуйте позже</span>)
                }
                this.setState({
                    isLoading: false
                })
            })
        }
    }
}
