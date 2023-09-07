import {Card, Placeholder} from "react-bootstrap";
import React from "react";
import GetRandomInt from "../../utils/GetRandomInt";
import GetRandomColor from "../../utils/GetRandomColor";

export default function TransactionsListPlaceHolder() {
    return (
        <Card style={{cursor: "wait"}}>
            <div className="transaction-list list-group list-group-flush">
                <div className="px-4 list-group-item without-hover text-light w-50" style={{cursor: "wait"}}>
                    <Placeholder animation="glow"
                                 className="d-flex align-items-center">
                        <Placeholder className="mb-0 mt-2 me-2" style={{width: GetRandomInt(100, 200)}}/>
                    </Placeholder>
                </div>
                {
                    [...Array(7)].map(() =>
                        <div className="px-4 list-group-item without-hover text-light" style={{cursor: "wait"}}>
                            <Placeholder animation="glow"
                                         className="d-flex justify-content-between align-items-center">
                                <div className="d-flex col-6">
                                    <Placeholder className="d-grid placeholder-item ps-0 " animation="glow">
                                        <Placeholder className="mx-auto p-0 small-icon-item-image-block"
                                                     style={{backgroundColor: GetRandomColor()}}/>
                                    </Placeholder>
                                    <div className="col-8 d-grid align-items-center">
                                        <Placeholder className={`mb-0 mt-2 col-${GetRandomInt(7, 12)}`} as={Card.Text}/>
                                        <Placeholder className={`col-${GetRandomInt(8, 10)} text-white-50 mb-2`} as={Card.Text}/>
                                    </div>
                                </div>
                                <Placeholder className={`mb-0 col-${GetRandomInt(1, 2)}`} as={Card.Title}/>
                            </Placeholder>
                        </div>
                    )
                }
            </div>
        </Card>
    )
}