import Amount from "../typicalElements/Amount";
import Svg from "../typicalElements/Svg";
import {WalletImages} from "../../index";

export default function WalletItem(props) {
    const wallet = props.wallet
    return (
        <div className={(props.active ? "icon-item " : "") + "text-light g-1"}
             onMouseDown={props.initDrag}
             onClick={props.onClick ? props.onClick : void(0)}
             ref={props.setElementRef}>
            <div className="d-flex justify-content-center drag-name">{wallet.name}</div>
            <div className="wallet-icon-item-image-block icon-item-image-block mx-auto"
                style={{
                    backgroundColor: wallet.color,
                }}>
                <Svg url={WalletImages.dict[wallet.icon]}/>
            </div>
            <div className="drag-amount lead">
                <Amount
                    amount={wallet.amount}
                    symbol={wallet.symbol}
                />
            </div>
        </div>
    )
}