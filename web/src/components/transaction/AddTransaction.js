import React, {Component} from "react";
import {Button, Col, FloatingLabel, Form, OverlayTrigger, Popover, Row} from "react-bootstrap";
import load from "../../utils/FetchLoad";
import ActionButton from "../typicalElements/ActionButton";
import WalletItem from "../wallet/WalletItem";
import TransactionTypeItem from "../transactionType/TransactionTypeItem";
import FormalizeBody from "../../utils/FormalizeBody";
import DeleteTransactionButton from "./DeleteTransactionButton";
import FormalizeDate from "../../utils/FormalizeDate";

export default class AddTransaction extends Component {
    constructor(props) {
        super(props);
        const info = this.props.info
        let transaction = {
            currency_id: info.wallet.currency_id,
            type_id: info.type.id,
            wallet_id: info.wallet.id
        }
        transaction = {
            ...transaction,
            ...(info.transaction ? {
                id: info.transaction.id,
                performed_in: info.transaction.performed_in,
                amount: info.transaction.amount,
            } : {
                id: null,
                performed_in: new Date().toISOString(),
                amount: null,
            })
        }
        this.state = {
            is_loading: false,
            validated: false,
            transaction: transaction,
            wallet: getWalletFromList(props.wallets, transaction.wallet_id),
            type: getTypeFromList(props.expenseTypes, transaction.type_id) ??
                getTypeFromList(props.replenishmentTypes, transaction.type_id) ?? 
                getTypeFromList(props.allExpenseTypes, transaction.type_id)
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render () {
        return (
            <Form noValidate className="h-50"
                  id="add-transaction"
                  validated={this.state.validated}
                  onSubmit={this.handleSubmit}>
                {
                    this.props.info.transaction ? <DeleteTransactionButton
                        transaction={this.props.info.transaction}
                        updateData={this.props.updateData}
                        addMessage={this.props.addMessage}
                        backAction={this.props.backAction}
                        setIsDoubleLayer={this.props.setIsDoubleLayer}
                    /> : ''
                }
                <div className="d-flex">
                    <h3 className="mb-4 mx-auto">{this.props.info.transaction ? 'Изменить' : 'Добавить'} транзакцию</h3>
                </div>
                <div className="mb-4 d-flex justify-content-center">
                    <Col className="ms-5 ps-3 d-flex justify-content-center align-items-center">
                        <OverlayTrigger trigger="click" placement="left"
                                        rootClose={true}
                                        overlay={this.state.type.adding ? this.renderTypesPopover() : this.renderWalletsPopover()}>
                            <Button variant>
                                {this.state.type.adding ? <TransactionTypeItem
                                    key={this.state.type.id}
                                    type={this.state.type}
                                    active={false}
                                    symbol={this.props.symbol}
                                /> : 
                                <WalletItem
                                    key={this.state.wallet.id}
                                    wallet={this.state.wallet}
                                    active={false}
                                />}
                            </Button>
                        </OverlayTrigger>
                    </Col>
                    <div className="d-flex justify-content-center align-items-center col-1">
                        <h3>
                            <i className="bi bi-arrow-right"></i>
                        </h3>
                    </div>
                    <Col className="me-5 pe-3 d-flex justify-content-center align-items-center">
                        <OverlayTrigger trigger="click" placement="right"
                                        rootClose={true}
                                        overlay={!this.state.type.adding ? this.renderTypesPopover() : this.renderWalletsPopover()}>
                            <Button variant>
                                {!this.state.type.adding ? <TransactionTypeItem
                                    key={this.state.type.id}
                                    type={this.state.type}
                                    active={false}
                                    symbol={this.props.symbol}
                                /> : 
                                <WalletItem
                                    key={this.state.wallet.id}
                                    wallet={this.state.wallet}
                                    active={false}
                                />}
                            </Button>
                        </OverlayTrigger>
                    </Col>
                </div>
                <FloatingLabel controlId="performed_in" label="Дата" className="text-dark mb-2">
                    <Form.Control name="performed_in" type="date" placeholder="01.01.2023" required
                                  defaultValue={FormalizeDate(this.state.transaction.performed_in ?
                                      this.state.transaction.performed_in :
                                      '')}
                                  onChange={event => this.handleInputChange(event.target)}/>
                </FloatingLabel>
                <Row className="g-2 mb-3">
                    <Col>
                        <FloatingLabel controlId="amount" label="Сумма" className="text-dark">
                            <Form.Control name="amount" type="number" placeholder="10000" required
                                          defaultValue={this.state.transaction.amount}
                                          onChange={event => this.handleInputChange(event.target)}/>
                            <Form.Control.Feedback/>
                        </FloatingLabel>
                    </Col>
                    <Col className="d-flex justify-content-center align-items-center col-1 me-2">
                        <h4><b>{this.state.wallet.symbol}</b></h4>
                    </Col>
                </Row>
                <ActionButton
                    is_loading={this.state.is_loading}
                    content={this.props.info.transaction ? 'Сохранить' : 'Добавить'}
                />
            </Form>
        )
    }

    handleInputChange(target) {
        let transaction = this.state.transaction
        transaction[target.name] = target.type === 'date' ?
            new Date(target.valueAsNumber).toISOString() :
            target.value
        this.setState({
            transaction: transaction
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
            let transaction = this.state.transaction
            load({
                path: `/transaction/${
                    this.props.info.transaction ? 'edit' : 'add'
                }/${
                    transaction.wallet_id.toString()
                }/${
                    transaction.type_id.toString()
                }`,
                method: 'POST',
                body: FormalizeBody(transaction)
            }).then(data => {
                let message
                if (data.success) {
                    this.props.updateData()
                    message =
                        <span>
                            Транзакция <b>{transaction.name}</b> {
                            this.props.info.transaction ?
                                'изменена' : 'добавлена'}
                        </span>
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

    renderWalletsPopover () {
        return (
            <Popover>
                <Popover.Body>
                        <div className="icons d-grid align-items-center">
                            {
                                (this.props.wallets && this.props.wallets.length > 0) ? this.props.wallets.map(wallet => {
                                    return <WalletItem
                                        key={wallet.id}
                                        wallet={wallet}
                                        active={true}
                                        onClick={() => this.handleWallet(wallet)}
                                    />
                                }) : ''
                            }
                        </div>
                </Popover.Body>
            </Popover>
        )
    }

    renderTypesPopover() {
        return (
            <Popover>
                <Popover.Body>
                    <div className="icons d-grid align-items-center">
                        {
                            (this.props.expenseTypes && this.props.expenseTypes.length > 0) ? this.props.expenseTypes.map(type => {
                                return <TransactionTypeItem
                                    key={type.id}
                                    type={type}
                                    active={true}
                                    onClick={() => this.handleType(type.id)}
                                    symbol={this.props.symbol}
                                />
                            }) : ''
                        }
                    </div>
                </Popover.Body>
            </Popover>
        )
    }

    handleWallet(wallet) {
        let transaction = this.state.transaction
        transaction.wallet_id = wallet.id
        transaction.currency_id = wallet.currency_id
        this.setState({
            transaction: transaction
        })
    }

    handleType(type_id) {
        let transaction = this.state.transaction
        transaction.type_id = type_id
        this.setState({
            transaction: transaction
        })
    }
}

function getWalletFromList(walletList, walletID) {
    for (let i = 0; i < walletList.length; i++ ) {
        if (walletList[i].id == walletID) {
            return walletList[i]
        }
    }
}

function getTypeFromList(typeList, typeID) {
    for (let i = 0; i < typeList.length; i++ ) {
        if (typeList[i].id == typeID || typeList[i].ID == typeID) {
            return typeList[i]
        }
    }
}
