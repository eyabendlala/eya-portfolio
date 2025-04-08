import React, { useState, useEffect } from 'react';
import CardSociete from './CardSociete.js';
import { getSocietes } from '../../actions/auth.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import 'swiper/css';
import { connect } from 'react-redux';
import 'swiper/css/navigation';
import SwiperCore from 'swiper'; // Import Pagination module
import { Navigation, Pagination } from 'swiper/modules';
import './../personne/Condidats.css';

SwiperCore.use([Navigation, Pagination]); // Add Pagination module to SwiperCore

function Societes() {
  const [societes, setSocietes] = useState([]);

  useEffect(() => {
    fetchSocietes();
  }, []);

  const fetchSocietes = async () => {
    try {
      const response = await getSocietes();
      setSocietes(response.data);
    } catch (error) {
        alert(error);
    }
  };

  // Function to group candidates into rows with three candidates in each row
  const groupSocietesIntoRows = (societes) => {
    const rows = [];
    const SocietesPerRow = 2; // Change this to 3 to have 3 candidates in each row
    for (let i = 0; i < societes.length; i += SocietesPerRow) {
      rows.push(societes.slice(i, i + SocietesPerRow));
    }
    return rows;
  };

  const societesRows = groupSocietesIntoRows(societes);

  return (
    <>
      <div className="candidats-container">
        <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <h1 className="text-white font-weight-bold">Khedma.site</h1>
                <div className="custom-breadcrumbs">
                  <span className="text-white"><strong>Trouvez le candidat idéal parmi notre réseau dynamique.</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Swiper
          slidesPerView={3}
          slidesPerGroup={2}
          loop={false} 
          navigation={true} 
          pagination={{
            clickable: true,
          }}
          breakpoints={{
                320: {
                 slidesPerView: 1, 
                 spaceBetween: 10,
                },
               768: {
                 slidesPerView: 2,
                 spaceBetween: 20,
                   },
               1024: {
                 slidesPerView: 3,
                 spaceBetween: 30,
                      },
          }}
          className="mySwiper"
        >

          {societesRows.map((row, rowIndex) => (
            <SwiperSlide key={rowIndex} className="row">
              {row.map((societe) => (
                <div key={societe.id} className="column" style={{ padding: '20px 0' }}>
                  <CardSociete
                    societe={societe}
                    nom={societe.nom}
                    secteur={societe.secteur}
                    logo={societe.logo}
                  />
                </div>
              ))}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  id: state.auth.user && state.auth.user.id, // Add this line to get the id
});

export default connect(mapStateToProps)(Societes);
