import React, { useEffect, useState } from 'react';
import  { useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    FunnelChart, Funnel, LabelList, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import RecruiterNavbar from '../../components/RecruiterNavbar';
import Navbar from '../../components/Navbar';
import backgroundImg from '../../cssjs/images/backgroundkhedma.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser, faBriefcase, faChartLine,faSpinner,faCheck,faTimesCircle,faClipboardList,faStar,faFilePdf } from '@fortawesome/free-solid-svg-icons';

import './AnalyseCandidature.css';
import { Row, Col, Card, Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const AnalyseCandidatures = ({ user }) => {
    const [lineChartData, setLineChartData] = useState([]);
    const [jobTitleData, setJobTitleData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);

    const [acceptanceRate, setAcceptanceRate] = useState(0);
    const [favorisData, setFavorisData] = useState([]);
    const [summaryMetrics, setSummaryMetrics] = useState({});

    const buttonRef = useRef();
  useEffect(() => {
    if (user && user.id) {

    // Appel à l'API pour obtenir les données
    axios.get(`/api/applications_over_time/?recruteur=${user.id}`)
      .then(response => {
        setLineChartData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    

    // Status map
const statusMap = {
    pending: 'Non traité',
    accepted: 'Accepté',
    rejected: 'Rejeté'
};

  

// Fetch data from the API
axios.get(`/api/applications_by_status/?recruteur=${user.id}`)
    .then(response => {
        // Transform status
        const transformedData = response.data.map(item => ({
            ...item,
            status: statusMap[item.status] || item.status // Use mapped status or original
        }));

        setPieChartData(transformedData);
    })
    .catch(error => {
        console.error('Error fetching pie chart data:', error);
    });


    // Fetch Bar Chart data (applications by job title)
    axios.get(`/api/applications_by_job_title/?recruteur=${user.id}`)
    .then(response => {
        setJobTitleData(response.data);
    })
    .catch(error => {
        console.error('Error fetching bar chart data:', error);
    });

      // Fetch data from the API
      axios.get(`/api/offer_acceptance_rate/?recruteur=${user.id}`)
      .then(response => {
          setAcceptanceRate(response.data.acceptance_rate);
      })
      .catch(error => {
          console.error('Error fetching acceptance rate data:', error);
      });

       // Appel à l'API pour obtenir les données
       axios.get(`/api/favorites_per_job/?recruteur=${user.id}`)
       .then(response => {
           setFavorisData(response.data);
       })
       .catch(error => {
           console.error('Error fetching favorites data:', error);
       });

// Fetch summary metrics from the backend
axios.get(`/api/summary_metrics/?recruteur=${user.id}`)
.then(response => {
    setSummaryMetrics(response.data);
})
.catch(error => {
    console.error('Error fetching summary metrics:', error);
});

 }

  }, [user]);

  const COLORS = ['#FFD3E0', '#B3E5FC', '#FFE0B2', '#C8E6C9', '#F8BBD0', '#C5CAE9'];
 
  const generatePDF = () => {
    // Ajouter la classe 'hide-on-print' pour cacher le bouton dans le PDF
    buttonRef.current.classList.add('hide-on-print');

    const input = document.getElementById('pdfContent'); // Capture the part of the page to convert into PDF

    html2canvas(input)
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // Génère un PDF au format A4
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('analyse_candidatures.pdf');
        
        // Retirer la classe 'hide-on-print' après la génération du PDF
        buttonRef.current.classList.remove('hide-on-print');
      })
      .catch(error => {
        console.error('Error generating PDF:', error);

        // Assurez-vous que le bouton est visible même en cas d'erreur
        buttonRef.current.classList.remove('hide-on-print');
      });
  };


  return (
    <div>
         <Navbar></Navbar>
  <section className="section-hero overlay inner-page bg-image" style={{backgroundImage: `url(${backgroundImg})`}} id="home-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-white font-weight-bold">Espace Recruteur</h1>
            <div className="custom-breadcrumbs">
              <a href="#">Accueil</a> <span className="mx-2 slash">/</span>
              <span className="text-white"><strong>Rapports et Analyses </strong></span>
            </div>
          </div>
        </div>
      </div>
   </section>
   <RecruiterNavbar />

<div className="container" id="pdfContent">

  <div className="row mx-0">
  <Row className="justify-content-md-center mt-5">
                <Col md={3}>
                    <Card className="summaryCard">
                        <center><h4> <FontAwesomeIcon icon={faUsers} /> Total des Candidats</h4></center>
                        <hr className="custom-hr"></hr>
                        <h5>{summaryMetrics.total_candidates}</h5>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="summaryCard">
                        <center><h4> <FontAwesomeIcon icon={faSpinner} /> En cours</h4></center>
                        <hr className="custom-hr"></hr>
                        <h5>{summaryMetrics.in_progress_candidates}</h5>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="summaryCard">
                        <center><h4> <FontAwesomeIcon icon={faCheck} /> Acceptés</h4></center>
                        <hr className="custom-hr"></hr>
                        <h5>{summaryMetrics.accepted_candidates}</h5>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="summaryCard">
                        <center><h4> <FontAwesomeIcon icon={faTimesCircle} /> Rejetés</h4></center>
                        <hr className="custom-hr"></hr>
                        <h5>{summaryMetrics.rejected_candidates}</h5>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="summaryCard">
                        <center><h4> <FontAwesomeIcon icon={faClipboardList} /> Total des Offres d'Emploi</h4></center>
                        <hr className="custom-hr"></hr>
                        <h5>{summaryMetrics.total_job_listings}</h5>
                    </Card>
                </Col>
              
                <Col md={3}>
                    <Card className="summaryCard">
                        <center><h4> <FontAwesomeIcon icon={faStar} /> Nombre de Favoris</h4></center>
                        <hr className="custom-hr"></hr>
                        <h5>{summaryMetrics.favorites_count}</h5>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="summaryCard">
                        <center><h4> <FontAwesomeIcon icon={faChartLine} /> Taux d'Acceptation des Offres</h4></center>
                        <hr className="custom-hr"></hr>
                        <h5>{summaryMetrics.offer_acceptance_rate}%</h5>
                    </Card>
                </Col>
            </Row>

    {/* Line Chart for Applications Over Time */}
    <div className="col-lg-6 chart-container">
            <center><h6 className="mt-5">Nombre d'applications effectuées par période</h6></center>

     <div style={{  height: '100%' }}>
       <ResponsiveContainer >
        <LineChart data={lineChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="applications" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
       </ResponsiveContainer>
    </div>

   </div>


 {/* Pie Chart for Application Status Distribution */}
 <div className="col-lg-6 chart-container">
 <center><h6 className="mt-5">Répartition des Statuts des Candidatures </h6></center>

   <div style={{ height: '100%' }}>
                <ResponsiveContainer>
                    <PieChart>
                    <Pie data={pieChartData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                            {
                                pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))
                            }
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
    </div>
 </div>


   {/* Bar Chart for Applications by Job Title */}
   <div className="col-lg-6 chart-container">
   <center><h6 className="mt-5">Nombre d'applications par emploi </h6></center>

     <div style={{ height: '100%' }}>
                <ResponsiveContainer>
                    <BarChart data={jobTitleData} barSize={30}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="emploi__titre" />
                        <YAxis
                    tickFormatter={(value) => Number.isInteger(value) ? value : value.toFixed(2)} 
                    allowDecimals={false} 
                />                        
                <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#4db8ac" />
                    </BarChart>
                </ResponsiveContainer>
      </div>
    </div>

  {/* Line Chart for Offer Acceptance Rate */}
  <div className="col-lg-6 chart-container">
  <center><h6 className="mt-5">Pourcentage d'acceptation </h6></center>

  <div style={{  height: '100%' }}>
                <ResponsiveContainer>
                    <LineChart data={[{ name: 'Taux d\'Acceptation', rate: acceptanceRate }]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" label={{  position: 'insideBottomRight', offset: -10 }} />
                        <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                        <Line type="monotone" dataKey="rate" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
  </div>

{/* Bar Chart pour le nombre de favoris par emploi */}
<div className="col-lg-6 chart-container">
    <center><h6 className="mt-5">Répartition des Favoris par Offre d'Emploi</h6></center>
    <div style={{ height: '100%' }}>
        <ResponsiveContainer>
            <BarChart data={favorisData} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emploi__titre" />
                <YAxis
                    tickFormatter={(value) => Number.isInteger(value) ? value : value.toFixed(2)} // Formate les valeurs pour afficher des entiers ou deux décimales
                    allowDecimals={false} // Désactive les décimales pour afficher des entiers uniquement
                />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    </div>
</div>
 
  </div>


  


  <div className="text-center my-4">
  <Button  ref={buttonRef} onClick={generatePDF}>
  <FontAwesomeIcon icon={faFilePdf} /> Générer PDF
        </Button>
      </div>


      {/* Ajouter d'autres graphiques selon les besoins */}
    </div>

  
    </div>
 
  );
};


const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user, 
        role: state.auth.user && state.auth.user.role,
        id: state.auth.user && state.auth.user.id,
    };
  };
  
  export default connect(mapStateToProps)(AnalyseCandidatures);
  