import {Card, Placeholder} from "react-bootstrap";
import React from "react";
import GetRandomInt from "../../utils/GetRandomInt";

export default function TransactionsListPlaceHolder() {
    return (
        <Card style={{cursor: "wait"}}>
            <div className="transaction-list list-group list-group-flush">
                {
                    [...Array(7)].map(() =>
                        <div className="px-4 list-group-item without-hover text-light" style={{cursor: "wait"}}>
                            <Placeholder animation="glow"
                                         className="d-flex justify-content-between align-items-center">
                                <div className="col-5 d-grid">
                                    <Placeholder className={`mt-1 mb-2 col-${GetRandomInt(7, 12)}`} as={Card.Text}/>
                                    <Placeholder className={`col-${GetRandomInt(8, 10)} text-white-50 mb-1`} as={Card.Text}/>
                                </div>
                                <Placeholder xs={2} className="mb-0" as={Card.Title}/>
                            </Placeholder>
                        </div>
                    )
                }
            </div>
        </Card>
    )
}