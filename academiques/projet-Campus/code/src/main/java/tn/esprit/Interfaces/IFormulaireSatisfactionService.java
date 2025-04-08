package tn.esprit.Interfaces;

import tn.esprit.entities.FormulaireSatisfaction;

import java.util.List;

public interface IFormulaireSatisfactionService {

    FormulaireSatisfaction ajouterFormS(FormulaireSatisfaction f);

    List<FormulaireSatisfaction> getAllForms();
    FormulaireSatisfaction getFormById(Long idForm);
    void deleteForm( Long idForm);

    void assignFormToUser( FormulaireSatisfaction f, Long IdUser) ;









}
