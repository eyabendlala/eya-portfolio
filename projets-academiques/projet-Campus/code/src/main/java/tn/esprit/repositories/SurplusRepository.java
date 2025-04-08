package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.Stock;
import tn.esprit.entities.SurplusAlim;

@Repository
public interface SurplusRepository extends JpaRepository<SurplusAlim, Integer> {

}
