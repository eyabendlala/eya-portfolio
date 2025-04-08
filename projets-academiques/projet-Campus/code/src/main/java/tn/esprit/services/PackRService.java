package tn.esprit.services;

import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.Interfaces.IPackRService;
import tn.esprit.entities.PackR;
import tn.esprit.entities.User;
import tn.esprit.repositories.IPackRRepository;
import tn.esprit.repositories.UserRepository;


@Service
@Slf4j
public class PackRService implements IPackRService {
    @Autowired
    private IPackRRepository iPackRRepository;
    @Autowired
    private UserRepository userRepository;
    @Override
    public PackR addPack(PackR packR) {
        return iPackRRepository.save(packR);
    }


    @Override
    public void ajouterEtAffceterPackRToUser(Long idPackR, Long idUser) {
        PackR packR = iPackRRepository.findById(idPackR).get();
        User user = userRepository.findById(idUser).get();
        packR.setUserPackR(user);
        iPackRRepository.save(packR);
    }
    @Override
    public List<PackR> getAllPacks() {
        return (List<PackR>)iPackRRepository.findAll();
    }

    @Override
    public PackR findPackById(Long idPackR) {
        return iPackRRepository.findById(idPackR).get();
        //.orElseThrow(() -> new ResourceNotFoundException("PackR", "idPackR", idPackR));
    }


    public PackR updatePack(Long idPackR, PackR packRDetails) {
        PackR packR = iPackRRepository.findById(idPackR).get();
                //.orElseThrow(() -> new ResourceNotFoundException("PackR", "id", id));

        packR.setDescriptionPackR(packRDetails.getDescriptionPackR());
        packR.setDisponibilitePackR(packRDetails.getDisponibilitePackR());
        packR.setPrixPackR(packRDetails.getPrixPackR());
        packR.setTypePackR(packRDetails.getTypePackR());
       packR.setUserPackR(packRDetails.getUserPackR());

        PackR updatedPackR = iPackRRepository.save(packR);
        return updatedPackR;
    }
    public void deletePack(Long idPackR) {
        PackR packR = iPackRRepository.findById(idPackR).get();
               // .orElseThrow(() -> new ResourceNotFoundException("PackR", "idPackR", idPackR));
        iPackRRepository.delete(packR);
    }



}
