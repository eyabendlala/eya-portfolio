import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { checkAuthenticated, load_user } from '../actions/auth';
import { connect } from 'react-redux';

const Layout = (props) => {
  const location = useLocation();

  useEffect(() => {
    props.checkAuthenticated();
    props.load_user();
  }, []);

  const isNotFoundPage = location.pathname.includes("notfoundpages");

  return (
    <div>
      {!isNotFoundPage && <Navbar/>} {/* Show Navbar only if not on NotFoundPage */}
      {props.children}
      {!isNotFoundPage && <Footer />} {/* Show Footer only if not on NotFoundPage */}
    </div>
  );
};

export default connect(null, { checkAuthenticated, load_user })(Layout);