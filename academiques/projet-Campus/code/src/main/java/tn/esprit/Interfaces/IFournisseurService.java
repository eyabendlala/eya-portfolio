package tn.esprit.Interfaces;

import tn.esprit.entities.Fournisseur;

import java.util.List;

public interface IFournisseurService {


    List<Fournisseur> ListFournisseurs();

    Fournisseur ajouterFournisseur(Fournisseur fourn);

    void supprimerFournisseur(Integer idFourn);

    void updateFournisseur(Fournisseur fournisseur, Integer idFourn);

    Fournisseur getFournisseurById(Integer idFourn);
}
