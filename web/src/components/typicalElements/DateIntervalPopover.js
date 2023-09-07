import {FloatingLabel, Form, Popover} from "react-bootstrap";
import FormalizeDate from "../../utils/FormalizeDate";
import ActionButton from "./ActionButton";

export default function DateIntervalPopover({timeInterval, type, isLoading, action}) {
    return (
        <Popover>
            <Popover.Body>
                <div className="d-flex">
                    <FloatingLabel controlId="from_date" label="С" className="text-dark mb-2 me-2">
                        <Form.Control name="from_date" type={type} placeholder="Февраль 2023" required
                                      defaultValue={FormalizeDate(timeInterval.fromDate)}/>
                    </FloatingLabel>
                    <FloatingLabel controlId="to_date" label="По" className="text-dark mb-2">
                        <Form.Control name="to_date" type={type} placeholder="Март 2023" required
                                      defaultValue={FormalizeDate(timeInterval.toDate)}/>
                    </FloatingLabel>
                </div>
                <ActionButton
                    is_loading={isLoading}
                    content={<i className="bi bi-check-lg"></i>}
                    onClick={() => action({
                        fromDate: new Date(
                            document.getElementById('from_date').valueAsNumber
                        ).toISOString(),
                        toDate: new Date(
                            document.getElementById('to_date').valueAsNumber + 86399999
                        ).toISOString(),
                    })}
                />
            </Popover.Body>
        </Popover>
    )
}