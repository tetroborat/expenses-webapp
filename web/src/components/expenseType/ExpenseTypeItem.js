import Amount from "../typicalElements/Amount";
import Svg from "../typicalElements/Svg";
import {TypeImages} from "../../index";

export default function ExpenseTypeItem(props) {
    const type = props.type
    return (
        <div className={(props.active ? "icon-item " : "") + "text-light g-1"}
             onClick={props.onClick}
             ref={props.setElementRef}
        >
            <div className="d-flex justify-content-center drag-name">{type.name}</div>
            <div className="icon-item-image-block mx-auto"
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