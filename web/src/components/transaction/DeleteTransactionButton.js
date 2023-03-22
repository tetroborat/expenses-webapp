import ActionButton from "../typicalElements/ActionButton";
import React, {useState} from "react";
import load from "../../utils/FetchLoad";
import {Col, Row} from "react-bootstrap";
import ModalWindow from "../typicalElements/Modal";

export default function DeleteTransactionButton(props) {
    const [showDelete, setShowDelete] = useState(false);
    function setShow(show) {
        props.setIsDoubleLayer(show)
        setShowDelete(show)
    }
    return (
        <>
            <ModalWindow
                body={SureDeleteTransaction(props,setShow)}
                show={showDelete}
                cancelModal={setShow}
                size="sm"
            />
            <h5 className="action-btn-group position-absolute d-flex">
                <span className="action-btn" onClick={setShow}>
                    <i className="bi bi-trash"></i>
                </span>
            </h5>
        </>
    )
}

function SureDeleteTransaction(props, setShow) {
    return (
        <>
            <p className="lead ms-2 mb-3">
                Удалить операцию?
            </p>
            <Row>
                <Col className="pe-2">
                    <ActionButton
                        onClick={() => deleteTransactionButton(props)}
                        content={<i className="bi bi-check-lg"> Да</i>}
                    />
                </Col>
                <Col className="ps-2">
                    <ActionButton
                        onClick={() => setShow()}
                        content={<i className="bi bi-x-lg"> Нет</i>}
                    />
                </Col>
            </Row>
        </>
    )
}

function deleteTransactionButton(props) {
    let transaction = props.transaction
    load({
        path: `/transaction/delete/${
            transaction.wallet_id.toString()
        }/${
            transaction.type_id.toString()
        }/${
            transaction.id.toString()
        }`,
        method: 'DELETE'
    }).then(data => {
        props.addMessage(
            <span>
                {data.success ? "Операция удалена" : "Не получилось удалить операцию"}
            </span>
        )
        props.setIsDoubleLayer(false)
        props.backAction()
        props.updateData()
    })
}