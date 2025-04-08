package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tn.esprit.entities.Projet;
import tn.esprit.entities.Reclamation;
@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {

}
