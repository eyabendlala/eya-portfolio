import React, { useEffect } from "react";
import { checkAuthenticated, load_user } from '../actions/auth';
import { connect } from 'react-redux';
import AdminNavbar from "../components/AdminNavbar";
import AdminFooter from "../components/AdminFooter";
import { Container, Row, Col } from "react-bootstrap";
import { Navigate } from "react-router";

const AdminLayout = (props) => {
    useEffect(() => {
        props.checkAuthenticated();
        props.load_user();
    }, []);

    if (props.role === "candidat" || props.role === "societe" || props.role === "employeur") {
        return <Navigate to="/notfoundpage" />; 
    } else if (props.isAuthenticated === null) {
        // Si isAuthenticated est null, attendez
        return null;
    } else if (!props.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <AdminNavbar />
                    </Col>
                    <Col xs={10} id="page-content-wrapper">
                        {props.children}
                        <AdminFooter />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    societe: state.auth.user && state.auth.user.societe,
    personne: state.auth.user && state.auth.user.personne,
    role: state.auth.user && state.auth.user.role,
});

export default connect(mapStateToProps, { checkAuthenticated, load_user })(AdminLayout);