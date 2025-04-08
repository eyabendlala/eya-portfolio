package tn.esprit.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.Interfaces.IForbidenService;
import tn.esprit.entities.Forbiden;
import tn.esprit.repositories.ForbidenRepository;

import java.util.List;

@Service
public class ForbidenService implements IForbidenService {


    @Autowired
    private ForbidenRepository forbidenRep ;
    @Override
    public void addforbidenword(Forbiden forbiden) {
        forbidenRep.save(forbiden);
    }

    @Override
    public void updateforbidenword(Forbiden forbiden) {
        forbidenRep.save(forbiden);
    }

    @Override
    public Forbiden getforbidenword(Long id) {
        return forbidenRep.findById(id).get();
    }

    @Override
    public void deleteforbidenword(Long id) {
        forbidenRep.deleteById(id);
    }

    @Override
    public List<Forbiden> getall() {

        return (List<Forbiden>)forbidenRep.findAll();
    }

}




