package tn.esprit.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import tn.esprit.Interfaces.INGOService;
import tn.esprit.entities.NGO;
import tn.esprit.entities.RequestApiForm.MessageResponse;
import tn.esprit.entities.TypeNGO;
import tn.esprit.repositories.NGORepositoy;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class NGOServiceImpl implements INGOService {
    NGORepositoy ngoRepo;

    @Override
    public NGO ajouterNgo(NGO ng) {
        return ngoRepo.save(ng);

    }

    @Override
    public List<NGO> ListNGOs(){
        return ngoRepo.findAll();
    }

    @Override
    public void supprimerNGO(Integer idNgo) {
        NGO r = ngoRepo.findById(idNgo).orElse(null);

        ngoRepo.delete(r);
    }

    @Override
    public void updateNGO(NGO ng, Integer idNgo) {

        NGO rec= ngoRepo.findById(idNgo).orElse(null);

        rec.setIdNGO(idNgo);
        rec.setNomNGO(ng.getNomNGO());
        rec.setType(ng.getType());
        rec.setDescrNGO(ng.getDescrNGO());
        rec.setNumTelNGO(ng.getNumTelNGO());
        rec.setLogoNGO(ng.getLogoNGO());
        rec.setDescrNGO(ng.getDescrNGO());
        rec.setEmailNGO(ng.getEmailNGO());
        ngoRepo.save(rec);

    }

    @Override
    public NGO getNGOById(Integer idNgo) {
        return ngoRepo.getById(idNgo);
    }

    public ResponseEntity<?> StatistiqueSelonTypeNGO() {
    float nbrNgo = ngoRepo.count();
    String response = "";

    float count_INTERNATIONAL = (ngoRepo.counttype(TypeNGO.valueOf("INTERNATIONAL")) / nbrNgo) * 100;
    float count_GOVERNMENTAL = (ngoRepo.counttype(TypeNGO.valueOf("GOVERNMENTAL")) / nbrNgo) * 100;
    float count_QUASIAUTONOMOUS = (ngoRepo.counttype(TypeNGO.valueOf("QUASIAUTONOMOUS")) / nbrNgo) * 100;
    float count_ENVIRONMENTAL = (ngoRepo.counttype(TypeNGO.valueOf("ENVIRONMENTAL")) / nbrNgo) * 100;

    response =  "Total number of NGOs is: " + nbrNgo
            + "----- The percentage of international NGOs is: " + count_INTERNATIONAL + "%"
            + "----- The percentage of governmental NGOs is: " + count_GOVERNMENTAL + " %"
            +"----- The percentage of quasiautonomous NGOs is: " + count_QUASIAUTONOMOUS + " %"
            +"----- The percentage of environmental NGOs is: " + count_ENVIRONMENTAL + " %";

    return ResponseEntity.ok(new MessageResponse(response));
    }



}
