package tn.esprit.services;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.Interfaces.IFormulaireSatisfactionService;
import tn.esprit.entities.FormulaireSatisfaction;
import tn.esprit.entities.User;
import tn.esprit.repositories.IFormulaireSatisfactionRepository;
import tn.esprit.repositories.UserRepository;

import java.util.List;

@Service
@Slf4j
public class FormulaireSatisfactionService implements IFormulaireSatisfactionService {

    @Autowired
    IFormulaireSatisfactionRepository formulaireSatisfactionRepository;

    @Autowired

    UserRepository userRepository;



    //simple ajout de formulaire
    @Override
    public FormulaireSatisfaction ajouterFormS(FormulaireSatisfaction f)
    {
        FormulaireSatisfaction f1= formulaireSatisfactionRepository.save(f);
        return f1;
    }

    //Ajout formulaire par un User

    @Override
    public void assignFormToUser( FormulaireSatisfaction f, Long IdUser) {

        User user=userRepository.findById(IdUser).get();
        f.setUser(user);
        formulaireSatisfactionRepository.save(f);

    }





    @Override
    public List<FormulaireSatisfaction> getAllForms() {
        return (List<FormulaireSatisfaction>)formulaireSatisfactionRepository.findAll();
    }

    @Override
    public FormulaireSatisfaction getFormById(Long idForm) {
        return formulaireSatisfactionRepository.findById(idForm).get();
    }

    @Override
    public void deleteForm(Long idForm) {
        FormulaireSatisfaction f = formulaireSatisfactionRepository.findById(idForm).orElse(null);
        formulaireSatisfactionRepository.delete(f);
    }
}
