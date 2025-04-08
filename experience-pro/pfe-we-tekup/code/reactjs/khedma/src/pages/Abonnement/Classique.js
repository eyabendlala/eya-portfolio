import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../config';
import './Classique.css';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';

const Classique = () => {
    const [abonnementData, setAbonnementData] = useState({
        Classictype: "",
        prix: ""
    });

    const { id } = useParams();

    useEffect(() => {
        // Fetch the abonnement data based on the provided id
        const fetchAbonnementData = async () => {
            try {
                const response = await fetch(`/api/abonnement/${id}/`);
                const data = await response.json();
                setAbonnementData(data);
            } catch (error) {
                console.error('Error fetching abonnement data:', error);
            }
        };

        fetchAbonnementData();
    }, [id]);

    return (
        <>
        <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">passer au payement de votre abonnement</h1>
            </div>
          </div>
        </div>
      </section>
      <div className='containerabon'>
            <div className='card'>
                <div>
                    <h3>TYPE : {abonnementData.Classictype}</h3>
                    <p>PRIX : $ {abonnementData.prix}</p>
                </div>
                <form
                    action={`${API_URL}/api/create-checkout-session/${id}/`}
                    method='POST'
                >
                    <button className='buttoncheckout' type='submit'>
                        Checkout
                    </button>
                </form>
            </div>
        </div>
        </>
        
    );
};

export default Classique;
