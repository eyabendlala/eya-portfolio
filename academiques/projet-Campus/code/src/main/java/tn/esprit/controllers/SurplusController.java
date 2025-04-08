package tn.esprit.controllers;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.SurplusAlim;
import tn.esprit.services.SurplusServiceImpl;

import java.util.List;

@RestController
@AllArgsConstructor
public class SurplusController {
    @Autowired
    SurplusServiceImpl surplusService;


    @PostMapping("/addSurplus")
    @ResponseBody
    public SurplusAlim addSurplus(@RequestBody SurplusAlim r)
    {
        return  surplusService.ajouterSurplus(r);

    }

    @GetMapping("/listSurplus")
    @ResponseBody
    public List<SurplusAlim> listSurplus(){

        return surplusService.ListSurplus();
    }

    @DeleteMapping("/deleteSurplus/{idSurplus}")
    @ResponseBody
    public void deleteSurplus(@PathVariable("idSurplus") Integer idSurplus){

        surplusService.supprimerSurplus(idSurplus);
    }

    @PutMapping("/modifierSurplus/{idSurplus}")
    @ResponseBody
    public void modifierSurplus(@RequestBody SurplusAlim r,@PathVariable("idSurplus") Integer idSurplus){
        surplusService.updateSurplus(r,idSurplus);
    }

    @GetMapping("/getSurplus/{idSurplus}")
    @ResponseBody
    public SurplusAlim getSurplusByiD(@PathVariable("idSurplus") Integer idSurplus){

        return surplusService.getSurplusById(idSurplus);
    }
}