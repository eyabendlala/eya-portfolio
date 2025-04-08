package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.Stock;
import tn.esprit.entities.Transaction_Surplus_NGO;

@Repository
public interface TransactionSurplusNGORepository extends JpaRepository<Transaction_Surplus_NGO, Integer> {

}
