import {Card, Placeholder} from "react-bootstrap";
import React from "react";
import GetRandomColor from "../../utils/GetRandomColor";

export default function IconsListPlaceHolder() {
    return (
        <Card style={{cursor: "wait"}} className="placeholder-card">
            <Card.Body className="d-flex">
                {
                    [...Array(4)].map(() =>
                        <Placeholder className="d-grid placeholder-item" xs={3} animation="glow">
                            <Placeholder className="mb-0" as={Card.Text}/>
                            <Placeholder className="mx-auto p-0" as={Card.Body} style={{
                                backgroundColor: GetRandomColor()
                            }}/>
                            <Placeholder className="mb-0" as={Card.Subtitle}/>
                        </Placeholder>
                    )
                }
            </Card.Body>
        </Card>
    )
}