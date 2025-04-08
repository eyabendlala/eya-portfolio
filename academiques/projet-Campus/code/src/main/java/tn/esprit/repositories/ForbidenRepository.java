package tn.esprit.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.Forbiden;

@Repository

public interface ForbidenRepository extends JpaRepository<Forbiden,Long> {




}
