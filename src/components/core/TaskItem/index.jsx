import { Row, Col } from "react-bootstrap";

import "./style.css";

export default function TaskItem({ id, breadcrumb, task }) {
  return (
    <div>
      <Row style={{ marginTop: 20 }}>
        <Col xs={1}>
          <input
            type="checkbox"
            className="TaskItemInput"
            onClick={() => console.log(id)}
          />
        </Col>
        <Col xs={10}>
          <div className="TaskItemBreadcrumb">{breadcrumb}</div>
          <div className="TaskItemTitle">{task}</div>
        </Col>
      </Row>
    </div>
  );
}
