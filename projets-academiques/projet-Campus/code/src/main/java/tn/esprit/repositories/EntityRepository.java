package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.entities.EntityTemplate;

public interface EntityRepository extends JpaRepository<EntityTemplate, Long> {

}
