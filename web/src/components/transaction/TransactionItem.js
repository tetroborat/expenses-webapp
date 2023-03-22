import Amount from "../typicalElements/Amount";

export default function TransactionItem(props) {
    const transaction = props.transaction
    return (
        <div className="px-4 list-group-item text-light" onClick={props.onClick}>
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-grid">
                    {transaction.type_name}
                    <small className="text-white-50">{props.date}</small>
                </div>
                <Amount
                    amount={transaction.amount}
                    symbol={transaction.symbol}
                />
            </div>
        </div>
    )
}