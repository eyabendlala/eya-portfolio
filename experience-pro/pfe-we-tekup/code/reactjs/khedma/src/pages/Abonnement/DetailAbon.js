import axios from "axios";
import React, { useState, useEffect } from "react";
import { load_user } from "../../actions/auth";
import { connect } from 'react-redux';
import Cc from "./Cc";
import Navbar from "../../components/Navbar";
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import Login from "../Login.js";


const DetailAbon = ({ load_user, id }) => {
  // Define state using useState
  const [classictype, setClassictype] = useState(null);
  const [typeAbon, setTypeAbon] = useState(null);

  //console.log("hello", id);

  useEffect(() => {
    // Create an async function for the API call
    const fetchData = async () => {
      let formField = new FormData()
      formField.append('user', id)
      
      try {
        const response = await axios({
          method: 'post',
          url: '/Abonnement/Detail/',
          data: formField,
        });
        if (response.status === 400) {
            alert("tu n'as pas crée un abonnement");}
        // Update state with the response data
        setClassictype(response.data.classictype);
        setTypeAbon(response.data.typeAbon);
       // console.log(response.data);
        if (response.status === 400) {
            alert("tu n'as pas crée un abonnement");}
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      }
    };

    // Call the async function when the component mounts
    fetchData();
  }, [id]);

  return (
    <div>
      <Cc load_user={load_user} />
    <div>
      <h1>{classictype}</h1>
      <h1>{typeAbon}</h1>
    </div>
   </div>
  );
}

const mapStateToProps = (state) => ({
  id: state.auth.user && state.auth.user.id,
});

export default connect(mapStateToProps, { load_user })(DetailAbon);