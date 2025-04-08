package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.Menu;

@Repository
public interface IMenuRepository extends JpaRepository<Menu,Long> {
}
