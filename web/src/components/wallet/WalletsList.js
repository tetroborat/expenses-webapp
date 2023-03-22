import WalletItem from "./WalletItem";
import {Card} from "react-bootstrap";
import Amount from "../typicalElements/Amount";
import React from "react";
import IconsListPlaceHolder from "../placeHolder/IconsListPlaceHolder";


export default function WalletsList(props) {
    return (
        <div className="mb-5">
            <h3 className="d-flex justify-content-between mx-4 mb-3">
                <span>Кошельки</span>
                <Amount
                    amount={props.totalAmount}
                    symbol={props.symbol}
                />
            </h3>
            {
                props.isLoading ? <IconsListPlaceHolder/> :
                    <Card body className="wallets-card">
                        <div className="icons">
                            {
                                (props.wallets && props.wallets.length > 0) ? props.wallets.map(wallet => {
                                    return <WalletItem
                                        key={wallet.id}
                                        wallet={wallet}
                                        active={true}
                                        initDrag={({ pageX, pageY }) => props.initDrag({ pageX, pageY }, wallet.id)}
                                        setElementRef={ref => props.setElementRef(ref,
                                            {
                                                id: wallet.id,
                                                name: wallet.name,
                                                currency_id: wallet.currency_id,
                                                symbol: wallet.symbol,
                                                color: wallet.color,
                                                icon: wallet.icon,
                                                amount: wallet.amount
                                            }
                                        )}
                                    />
                                }) : ''
                            }
                            <div className="text-light g-1 icon-item"
                                 onClick={() => props.addInfo(({key: 'wallet'}))}>
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
        </div>
    )
}