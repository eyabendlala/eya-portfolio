package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.esprit.entities.Depenses;

@Repository
public interface DepenseRepository  extends JpaRepository<Depenses, Long>{

}
