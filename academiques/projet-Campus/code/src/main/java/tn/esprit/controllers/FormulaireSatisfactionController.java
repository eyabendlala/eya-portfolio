package tn.esprit.controllers;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.FormulaireSatisfaction;
import tn.esprit.Interfaces.IFormulaireSatisfactionService;

import java.util.List;

@RequestMapping("/Forum/formS")
@AllArgsConstructor
@RestController
public class FormulaireSatisfactionController {
    @Autowired
    IFormulaireSatisfactionService formulaireSatisfactionService;

    @PostMapping("/ajouter-Form")
    public FormulaireSatisfaction ajouterFormS(@RequestBody FormulaireSatisfaction f) {
        return formulaireSatisfactionService.ajouterFormS(f);
    }

    @PostMapping("/assign_Form_To_User/{IdUser}")
    @ResponseBody
    public void assignFormToUser(@RequestBody FormulaireSatisfaction f, @PathVariable("IdUser") Long IdUser) {
        formulaireSatisfactionService.assignFormToUser(f, IdUser);
    }





    @GetMapping("/listForms")

    public List<FormulaireSatisfaction> getAllForms() {
        return formulaireSatisfactionService.getAllForms();

    }

    @GetMapping("/getForm/{idForm}")
    public FormulaireSatisfaction getFormById(@PathVariable("idForm") Long idForm) {
        return formulaireSatisfactionService.getFormById(idForm);
    }

    @DeleteMapping("/deletePost/{idForm}")
    @ResponseBody
    public void deleteForm(@PathVariable("idForm") Long idForm){
        formulaireSatisfactionService.deleteForm(idForm);
    }















}
