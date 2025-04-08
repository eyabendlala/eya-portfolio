package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.NGO;
import tn.esprit.entities.TypeNGO;

@Repository
public interface NGORepositoy extends JpaRepository<NGO, Integer> {
    //Statistique selon type
    @Query("SELECT COUNT(n) FROM NGO n")
    int  countallngo();
    /*@Query("select  count(n) from NGO n where n.type LIKE CONCAT('%',:typ,'%')" )
    float  counttype(@Param("typ") String typ);*/
    @Query("select count(n) from NGO n where n.type = :typ")
    int counttype(@Param("typ") TypeNGO typ);
}
