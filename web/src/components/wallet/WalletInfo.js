import {Card} from 'react-bootstrap';
import React, {Component} from 'react';
import Amount from '../typicalElements/Amount';
import load from '../../utils/FetchLoad';
import PieChart from '../infographic/PieChart.tsx';
import GetIntervalPath from "../../utils/GetIntervalPath";


export default class WalletInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            show_delete: false,
            isLoading: true
        }
        this.loadPieOfWalletTypes()
    }

    componentDidUpdate(props) {
        if (props.timeInterval !== this.props.timeInterval ||
            props.totalExpenseTypesAmount !== this.props.totalExpenseTypesAmount) {
            this.loadPieOfWalletTypes()
        }
    }

    render() {
        let wallet = this.props.wallet
        return (
            <div className='mb-5'>
                <h3 className='d-flex justify-content-between mt-0 m-3'>
                    <span>
                        <span className='back-btn me-2' onClick={this.props.backAction}>
                            <i className='bi bi-chevron-left'></i>
                        </span>
                        {wallet.name}
                    </span>
                    <Amount
                        amount={wallet.amount}
                        symbol={wallet.symbol}
                    />
                </h3>
                <Card body className='position-relative'>
                    <h5 className='action-btn-group position-absolute d-flex justify-content-end mb-2'>
                        <span className='action-btn me-1' onClick={() => this.props.addInfo(wallet)}>
                            <i className='bi bi-pencil-square'></i>
                        </span>
                    </h5>
                    <PieChart isLoading={this.state.isLoading}
                              height={250}
                              width={250}
                              symbol={wallet.symbol}
                              data={this.state.data.length ? this.state.data.map(item => ({
                                  name: item.name,
                                  value: Number(item.amount),
                                  color: item.color
                              })) : []}
                    />
                </Card>
            </div>
        )
    }

    loadPieOfWalletTypes() {
        load({
            path: `/infographic/pie-types/${
                this.props.wallet.id
            }/${
                false
            }${
                GetIntervalPath(this.props.timeInterval)
            }`
        }).then(data => this.setState({data: data ? data : [], isLoading: false}))
    }
}

// function valid() {
//     ...

//     fetch().then(result => {
//         if (result.error)
//         set(erros, result.error)
//     })
//     return errors
// }