import {Component} from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import {Image} from "react-bootstrap";

export default class PlacementExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            now: new Date(),
        }
    }

    componentDidMount() {
        const self = this;
        self.interval = setInterval(function() {
            self.setState({
                now: new Date(),
            });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <ToastContainer className="p-3" position="bottom-end" containerPosition="fixed">
                {
                    Object.entries(this.props.messages).map(([key, message]) => {
                        const minutes = Math.round((this.state.now - message.date) / 60000)
                        return (
                            <Toast key={key} onClose={() => this.props.deleteMessage(key)} autohide>
                                <Toast.Header>
                                    <strong className="me-auto">
                                        <Image draggable="false" width={70} src="logo-md-dark.svg" alt="Expenses"/>
                                    </strong>
                                    <small>{!minutes ? 'сейчас': `${minutes} мин назад`}</small>
                                </Toast.Header>
                                <Toast.Body>{message.message}</Toast.Body>
                            </Toast>
                        )
                    })
                }
            </ToastContainer>
        )
    }
}