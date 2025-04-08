package tn.esprit.Interfaces;

import tn.esprit.entities.Chambre;

import java.util.List;

public interface IChambreService {

    List<Chambre> retrieveAllChambres();



    Chambre addChambre(Chambre chambre);

    void deleteChambre(Long id);


    Chambre modifyChambre(Chambre chambre);


    List<Chambre> getChambresDisponibles(boolean disponibilite);


    List<Chambre> findChambersLowerThanPrice(String maxPrice);
}
