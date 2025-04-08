package tn.esprit.repositories;

import tn.esprit.entities.AbonnementF;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AbonnementFRepository extends JpaRepository<AbonnementF, Long> {
}
