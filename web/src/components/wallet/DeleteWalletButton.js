import ActionButton from "../typicalElements/ActionButton";
import React, {useState} from "react";
import load from "../../utils/FetchLoad";
import ModalWindow from "../typicalElements/Modal";
import Badge from "../typicalElements/Badge";


export default function DeleteWalletButton(props) {
    const [showDelete, setShowDelete] = useState(false);
    function setShow(show) {
        props.setIsDoubleLayer(show)
        setShowDelete(show)
    }
    return (
        <>
            <ModalWindow
                body={SureDeleteWallet(props)}
                show={showDelete}
                cancelModal={setShow}
            />
            <h5 className="action-btn-group position-absolute d-flex">
                <span className="action-btn" onClick={setShow}>
                    <i className="bi bi-trash"></i>
                </span>
            </h5>
        </>
    )
}

function SureDeleteWallet(props) {
    return (
        <>
            <p className="lead ms-2 mb-0">
                Удалить кошелёк <Badge content={props.wallet.name} color={props.wallet.color}/>
                <br/> вместе с операциями?
            </p>
            <div className="d-flex mt-3">
                <ActionButton
                    onClick={() => deleteWalletButton(props, false)}
                    content="Только кошелёк"
                />
                <ActionButton
                    onClick={() => deleteWalletButton(props, true)}
                    content="Вместе с операциями"
                />
            </div>
        </>
    )
}

function deleteWalletButton(props, with_operation) {
    let wallet = props.wallet
    load({
        path: `/wallet/delete/${wallet.id}/${with_operation}`,
        method: 'DELETE'
    }).then(data => {
        props.addMessage(
            <span>
                Кошелёк <Badge content={wallet.name} color={wallet.color}/>
                {data.success ? "удалён" : "удалить не получилось"}
            </span>
        )
        props.setIsDoubleLayer(false)
        props.backAction()
        props.updateData(with_operation)
    })
}