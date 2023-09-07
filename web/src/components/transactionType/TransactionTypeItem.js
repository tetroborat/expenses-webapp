import Amount from "../typicalElements/Amount";
import Svg from "../typicalElements/Svg";
import {ExpensesTypeImages, ReplenishmentTypeImages} from "../../index";

var TypeImages

export default function TransactionTypeItem(props) {
    const type = props.type
    TypeImages = type.adding ? ReplenishmentTypeImages : ExpensesTypeImages 
    return (
        <div className={(props.active ? "icon-item " : "") + "text-light g-1"}
             onMouseDown={props.initDrag}
             onClick={props.onClick}
             ref={props.setElementRef}
        >
            <div className="d-flex justify-content-center drag-name">{type.name}</div>
            <div className={`${type.adding ? "z-300" : ""} icon-item-image-block mx-auto`}
                 style={{
                     backgroundColor: type.color,
                 }}>
                <Svg url={TypeImages.dict[type.icon]}/>
            </div>
            <div className="drag-amount lead">
                <Amount
                    amount={type.amount}
                    symbol={props.symbol}
                />
            </div>
        </div>
    )
}