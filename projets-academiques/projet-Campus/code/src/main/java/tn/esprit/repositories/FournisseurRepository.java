package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.Fournisseur;
import tn.esprit.entities.NGO;

import java.util.List;

@Repository
public interface FournisseurRepository extends JpaRepository<Fournisseur, Integer> {
    @Query("select f from Fournisseur f where lower(f.nomFourn) like lower(concat('%', :filter,'%'))")
    public List<Fournisseur> findByFilter(@Param("filter") String filter);
}
