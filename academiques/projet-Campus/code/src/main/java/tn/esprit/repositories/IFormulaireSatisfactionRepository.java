package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.FormulaireSatisfaction;

@Repository
public interface IFormulaireSatisfactionRepository extends JpaRepository<FormulaireSatisfaction,Long> {




}
