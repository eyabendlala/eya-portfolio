package tn.esprit.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tn.esprit.Interfaces.ISurplusService;
import tn.esprit.entities.SurplusAlim;
import tn.esprit.repositories.SurplusRepository;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class SurplusServiceImpl implements ISurplusService {
    SurplusRepository surplusRepo;

    @Override
    public SurplusAlim ajouterSurplus(SurplusAlim st) {

        Date date = new Date(System.currentTimeMillis());
        st.setDateAjoutSurplus(date);
        st.setDonatedOrNot(false);
        return surplusRepo.save(st);
    }

    @Override
    public List<SurplusAlim> ListSurplus(){
        return surplusRepo.findAll();
    }

    @Override
    public void supprimerSurplus(Integer idSurplus) {
        SurplusAlim r = surplusRepo.findById(idSurplus).orElse(null);

        surplusRepo.delete(r);
    }

    @Override
    public void updateSurplus(SurplusAlim ng, Integer idSurplus) {

        SurplusAlim rec= surplusRepo.findById(idSurplus).orElse(null);

        rec.setIdSurplus(ng.getIdSurplus());
        rec.setDateAjoutSurplus(ng.getDateAjoutSurplus());
        rec.setDonatedOrNot(ng.getDonatedOrNot());
        rec.setQttIngrSurplus(ng.getQttIngrSurplus());
        surplusRepo.save(rec);

    }

    @Override
    public SurplusAlim getSurplusById(Integer idSurplus) {

        return surplusRepo.getById(idSurplus);
    }
}
