package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.Commentaire;

@Repository
public interface ICommentaireRepository extends JpaRepository<Commentaire,Long> {
}
