package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.PackR;

@Repository
public interface IPackRRepository extends JpaRepository<PackR, Long> {
}
