package tn.esprit.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import tn.esprit.Interfaces.IFournisseurService;
import tn.esprit.entities.Fournisseur;
import tn.esprit.entities.RequestApiForm.MessageResponse;
import tn.esprit.repositories.FournisseurRepository;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class FournisseurServiceImpl implements IFournisseurService {
    FournisseurRepository fournisseurRepo;

    @Override
    public List<Fournisseur> ListFournisseurs(){
        return fournisseurRepo.findAll();
    }

    @Override
    public Fournisseur ajouterFournisseur(Fournisseur fourn) {
        return fournisseurRepo.save(fourn);
    }

    @Override
    public void supprimerFournisseur(Integer idFourn) {
        Fournisseur r = fournisseurRepo.findById(idFourn).orElse(null);

        fournisseurRepo.delete(r);
    }

    @Override
    public void updateFournisseur(Fournisseur fournisseur, Integer idFourn) {

        Fournisseur rec= fournisseurRepo.findById(idFourn).orElse(null);

        rec.setIdFourn(idFourn);
        rec.setSpecialty(fournisseur.getSpecialty());
        rec.setAdrFourn(fournisseur.getAdrFourn());
        rec.setNomFourn(fournisseur.getNomFourn());
        rec.setTelFourn(fournisseur.getTelFourn());
        rec.setMatriculeFourn(fournisseur.getMatriculeFourn());
        rec.setEmailFourn(fournisseur.getEmailFourn());
        fournisseurRepo.save(rec);

    }

    @Override
    public Fournisseur getFournisseurById(Integer idFourn) {

        return fournisseurRepo.getById(idFourn);
    }

    public ResponseEntity<?> NameFiltre (String filter) {

        List<Fournisseur> fourn=fournisseurRepo.findByFilter(filter)
                .stream()
                .sorted(Comparator.comparing(Fournisseur::getIdFourn))
                .collect(Collectors.toList());
        return ResponseEntity.ok(new MessageResponse(fourn.toString()));
    }

    public List<Fournisseur> searchMultiCriteriaFourn(String nomF, String matriculeF, String specialtyF, String emailF) {

        List<Fournisseur> founrs=ListFournisseurs();

        if (!specialtyF.isEmpty()){
            founrs = founrs.stream()
                    .filter(x -> x.getSpecialty()
                            .toString().toLowerCase()
                            .contains(specialtyF.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (!matriculeF.isEmpty()) {
            founrs = founrs.stream()
                    .filter(x -> x.getMatriculeFourn()
                            .toLowerCase()
                            .contains(matriculeF.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (!nomF.isEmpty()) {
            founrs = founrs.stream()
                    .filter(x -> x.getNomFourn()
                            .toLowerCase()
                            .contains(nomF.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (!emailF.isEmpty()){
            founrs =  founrs.stream()
                    .filter(x -> x.getEmailFourn()
                            .toLowerCase().contains(emailF.toLowerCase()))
                    .collect(Collectors.toList());
        }

        return founrs;
    }
}
