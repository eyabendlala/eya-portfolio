package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.FactureR;
import tn.esprit.entities.User;

import javax.transaction.Transactional;
import java.util.Date;

@Repository
@EnableJpaRepositories
public interface FactureRRepository extends JpaRepository<FactureR,Long> {

    @Transactional
    @Query(value="select p.prix_packr from packr p, facturer f where f.packr_id_packr=p.id_packr and f.id_facturer = :id", nativeQuery = true)
    double findPricByFacture(long id);

    //changement id user
    @Transactional
    @Query(value="select u.user_id from users u,facturer f, packr p where p.user_packr_user_id=u.user_id and f.packr_id_packr=p.id_packr and f.id_facturer = :id ", nativeQuery = true)
    int findUserByFacture(long id);
    @Transactional
    @Query(value="select f.date_fin_abnr from facturer f where  f.id_facturer = :id ", nativeQuery = true)
    Date findDateFinByFacture(long id);
    //changement id user et email user avec la base générée
    @Transactional
    @Query(value="select u.email from users u,facturer f, packr p where p.user_packr_user_id=u.user_id and f.packr_id_packr=p.id_packr and f.id_facturer = :id ", nativeQuery = true)
    String findUseremailFacture(long id);
    //changement nom user et id user avec la base généree
    @Transactional
    @Query(value="select u.user_name from users u,facturer f, packr p where p.user_packr_user_id=u.user_id and f.packr_id_packr=p.id_packr and f.id_facturer = :id ", nativeQuery = true)
    String findUsernomFacture(long id);

}
