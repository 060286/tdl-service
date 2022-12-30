import { Row, Col } from "react-bootstrap";

import "./style.css";

export default function TaskItem() {
  return (
    <div style={{ backgroundColor: "red", marginTop: "20px" }}>
      <Row>
        <Col xs={1}>
          <input
            type="checkbox"
            className="TaskItemInput"
            onClick={() => console.log("clicked")}
          />
        </Col>
        <Col xs={10}>
          <div className="TaskItemBreadcrumb">Đây là Breadcrumb</div>
          <div className="TaskItemTitle">Đây là Nội dung task</div>
        </Col>
      </Row>
    </div>
  );
}
