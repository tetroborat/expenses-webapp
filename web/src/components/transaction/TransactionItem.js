import Amount from "../typicalElements/Amount";
import Svg from "../typicalElements/Svg";
import {ExpensesTypeImages, ReplenishmentTypeImages} from "../../index";

var TypeImages

export default function TransactionItem(props) {
    const transaction = props.transaction
    TypeImages = transaction.type.adding ? ReplenishmentTypeImages : ExpensesTypeImages
    return (
        <>
            { props.date ? <div className="px-4 my-2">
                <span>{props.date}</span>
            </div> : ''}
            <div className="px-4 list-group-item text-light" onClick={props.onClick}>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <div className="small-icon-item-image-block"
                             style={{backgroundColor: transaction.type.color}}>
                            <Svg url={TypeImages.dict[transaction.type.icon]}/>
                        </div>
                        <div className="d-grid" style={{lineHeight: 1.1}}>
                            <p className='m-0'>
                                {transaction.type.name}
                            </p>
                            <p className="text-white-50 m-0">
                                {transaction.wallet.name}
                            </p>
                            <small className="text-white-50" style={{fontWeight: 300}}>
                                {transaction.comment}
                            </small>
                        </div>
                    </div>
                    <div className={`${transaction.type.adding ? "adding-amount" : ""} lead`}>
                        <Amount
                            amount={transaction.amount}
                            symbol={transaction.currency.symbol}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}