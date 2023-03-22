import {Button, Spinner} from "react-bootstrap";


export default function ActionButton(props) {
    let type = props.type === 'undefined' ? 'submit' : ''
    return (
        <div className="d-grid mx-auto">
            <Button className="btn-colorful" type={type} size="lg" variant="primary"
                    disabled={!!props.isLoading}
                    onClick={props.onClick}>
                {
                    props.isLoading ? <Spinner size="sm"/> : props.content
                }
            </Button>
        </div>
    )
}