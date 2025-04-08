import React from 'react'

function Footer() {
  return (
    <footer className="site-footer">

      <a href="#top" className="smoothscroll scroll-top">
        <span className="icon-keyboard_arrow_up"></span>
      </a>

      <div className="container">
        <div className="row mb-5">
          <div className="col-6 col-md-3 mb-4 mb-md-0">
            <h3>Tendances de recherche</h3>
            <ul className="list-unstyled">
              <li>Chef Cuisinière</li><br/>
              <li>Centre d'appel</li><br/>
              <li>comptabilité</li><br/>
              <li>Temporaire</li><br/>

              
            </ul>
          </div>
          <div className="col-6 col-md-3 mb-4 mb-md-0">
            <h3>Khedma.Site</h3>
            <ul className="list-unstyled">
              <li><a href="#">A propos de Nous</a></li>
              <li>Email: khedmasite@gmail.com</li>
              <li>Phone: +216 56 089 309</li>
            </ul>
          </div>
          <div className="col-6 col-md-3 mb-4 mb-md-0">
            <h3>Condition Légales</h3>
            <ul className="list-unstyled">
              <li><a href="#">Mention Légals</a></li>
              <li><a href="#">Politique de Confidentialté</a></li>
              <li><a href="#">Condition générale de Ventes</a></li>
              <li><a href="#">Condition générale d'Utilisation</a></li>
            </ul>
          </div>
          <div className="text-center col-6 col-md-3 mb-4 mb-md-0">
            <h3>Contactez-nous</h3>
            <div className="footer-social">
              <a href="https://www.facebook.com/profile.php?id=100093082705787" target='_blank' style={{marginRight:'10px'}}><span className="icon-facebook"></span></a>
              <a href="https://www.instagram.com/khedmasite/" target='_blank' style={{marginRight:'10px'}}><span className="icon-instagram"></span></a>
              <a href="https://www.linkedin.com/company/khedma-site/" target='_blank'><span className="icon-linkedin"></span></a>
            </div>
          </div>
        </div>

        <div className="row text-center">
          <div className="col-12">
            <p className="copyright"><small>
            Copyright &copy; 2023 <b>khedma.site</b> - <u>Tous droits réservés</u> - Organisme Tunisien des Droits d’Auteur et des Droits voisins (OTDAV) <i className="icon-heart text-danger" aria-hidden="true"></i>
            </small></p>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer