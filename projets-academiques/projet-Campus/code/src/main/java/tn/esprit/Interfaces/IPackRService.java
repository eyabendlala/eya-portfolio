package tn.esprit.Interfaces;

import tn.esprit.entities.PackR;

import java.util.List;

public interface IPackRService {
    PackR addPack(PackR packR);
    void ajouterEtAffceterPackRToUser(Long idPackR, Long idUser);
    List<PackR> getAllPacks();
    PackR findPackById(Long idPackR);
    PackR updatePack(Long idPackR, PackR packRDetails);
    void deletePack(Long id);
}
