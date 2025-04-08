package tn.esprit.Interfaces;

import tn.esprit.entities.SurplusAlim;
import tn.esprit.entities.Transaction_Surplus_NGO;

import java.util.List;

public interface ITransactionSNService {
    Transaction_Surplus_NGO ajouterTrans(Transaction_Surplus_NGO st);

    void assignSurplusToNGO(int surplusId, int ngoId, float qttSurplus);

    List<Transaction_Surplus_NGO> ListTrans();

    void supprimerTrans(Integer idTrans);

    void updateTrans(Transaction_Surplus_NGO ng, Integer idTrans);

    Transaction_Surplus_NGO getTransById(Integer idTrans);
}
