package tn.esprit.controllers;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.Fournisseur;
import tn.esprit.entities.NGO;
import tn.esprit.entities.SpecialtyFourn;
import tn.esprit.services.FournisseurServiceImpl;
import tn.esprit.services.NGOServiceImpl;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@AllArgsConstructor
public class FournisseurController {
    @Autowired
    FournisseurServiceImpl fournService;


    @PostMapping("/addFourn")
    @ResponseBody
    public Fournisseur addNGO(@RequestBody Fournisseur r)
    {
        return  fournService.ajouterFournisseur(r);
    }

    @GetMapping("/listFournisseur")
    @ResponseBody
    public List<Fournisseur> listFournisseurs(){

        return fournService.ListFournisseurs();
    }

    @DeleteMapping("/deleteFournisseur/{idFourn}")
    @ResponseBody
    public void deleteNGO(@PathVariable("idFourn") Integer idFourn){

        fournService.supprimerFournisseur(idFourn);
    }

    @PutMapping("/modifierFournisseur/{idFourn}")
    @ResponseBody
    public void modifierFournisseur(@RequestBody Fournisseur r,@PathVariable("idFourn") Integer idFourn){
        fournService.updateFournisseur(r,idFourn);
    }

    @GetMapping("/getFournisseur/{idFourn}")
    @ResponseBody
    public Fournisseur getFournisseurByiD(@PathVariable("idFourn") Integer idFourn){

        return fournService.getFournisseurById(idFourn);
    }

    @GetMapping("/filterNameFourn")
    public ResponseEntity<?> filter(@RequestParam String filter)
    {
        return fournService.NameFiltre(filter);
    }

    @GetMapping("/searchMultiCriteriaFournisseur")
    public List<Fournisseur> searchMultiCriteriaFournisseur(HttpServletRequest request){
        final String nomF = request.getParameter("nomF");
        final String matriculeF = request.getParameter("matriculeF");
        final String emailF = request.getParameter("emailF");
        final String specialtyF = request.getParameter("specialtyF");

        return fournService.searchMultiCriteriaFourn(nomF, matriculeF, specialtyF,emailF);
    }
}