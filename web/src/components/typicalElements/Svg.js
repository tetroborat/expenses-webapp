import {Component} from "react";
import {Spinner} from "react-bootstrap";

export default class Svg extends Component {
    state = {
        svg: null,
        loading: false,
    }

    componentDidMount() {
        fetch(this.props.url)
            .then(res => res.text())
            .then(text => this.setState({ svg: text }))
    }

    render() {
        const { loading, svg } = this.state;
            return (
                <div className='d-flex justify-content-center align-items-center h-100'
                     data-path={this.props.path} >
                    {
                        (loading || !svg) ?
                            <Spinner size='sm'/> :
                            <div className="w-100 h-100 m-0 p-0" dangerouslySetInnerHTML={{__html: svg}}/>
                    }
                </div>
            )
    }
}