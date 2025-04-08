package tn.esprit.Interfaces;

import tn.esprit.entities.NGO;

import java.util.List;

public interface INGOService {


    NGO ajouterNgo(NGO ng);

    List<NGO> ListNGOs();

    void supprimerNGO(Integer idNgo);

    void updateNGO(NGO ng, Integer idNgo);

    NGO getNGOById(Integer idNgo);
}
