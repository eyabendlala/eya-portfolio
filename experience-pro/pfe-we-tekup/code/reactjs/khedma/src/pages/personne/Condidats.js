import React, { useState, useEffect } from 'react';
import CardPersonne from './CardPersonne.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import 'swiper/css';
import { connect } from 'react-redux';
import 'swiper/css/navigation';
import SwiperCore from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import './Condidats.css';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { Col, Row, FormGroup, FormControl } from 'react-bootstrap';

SwiperCore.use([Navigation, Pagination]);

function Condidats({ isAuthenticated }) {
  const [candidats, setCandidats] = useState(undefined);
  const [candidatesRows, setCandidatesRows] = useState();

  // Function to group candidates into rows with three candidates in each row
  const groupCandidatesIntoRows = (candidates) => {
    const rows = [];
    const candidatesPerRow = 4; // Change this to 3 to have 3 candidates in each row
    if (candidates !== undefined) {
      for (let i = 0; i < candidates.length; i += candidatesPerRow) {
        rows.push(candidates.slice(i, i + candidatesPerRow));
      }
    }
    return rows;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/users/');
        let condidats = [];
        for (let user of response.data.users) {
          if (user.role === 'candidat') {
            let candidat = response.data.personnes.find(
              (personne) => personne.user_id === user.id
            );
            condidats.push(candidat);
          }
        }
        setCandidats(condidats);
        setCandidatesRows(groupCandidatesIntoRows(condidats));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    const rows = document.getElementsByClassName('selected-row');
    if (rows.length !== 0) {
      rows[0].className = '';
    }
  };

  let filteredEmployees = candidats;
  useEffect(() => {
    if (candidats !== undefined) {
      if (searchTerm.length !== 0) {
        filteredEmployees = candidats.filter((candidat) =>
          Object.values(candidat).some((field) =>
            String(field).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setCandidatesRows(groupCandidatesIntoRows(filteredEmployees));
      } else {
        filteredEmployees = candidats;
        setCandidatesRows(groupCandidatesIntoRows(candidats));
      }
    }
  }, [searchTerm]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="candidats-container">
        <section
          className="section-hero overlay inner-page bg-image"
          style={{ backgroundImage: `url(${backgroundImg})` }}
          id="home-section"
        >
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">Khedma.site</h1>
                <div className="custom-breadcrumbs">
                  <span className="text-white">
                    <strong>
                      Trouvez le candidat idéal parmi notre réseau dynamique.
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <center>
          <FormGroup>
            <FormControl
              type="text"
              placeholder="Search"
              className="mt-3"
              onChange={handleSearchChange}
              style={{ width: '50vw' }}
            />
          </FormGroup>
        </center>
        <Swiper
          slidesPerGroup={2}
          loop={false}
          navigation={true}
          pagination={{
            clickable: true,
          }}
          className="mySwiper"
        >
          {filteredEmployees &&
            candidatesRows &&
            candidatesRows.map((row, rowIndex) => (
              <SwiperSlide key={rowIndex} className="swiper-row">
              <div className="swiper-row-container">
                {row.map((candidat) => (
                  <CardPersonne
                  candidat={candidat}
                  nom={candidat && candidat.nom}
                  prenom={candidat && candidat.prenom}
                  titreduprofil={candidat && candidat.titreduprofil}
                  image={candidat && candidat.image}
                />
                ))}
              </div>
            </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  id: state.auth.user && state.auth.user.id,
});

export default connect(mapStateToProps)(Condidats);
