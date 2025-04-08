package tn.esprit.Interfaces;

import tn.esprit.entities.AbonnementF;
import tn.esprit.entities.AbonnementF;

import java.util.List;

public interface IAbonnementFService {

    List<AbonnementF> retrieveAllSubscription();

    AbonnementF addSubscription(AbonnementF abonnementF);

    void deleteSubscription(Long id);

    AbonnementF updateSubscription(AbonnementF abonnementF);

}
