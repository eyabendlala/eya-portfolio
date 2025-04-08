import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import the Provider component
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import './index.css';
import './cssjs/css/style.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './cssjs/css/jquery.fancybox.min.css';
import './cssjs/css/custom-bs.css';
import './cssjs/css/bootstrap-select.min.css';
import './cssjs/css/owl.carousel.min.css';
import './cssjs/fonts/icomoon/style.css';
import './cssjs/fonts/line-icons/style.css';
//import {BrowserRouter as Router} from "react-router-dom"
// import './cssjs/js/bootstrap-select.min.js';
// import './cssjs/js/isotope.pkgd.min.js';
// import './cssjs/js/stickyfill.min.js';
// import './cssjs/js/jquery.fancybox.min.js';
// import './cssjs/js/jquery.easing.1.3.js';
// import './cssjs/js/jquery.waypoints.min.js';
// import './cssjs/js/jquery.animateNumber.min.js';
// import './cssjs/js/owl.carousel.min.js';
// import './cssjs/js/bootstrap-select.min.js';
// import './cssjs/js/custom.js';
// Ajoutez le code pour enregistrer le service worker ici

//import * as serviceWorker from './notification/serviceWorker'; 



const store = createStore(reducers, applyMiddleware(thunk));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    {/* Wrap the App component with the Provider */}
    <Provider store={store}>
      <App />
      
    
    </Provider>
  </React.StrictMode>
);

// Appelez la fonction register() pour enregistrer le service worker
//serviceWorker.register();

reportWebVitals();