import * as React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

export class Centerview extends React.Component<any, any> {
    render() {
        return (
            <Grid>
                <Row className="show-grid">
                    <Col xs={1} md={4}></Col>
                    <Col xs={4} md={4}>{this.props.children}</Col>
                    <Col xs={1} md={4}></Col>
                </Row>
            </Grid>
        );
    }
}
