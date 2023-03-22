import Modal from 'react-bootstrap/Modal';

export default function ModalWindow(props) {
    return (
        <Modal
            show={props.show}
            onHide={() => props.cancelModal()}
            centered
            size={props.size}
            className={props.className}
        >
            <Modal.Body>
                {props.body}
            </Modal.Body>
        </Modal>
    );
}
