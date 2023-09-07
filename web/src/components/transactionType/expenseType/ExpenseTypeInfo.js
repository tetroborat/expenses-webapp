import {Card} from "react-bootstrap";
import React, {Component} from "react";
import load from "../../../utils/FetchLoad";
import PieChart from '../../infographic/PieChart.tsx';
import GetIntervalPath from "../../../utils/GetIntervalPath";


export default class ExpenseTypeInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showDelete: false,
            isLoading: true
        }
        this.loadPieOfTypeWallets()
    }

    componentDidUpdate(props) {
        if (props.timeInterval !== this.props.timeInterval) {
            this.loadPieOfTypeWallets()
        }
    }

    render() {
        let expenseType = this.props.expenseType
        return (
            <div className="mb-5">
                <h3 className="d-flex justify-content-between mt-0 m-3">
                <span>
                    <span className="back-btn me-2" onClick={this.props.backAction}>
                        <i className="bi bi-chevron-left"></i>
                    </span>
                    {expenseType.name}
                </span>
                </h3>
                <Card body className="position-relative">
                    <h5 className="action-btn-group position-absolute d-flex justify-content-end mb-2">
                    <span className="action-btn me-1" onClick={() => this.props.addInfo(expenseType)}>
                        <i className="bi bi-pencil-square"></i>
                    </span>
                    </h5>
                    <PieChart isLoading={this.state.isLoading}
                              height={250}
                              width={250}
                              symbol={this.props.mainCurrencySymbol}
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

    loadPieOfTypeWallets() {
        load({
            path: `/infographic/pie-wallets/${
                this.props.expenseType.id
            }${
                GetIntervalPath(this.props.timeInterval)
            }`
        }).then(data => this.setState({data: data ? data : [], isLoading: false}))
    }
}

