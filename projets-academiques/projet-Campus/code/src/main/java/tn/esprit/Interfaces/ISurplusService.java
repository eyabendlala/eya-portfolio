package tn.esprit.Interfaces;

import tn.esprit.entities.Stock;
import tn.esprit.entities.SurplusAlim;

import java.util.List;

public interface ISurplusService {

    SurplusAlim ajouterSurplus(SurplusAlim st);

    List<SurplusAlim> ListSurplus();

    void supprimerSurplus(Integer idSurplus);

    void updateSurplus(SurplusAlim ng, Integer idSurplus);

    SurplusAlim getSurplusById(Integer idSurplus);
}
