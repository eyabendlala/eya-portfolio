package tn.esprit.repositories;

import tn.esprit.entities.TypeChambre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TypeChambreRepository extends JpaRepository<TypeChambre, Long> {
}
