import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { connect } from 'react-redux';
import Login from './pages/Login';
import Activate from './pages/Activate';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import Signup from './pages/Signup';
import ProfilePersonne from './pages/profile/Profile';
import ProfileSociete from './pages/profile/ProfileSociete';
import Layout from './hocs/Layout';
import AddAbon from './pages/Abonnement/AddAbon';
import { Provider } from 'react-redux';
import store from './store';
import PublierEmploi from './pages/PublierEmploi';
import Slider from './components/Slider';
import Condidats from './pages/personne/Condidats';
import Societes from './pages/societe/Societes';
import DetailPersonne from './pages/personne/DetailPersonne';
import RatingCondidat from './pages/personne/RatingCondidat';
import NotFoundPage from './pages/notfoundpages/NotFoundPage';
import Competence from './pages/profile/Competence';
import RatingSociete from './pages/societe/RatingSociete';
import DetailSociete from './pages/societe/DetailSociete';
import Dashboard from './pages_admin/Dashboard';
import Users from './pages_admin/Users';
import AddUser from './pages_admin/AddUser';
import Chat from './pages/chat/Chat';
import DetailAbon from './pages/Abonnement/DetailAbon';
import Classique from './pages/Abonnement/Classique';
import Message from './pages/Abonnement/Message';
import Emplois from './pages_admin/Emplois';
import Category from './pages_admin/Category';
import AddEmplois from './pages_admin/AddEmplois';
import { ToastContainer } from 'react-toastify';
import Competences from './pages_admin/Competences';
import RatingSocieteAdmin from './pages_admin/RatingSociete';
import RatingCandidatAdmin from './pages_admin/RatingCandidat';
import DetailEmployeur from './pages/personne/DetailEmployeur';
import UserEmplois from './pages/UserEmplois';
import SliderWithoutSearchBar from './pages/UserEmplois';
import Abonnements from './pages_admin/Abonnements';
import Footer from './components/Footer';

 // Import the Event component
import AjouterEvent from './pages/Event/AjouterEvent';
import UpdateEvent from './pages/Event/UpdateEvent';
import DisplayEvent from './pages/Event/DisplayEvent';
import ParticipateEvent from './pages/Event/ParticipateEvent';
import AddEvent from './pages_admin/AddEvent';
import EventList from './pages_admin/EventList';
import UpdateEventAd from './pages_admin/UpdateEventAd';
import Secteur from './pages_admin/Secteur';


import Favorites from './pages/Favorites';

// import TestPage from './pages/EspaceRecruteur/TestPage'
import DashboardRecruteur from './pages/EspaceRecruteur/DashboardRecruteur'
import CandidatDetails from './pages/EspaceRecruteur/CandidatDetails';
import CandidatApplication from './pages/CandidatureCandidat/CandidatApplication';
import DetailsCandidature from './pages/CandidatureCandidat/DetailsCandidature';

import AnalyseCandidature from './pages/EspaceRecruteur/AnalyseCandidature';


import ReclamationList from './pages/Reclamation/ReclamationList';
import ReclamationForm from './pages/Reclamation/ReclamationForm';
// import ReclamationDetail from './pages/Reclamation/ReclamationList';

import AdminReclamation from './pages_admin/AdminReclamation';









const App = () => (
  
  <Provider store={store}>
   <ToastContainer /> 
   
   <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} /> {/* needs to be adjusted*/}
        <Route path="/login" element={<Layout><Login /></Layout>} /> 
        <Route path="/activate/:uid/:token" element={<Layout><Activate /></Layout>} /> 
        <Route path="/signup" element={<Layout><Signup /></Layout>} /> 
        <Route path="/reset-password" element={<Layout><ResetPassword /></Layout>} />
        <Route path="/password/reset/confirm/:uid/:token" element={<Layout><ResetPasswordConfirm /></Layout>} /> 
        <Route path="/profile-utilisateur" element={<Layout><ProfilePersonne /></Layout>} /> {/* needs to be adjusted*/}
        <Route path="/profile-societe" element={<Layout><ProfileSociete /></Layout>} /> {/* needs to be adjusted*/}
        <Route path='/slider' element={<Layout><Slider /></Layout>} /> {/* needs to be adjusted*/}
        <Route path='/listedesemployes' element={<Layout><Condidats/></Layout>}/> {/* needs to be adjusted*/}
        <Route path='/listedessocietes' element={<Layout><Societes/></Layout>}/> {/* needs to be adjusted*/}
        <Route path="/detail-candidat/:id" element={<Layout><DetailPersonne /></Layout>} /> {/* needs to be adjusted*/}
        <Route path="/detail-employeur/:id" element={<Layout><DetailEmployeur /></Layout>} /> {/* needs to be adjusted*/}
        <Route path="/detail-societe/:id" element={<Layout><DetailSociete /></Layout>} /> {/* needs to be adjusted*/}
        <Route path='/ratingcandidat/:id' element={<Layout><RatingCondidat /></Layout>} />
        <Route path='/ratingsociete/:id' element={<Layout><RatingSociete /></Layout>} />
        <Route path='*' element={<NotFoundPage />} /> 
        <Route path='/notfoundpage' element={<NotFoundPage />} /> 
        <Route path='/competencetest' element={<Layout><Competence/></Layout>}/> {/* needs to be adjusted*/}
        <Route path='/payement/:id' element={<Layout><Classique/></Layout>} /> 
        <Route exact path="/success/:id" element={<Message message="Order completed. Thanks for purchasing our Abonnement."  />} />
        <Route path="/Emplois" element={ <UserEmplois />} /> 

        <Route path="/publier-emploi" element={<Layout><PublierEmploi /></Layout>} />
        {/* chat system */}
         
        <Route path="/chat" element={<Chat /> } /> {/* needs to be adjusted*/}
        <Route path="/AddAbon" element={<Layout><AddAbon/></Layout>}/> {/* needs to be adjusted*/}
        <Route path="/Detail" element={<Layout><DetailAbon/></Layout>}/> {/* needs to be adjusted*/}

        {/* Admin routes */}
        <Route path="/admin" element={<Dashboard />} /> {/* only navbar needs to be adjusted*/}
        <Route path='/admin/users' element={<Users />} /> {/* searchbar and paignation needs to be adjusted*/}
        <Route path='/admin/addUser' element={<AddUser />} /> {/* some fields needs to be adjusted*/}
        <Route path='/admin/updateUser/:uid' element={<AddUser />} /> 
        <Route path='/admin/emplois' element={<Emplois />} /> {/* something things needs to be adjusted*/}
        <Route path='/admin/addEmplois' element= {<AddEmplois />}></Route> {/* intervale d'age needs to be adjusted*/}
        <Route path='/admin/updateEmplois/:eid' element={<AddEmplois />} />
        <Route path='/admin/addEmplois/:uid' element={<AddEmplois />} />
        <Route path='/admin/competence' element={<Competences/>}/> {/* searchbar needs to be adjusted*/}
        <Route path='/admin/ratingsociete' element={<RatingSocieteAdmin/>}/> 
        <Route path='/admin/ratingcandidat' element={<RatingCandidatAdmin/>}/>
        <Route path='/admin/category' element={<Category />} /> {/* searchbar needs to be adjusted*/}
        <Route path='/admin/abonnements' element={<Abonnements />} /> {/* searchbar and table needs to be adjusted*/}

{/* Event system */}
         
        <Route path="/ajouter-event" element={<Layout><AjouterEvent /></Layout>} />
        <Route path="/updateEvent/:eventId" element={<Layout><UpdateEvent /></Layout>} />
        <Route path="/event-list" element={<Layout><DisplayEvent /></Layout>} /> 
        <Route path="/participate-event" element={<Layout><ParticipateEvent /></Layout>} /> 
        
        <Route path='/admin/EventList' element={<EventList/>} /> 
        <Route path='/admin/addEvent' element= {<AddEvent />}></Route> 
        <Route path='/admin/UpdateEventAd/:eventId' element={<UpdateEventAd/>}></Route>
        <Route path='/admin/secteurs' element={<Secteur />} />





        
   {/* Mes Favoris */}
        <Route path="/favoris" element={<Layout><Favorites /></Layout>} />


   {/* Espace Recruteur  */}
        {/* <Route path="/recruteur/test" element={<Layout><TestPage /></Layout>} /> */}
        <Route path="/recruteur/dashboard" element={<Layout><DashboardRecruteur /></Layout>} />


        <Route path="/recruteur/gestion-event/*" element={<DisplayEvent  />} />
        <Route path="/recruteur/gestion-event/ajout" element={<Layout><AjouterEvent /></Layout>} />
        <Route path="/candidat/:applicationId" element={<Layout><CandidatDetails /></Layout>} />

   {/* Candidature Candidat  */}

        <Route path="/mes-candidatures" element={<Layout><CandidatApplication /></Layout>} />
        <Route path="/candidature/:applicationId" element={<Layout><DetailsCandidature /></Layout>} />
   {/* Espace Recruteur KPI */}

   <Route path="/recruteur/analyse" element={<Layout><AnalyseCandidature /></Layout>} />


   {/* Réclamation */}
   
   <Route path="/recruteur/reclamation" element={<Layout><ReclamationList /></Layout>} />
   <Route path="/recruteur/reclamations/new" element={<Layout><ReclamationForm /></Layout>} />
   {/* <Route path="/recruteur/reclamations/:id" element={<Layout><ReclamationDetail /></Layout>} /> */}
   <Route path="/recruteur/reclamations/:id/edit" element={<Layout><ReclamationForm /></Layout>} />
     {/* Réclamation Admin */}
 
   <Route path='/admin/reclamations' element={<AdminReclamation />} />


      </Routes>
    
    </Router> 
  </Provider>
  
);

export default App;
