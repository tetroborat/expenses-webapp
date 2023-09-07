import React, {Component} from "react";
import {FloatingLabel, Form} from "react-bootstrap";
import load from "../../utils/FetchLoad";
import ActionButton from "../typicalElements/ActionButton";
import {DOMAIN_WEB, ExpensesTypeImages, ReplenishmentTypeImages} from "../../index";
import FormalizeBody from "../../utils/FormalizeBody";
import Svg from "../typicalElements/Svg";
import DeleteTypeButton from "./DeleteTransactionTypeButton";
import Badge from "../typicalElements/Badge";

var TypeImages

export default class AddTransactionType extends Component {
    constructor(props) {
        TypeImages = props.add ? ReplenishmentTypeImages : ExpensesTypeImages
        super(props);
        let type, isEdit = !!props.info
        if (isEdit) {
            type = {...props.info.type}
        } else {
            type = {
                name: null,
                icon: TypeImages.paths[0],
                color: '#5547d0',
            }
        }
        this.state = {
            isEdit: isEdit,
            isLoading: false,
            validated: false,
            type: type
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <Form noValidate className="text-dark h-50"
                  validated={this.state.validated}
                  onSubmit={this.handleSubmit}>
                {
                    this.props.info ? <DeleteTypeButton
                        type={this.props.info.type}
                        updateData={this.props.updateData}
                        addMessage={this.props.addMessage}
                        backAction={this.props.backAction}
                        setIsDoubleLayer={this.props.setIsDoubleLayer}
                    /> : ''
                }
                <div className="d-flex text-light">
                    <h3 className="mb-4 mx-auto">Добавить тип</h3>
                </div>
                <div className="d-flex">
                    <div className="choose-icon-card mb-4 mx-auto text-white">
                        {
                            TypeImages.paths.map((path, index) =>
                                <Form.Check
                                    key={index}
                                    inline
                                    label={<Svg url={TypeImages.dict[path]}
                                                path={path}/>}
                                    name="icon"
                                    type="radio"
                                    value={(this.state.type.icon !== path).toString()}
                                    id={`icon-${index}`}
                                    onChange={event => this.handleInputChange(event.target)}
                                    style={{
                                        backgroundColor: this.state.type.icon !== path ?
                                            'lightgrey' : this.state.type.color,
                                    }}
                                />
                            )
                        }
                    </div>
                </div>
                <Form.Control
                    type="color"
                    name="color"
                    defaultValue={this.state.type.color}
                    className="w-100 mb-2"
                    onChange={event => this.handleInputChange(event.target)}
                />
                <FloatingLabel controlId="name" label="Название" className="mb-3">
                    <Form.Control name="name" type="text" placeholder="Наличные" required
                                  defaultValue={this.state.type.name}
                                  onChange={event => this.handleInputChange(event.target)}/>
                </FloatingLabel>
                <ActionButton
                    isLoading={this.state.isLoading}
                    content={this.state.isEdit ? 'Сохранить' : 'Добавить'}
                />
            </Form>
        )
    }

    handleInputChange(target) {
        let type = this.state.type
        if (target.type === 'radio') {
            let src = document.querySelectorAll(
                `[for=${target.id}] > div`
            )[0].getAttribute('data-path')
            src = src.replace(DOMAIN_WEB, "")
            type[target.name] = src
        } else {
            type[target.name] = target.value
        }
        this.setState({
            type: type
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
                path: this.state.isEdit ?
                    `/transaction-type/edit/${this.state.type.id}` :
                    '/transaction-type/add',
                method: 'POST',
                body: {
                    ...FormalizeBody(this.state.type),
                    adding: this.props.add
        }
            }).then(data => {
                let message
                if (data.success) {
                    this.props.updateData(this.state.type)
                    message =
                        <span>Тип <Badge
                            content={this.state.type.name}
                            color={this.state.type.color}/> {
                            this.state.isEdit ? 'сохранён' : 'добавлен'
                        }</span>
                } else if (data.message)
                    message = data.message
                else
                    message = 'Ошибка сервера, попробуйте повторить позже'
                this.props.addMessage(message)
                this.setState({
                    isLoading: false
                })
            })
        }
    }
}
