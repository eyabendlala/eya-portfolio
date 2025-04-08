package tn.esprit.Interfaces;

import org.springframework.stereotype.Repository;
import tn.esprit.entities.Plat;

import java.util.List;

public interface IPlatService {
    Plat createPlat(Plat plat);
    List<Plat> getAllPlats() ;
    Plat getPlatById(Long id);
    Plat updatePlat(Long id, Plat updatedPlat);
    void deletePlat(Long id);
}
