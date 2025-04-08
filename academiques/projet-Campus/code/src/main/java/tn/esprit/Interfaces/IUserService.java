package tn.esprit.Interfaces;

import tn.esprit.entities.User;

import java.util.List;

public interface IUserService {


    List<User> getAllUsers();
    User getUserById(Long userId);
    User saveUser(User user);
    void deleteUser(Long userId);
    User updateUser(User user, Long userID);

    String assignChamberForUser(Long userId, Long chambreId);
}
