import TransactionItem from "./TransactionItem";
import React from "react";
import {Card, FloatingLabel, Form, OverlayTrigger, Popover} from "react-bootstrap";
import ActionButton from "../typicalElements/ActionButton";
import FormalizeDate from "../../utils/FormalizeDate";
import TransactionsListPlaceHolder from "../placeHolder/TransactionsListPlaceHolder";


export default function TransactionsList(props) {
    return (
        <>
            <h3 className="d-flex justify-content-between ms-4 me-3 mb-3">
                <span>Операции за <OverlayTrigger
                    trigger="click"
                    placement="top"
                    rootClose={true}
                    overlay={renderDateIntervalPopover(props)}>
                        <a>март</a>
                    </OverlayTrigger>
                </span>
            </h3>
            {
                props.isLoading ? <TransactionsListPlaceHolder/> :
                    <Card>
                        <div className="transaction-list list-group list-group-flush">
                            {props.transactions && props.transactions.length ?
                                reduceTransactionsAndSeparateDate(props) :
                                placeHolder()}
                        </div>
                    </Card>
            }
        </>
    )
}

function renderDateIntervalPopover(props) {
    return (
        <Popover>
            <Popover.Body>
                <div className="d-flex">
                    <FloatingLabel controlId="from_date" label="С" className="text-dark mb-2 me-2">
                        <Form.Control name="from_date" type="date" placeholder="01.01.2023" required
                                      defaultValue={FormalizeDate(props.timeInterval.fromDate)}/>
                    </FloatingLabel>
                    <FloatingLabel controlId="to_date" label="По" className="text-dark mb-2">
                        <Form.Control name="to_date" type="date" placeholder="01.01.2023" required
                                      defaultValue={FormalizeDate(props.timeInterval.toDate)}/>
                    </FloatingLabel>
                </div>
                <ActionButton
                    is_loading={props.is_loading}
                    content={<i className="bi bi-check-lg"></i>}
                    onClick={() => props.selectDate({
                        fromDate: new Date(
                            document.getElementById('from_date').valueAsNumber
                        ).toISOString(),
                        toDate: new Date(
                            document.getElementById('to_date').valueAsNumber + 86399999
                        ).toISOString(),
                    })}
                />
            </Popover.Body>
        </Popover>
    )
}

function renderTransaction(transaction, pre_transaction, onClick) {
    return (
        <TransactionItem
            transaction={transaction}
            key={transaction.id}
            date={checkPreviousTransactionDate(transaction, pre_transaction) ?
                formatDate(transaction.performed_in) :
                ''}
            onClick={() => onClick({
                wallet: {
                    id: transaction.wallet_id,
                    symbol: transaction.symbol,
                    currency_id: transaction.currency_id
                },
                type: {
                    id: transaction.type_id,
                    name: transaction.type.name,
                },
                transaction: {
                    id: transaction.id,
                    amount: transaction.amount,
                    currency_id: transaction.currency_id,
                    wallet_id: transaction.wallet_id,
                    type_id: transaction.type_id,
                    performed_in: transaction.performed_in
                }
            })}
        />
    )
}

function checkPreviousTransactionDate(transaction, pre_transaction) {
    if (pre_transaction) {
        let current_date = +new Date(transaction.performed_in).getDate()
        let pre_date = +new Date(pre_transaction.props.transaction.performed_in).getDate()
        return current_date !== pre_date
    } else {
        return true
    }
}

function formatDate(string){
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(string).toLocaleDateString([],options);
}

function reduceTransactionsAndSeparateDate(props) {
    return props.transactions.reduce((transactions, transaction, i) => {
        return [
            ...transactions,
            renderTransaction(transaction, transactions[i-1], props.addInfo)
        ]
    }, [])
}

function placeHolder() {
    return (
        <div className="mx-auto my-4 lead">
            <em>Операций пока нет</em>
        </div>
    )
}