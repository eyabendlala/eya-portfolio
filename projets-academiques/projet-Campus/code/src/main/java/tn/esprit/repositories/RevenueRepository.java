package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.esprit.entities.Revenus;

@Repository
public interface RevenueRepository extends JpaRepository<Revenus,Long>{

}
