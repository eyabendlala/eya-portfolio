package tn.esprit.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.entities.AbonnementF;
import tn.esprit.entities.Chambre;
import tn.esprit.entities.User;
import tn.esprit.Interfaces.IUserService;
import tn.esprit.repositories.AbonnementFRepository;
import tn.esprit.repositories.ChambreRepository;
import tn.esprit.repositories.UserRepository;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChambreRepository chambreRepository;
    @Autowired
    private AbonnementFRepository abonnementFRepository;
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
    @Override
    public User updateUser(User user, Long userID) {

        user.setUserId(userID);
        return userRepository.save(user);

    }
    @Override
    public String assignChamberForUser(Long userId, Long chambreId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            if (user.get().getAbonnementF() != null)     {
                AbonnementF abonnementF = user.get().getAbonnementF();
                Optional<Chambre> chambre = chambreRepository.findById(chambreId);

                if (!chambre.isPresent()) {
                    return "the room entered do not exist";
                }
                abonnementF.setChambre(chambre.get());
                abonnementFRepository.save(abonnementF);
                return "success adding the subscription for the user " + user.get().getUserName() + " subscription id = " + abonnementF.getId() + " and chambre id = " + chambre.get().getId() + " at bloc = " + chambre.get().getBloc() ;

            }else {
                return "there is no subscription for this user";
            }
        }else {
            return "user is not present";
        }
    }
}