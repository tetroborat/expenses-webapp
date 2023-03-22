import ActionButton from "../typicalElements/ActionButton";
import React, {useState} from "react";
import load from "../../utils/FetchLoad";
import ModalWindow from "../typicalElements/Modal";

export default function DeleteTypeButton(props) {
    const [showDelete, setShowDelete] = useState(false);
    function setShow(show) {
        props.setIsDoubleLayer(show)
        setShowDelete(show)
    }
    return (
        <>
            <ModalWindow
                body={SureDeleteType(props)}
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

function SureDeleteType(props) {
    return (
        <>
            <p className="lead ms-2 mb-0">
                Удалить тип <span className="badge" style={{backgroundColor: props.type.color}}>
                    <b>{props.type.name}</b>
                </span><br/> вместе с операциями?
            </p>
            <div className="d-flex mt-3">
                <ActionButton
                    onClick={() => deleteTypeButton(props, false)}
                    content="Только тип"
                />
                <ActionButton
                    onClick={() => deleteTypeButton(props, true)}
                    content="Вместе с операциями"
                />
            </div>
        </>
    )
}

function deleteTypeButton(props, with_operation) {
    let type = props.type
    load({
        path: `/transaction-type/delete/${type.id}`,
        method: 'DELETE'
    }).then(data => {
        props.addMessage(
            <span>
                Тип <span className="badge" style={{backgroundColor: type.color}}>
                    <b>{type.name}</b>
                </span> {data.success ? "удалён" : "удалить не получилось"}
            </span>
        )
        props.setIsDoubleLayer(false)
        props.backAction()
        props.updateData(with_operation)
    })
}