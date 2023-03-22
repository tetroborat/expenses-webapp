import ModalWindow from "../typicalElements/Modal";
import ActionButton from "../typicalElements/ActionButton";
import {useState} from "react";
import {Col, Row} from "react-bootstrap";

export default function LogoutButton(props) {
    const [show, setShow] = useState(false);
    return (
        <>
            <ModalWindow
                body={renderLogoutBody(props, setShow)}
                show={show}
                cancelModal={setShow}
                size="sm"
            />
            <span className="action-btn" onClick={setShow}>
                <i className="bi bi-door-closed"></i>
            </span>
        </>
    )
}

function renderLogoutBody(props, setShow) {
    return (
        <>
            <p className="lead ms-2 mb-3">
                Выйти из учтёной записи?
            </p>
            <Row>
                <Col className="pe-2">
                    <ActionButton
                        onClick={props.onClick}
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