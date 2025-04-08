package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.NGO;
import tn.esprit.entities.Stock;

import javax.persistence.criteria.CriteriaBuilder;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stock, Integer> {

    //Date date = new Date(System.currentTimeMillis());
    List<Stock> findByDateExpirationLessThan(LocalDate expirationDate);
    //List<Stock> findByDateExpirationLessThan();
}
