import TransactionTypeItem from "./TransactionTypeItem";
import {Card} from "react-bootstrap";
import Amount from "../typicalElements/Amount";
import React from "react";
import IconsListPlaceHolder from "../placeHolder/IconsListPlaceHolder";


export default function TransactionTypesList(props) {
    return (
        <>
            <h3 className="d-flex justify-content-between ms-4 me-3 mb-3">
                <span>{props.add ? 'Доходы' : 'Расходы'}</span>
                <Amount
                    amount={props.totalAmount}
                    symbol={props.symbol}
                />
            </h3>
            {
                props.isLoading ? <IconsListPlaceHolder/> :
                    <Card body className={`${props.add ? "card-with-draggable" : ""} mb-5`}>
                        <div className="icons">
                            {
                                (props.transactionTypes && props.transactionTypes.length > 0) ? props.transactionTypes.map(type => {
                                    return <TransactionTypeItem
                                        key={type.id}
                                        type={type}
                                        active={true}
                                        initDrag={props.add ? ({ pageX, pageY }) => props.initDrag({ pageX, pageY }, type.id) : void(0)}
                                        onClick={!props.add ? () => props.onClick({
                                            id: type.id,
                                            name: type.name,
                                            color: type.color,
                                            icon: type.icon,
                                            amount: type.amount
                                        }) : void(0)}
                                        symbol={props.symbol}
                                        setElementRef={ref => props.setElementRef(ref,
                                            {
                                                id: type.id,
                                                name: type.name,
                                                color: type.color,
                                                icon: type.icon,
                                                amount: type.amount,
                                                symbol: props.symbol
                                            }
                                        )}
                                    />
                                }) : ''
                            }
                            <div className="text-light g-1 icon-item pb-3"
                                 onClick={() => props.addInfo(({key: props.add ? 'replenishmentType' : 'expenseType'}))}>
                                <div className="d-flex justify-content-center">Добавить</div>
                                <p className="icon-item-image-block add-icon-item-image-block mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
                                         className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                                    </svg>
                                </p>
                            </div>
                        </div>
                    </Card>
            }
        </>
    )
}