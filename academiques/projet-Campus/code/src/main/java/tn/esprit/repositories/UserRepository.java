package tn.esprit.repositories;



import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.Events;
import tn.esprit.entities.User;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Long>{


    Optional<User> findByUserName(String userName);
    @Query("SELECT u.events FROM User u WHERE u.userId = :userId")
    List<Events> findEventsByUserId(@Param("userId") Long userId);


    Boolean existsByUserName(String userName);

    Boolean existsByEmail(String email);


  // String assignChamberForUser(Long userId, Long chambreId);
}

