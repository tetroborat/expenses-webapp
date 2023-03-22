import React from "react";

export default function Amount(props) {
    const amount = props.amount
    return <span className={props.notCentered ? '' : 'd-flex justify-content-center'}>
            {FormalizeAmount(amount)}<b className="ms-1">{props.symbol}</b>
        </span>
}

function FormalizeAmount(amount) {
    const str = Number(parseFloat(amount).toFixed(2)).toLocaleString('ru-RU')
    return (str.endsWith('00') && str.includes(',')) ?
        str.substring(0, str.indexOf(",")) :
        (str[str.length - 2] == ',' && str.includes(',')) ?
            str + 0 :
            str
}
