import React, {Component} from "react";
import load from "../../utils/FetchLoad";
import {Col, FloatingLabel, Form, Row} from "react-bootstrap";
import ActionButton from "../typicalElements/ActionButton";
import {DOMAIN_WEB, WalletImages} from "../../index";
import FormalizeBody from "../../utils/FormalizeBody";
import Svg from "../typicalElements/Svg";
import DeleteWalletButton from "./DeleteWalletButton";
import Badge from "../typicalElements/Badge";

export default class AddWallet extends Component {
    constructor(props) {
        super(props);
        let wallet, is_edit = !!props.info
        if (is_edit) {
            wallet = {...props.info.wallet}
        } else {
            wallet = {
                id: null,
                name: null,
                amount: null,
                currency_id: this.props.currencies[0].id,
                icon: WalletImages.paths[0],
                color: '#5547d0'
            }
        }
        this.state = {
            is_edit: is_edit,
            is_loading: false,
            validated: false,
            wallet: wallet,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <Form noValidate className="text-dark h-50"
                  validated={this.state.validated}
                  onSubmit={this.handleSubmit}>
                {
                    this.props.info ? <DeleteWalletButton
                        wallet={this.props.info.wallet}
                        updateData={this.props.updateData}
                        addMessage={this.props.addMessage}
                        backAction={this.props.backAction}
                        setIsDoubleLayer={this.props.setIsDoubleLayer}
                    /> : ''
                }
                <div className="d-flex text-light mb-4 mt-3">
                    <h3 className="mx-auto">{this.state.is_edit ? 'Изменить' : 'Добавить'} кошелёк</h3>
                </div>
                <div className="d-flex">
                    <div className="choose-icon-card mb-4 mx-auto text-white">
                        {
                            WalletImages.paths.map((path, index) =>
                                <Form.Check
                                    key={index}
                                    inline
                                    label={<Svg url={WalletImages.dict[path]}
                                                path={path}/>}
                                    name="icon"
                                    type="radio"
                                    value={(this.state.wallet.icon !== path).toString()}
                                    id={`icon-${index}`}
                                    onChange={event => this.handleInputChange(event.target)}
                                    style={{
                                        backgroundColor: this.state.wallet.icon !== path ?
                                            'lightgrey' : this.state.wallet.color,
                                    }}
                                />
                            )
                        }
                    </div>
                </div>
                <Form.Control
                    type="color"
                    name="color"
                    defaultValue={this.state.wallet.color}
                    className="w-100 mb-2"
                    onChange={event => this.handleInputChange(event.target)}
                />
                <FloatingLabel controlId="name" label="Название" className="mb-2">
                    <Form.Control name="name" type="text" placeholder="Наличные" required
                                  defaultValue={this.state.wallet.name}
                                  onChange={event => this.handleInputChange(event.target)}/>
                </FloatingLabel>
                <Row className="g-2 mb-3">
                    <Col lg="5">
                        <FloatingLabel controlId="amount" label="Размер">
                            <Form.Control name="amount" type="number" step="0.01" placeholder="10000" required
                                          defaultValue={this.state.wallet.amount}
                                          onChange={event => this.handleInputChange(event.target)}/>
                            <Form.Control.Feedback/>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel controlId="currency_id" label="Валюта">
                            <Form.Select name="currency_id" aria-label="Floating label select example"
                                         defaultValue={this.state.wallet.currency_id}
                                         onChange={event => this.handleInputChange(event.target)}>
                                {this.props.currencies.map(currency => {
                                    return <option value={currency.id} key={currency.id} data-symbol={currency.symbol}>
                                        {currency.name} {currency.symbol}
                                    </option>
                                })}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>
                <ActionButton
                    is_loading={this.state.is_loading}
                    content={this.state.is_edit ? 'Сохранить' : 'Добавить'}
                />
            </Form>
        )
    }

    handleInputChange(target) {
        let wallet = this.state.wallet
        if (target.type === 'radio') {
            let src = document.querySelectorAll(
                `[for=${target.id}] > div`
            )[0].getAttribute('data-path')
            src = src.replace(DOMAIN_WEB, "")
            wallet[target.name] = src
        } else if (target.type === 'select-one' && this.state.is_edit) {
            wallet.symbol = target.options[target.selectedIndex].getAttribute('data-symbol')
            wallet[target.name] = target.value
        } else {
            wallet[target.name] = target.value
        }
        this.setState({
            wallet: wallet
        })
    }

    handleSubmit(event) {
        this.setState({
            is_loading: true
        })
        event.preventDefault();
        if (event.currentTarget.checkValidity() === false) {
            this.setState({
                validated: true,
                is_loading: false
            })
        } else {
            load({
                path: this.state.is_edit ? `/wallet/edit/${this.state.wallet.id}` : '/wallet/add',
                method: 'POST',
                body: FormalizeBody(this.state.wallet)
            }).then(data => {
                let message
                if (data.success) {
                    this.props.updateData(this.state.wallet)
                    message =
                        <span>Кошелёк <Badge content={this.state.wallet.name} color={this.state.wallet.color}/> {
                            this.state.is_edit ? 'сохранён' : 'добавлен'
                        }</span>
                } else if (data.message)
                    message = data.message
                else
                    message = 'Ошибка сервера, попробуйте повторить позже'
                this.props.addMessage(message)
                this.setState({
                    is_loading: false
                })
            })
        }
    }
}