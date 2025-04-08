package tn.esprit.repositories;

import tn.esprit.entities.ServiceChambre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceChambreRepository extends JpaRepository<ServiceChambre, Long> {
    List<ServiceChambre> findByNomService(String nomService);
    List<ServiceChambre> findAll();
}
