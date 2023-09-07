import {Component} from "react";
import LineChart from "../infographic/LineChart.tsx";
import {Card, OverlayTrigger} from "react-bootstrap";
import DateIntervalPopover from "../typicalElements/DateIntervalPopover";
import load from "../../utils/FetchLoad";
import GetIntervalPath from "../../utils/GetIntervalPath";

export default class AnalyticsBoard extends Component {
    constructor(props) {
        super(props);
        let today = new Date()
        this.state = {
            data: [],
            monthList: [],
            isLoading: true,
            timeInterval: {
                fromDate: new Date(today.getFullYear(), today.getMonth() - 12, 1).toISOString(),
                toDate: new Date(today.setUTCHours(23,59,59,999)).toISOString(),
            }
        }
        this.loadLinesOfMonth()
    }

    render() {
        return (
            <div className='mb-5'>
                <h3 className='d-flex justify-content-between mt-0 m-3'>
                    <span>
                        <span className='back-btn me-2' onClick={this.props.backAction}>
                            <i className='bi bi-chevron-left'></i>
                        </span>
                        Аналитика за <OverlayTrigger placement="top"
                                                     trigger="click"
                                                     rootClose={true}
                                                     overlay={
                            <DateIntervalPopover type="month"
                                                 isLoading={this.state.isLoading}
                                                 timeInterval={this.state.timeInterval}/>
                        }>
                            <a>год</a>
                        </OverlayTrigger>
                    </span>
                </h3>
                <Card style={{
                    maxWidth: 1100
                }} className="p-5">
                    <LineChart
                        width={1000}
                        height={600}
                        data={this.state.data}
                        keyList={this.state.monthList}/>
                </Card>
            </div>
        )
    }

    loadLinesOfMonth() {
        load({
            path: `/infographic/month-lines${
                GetIntervalPath(this.state.timeInterval)
            }`
        }).then(data => this.setState({
            data: data.data ? data.data : [],
            monthList: data.month_list ? data.month_list : [],
            isLoading: false
        }))
    }
}
