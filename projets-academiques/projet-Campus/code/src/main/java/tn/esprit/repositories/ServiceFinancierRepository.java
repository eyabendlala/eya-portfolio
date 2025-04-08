package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.esprit.entities.ServiceFinancier;


@Repository
public interface ServiceFinancierRepository extends JpaRepository<ServiceFinancier, Long> {

}
