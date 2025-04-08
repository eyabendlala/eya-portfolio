package tn.esprit.controllers;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.NGO;
import tn.esprit.services.NGOServiceImpl;

import java.util.List;

@RestController
@AllArgsConstructor
public class NGOController {
    @Autowired
    //NGOServiceImpl ngoService;
    NGOServiceImpl ngoService;


    @PostMapping("/addNGO")
    @ResponseBody
    public NGO addNGO(@RequestBody NGO r)
    {
        return  ngoService.ajouterNgo(r);

    }

    @GetMapping("/listNGO")
    @ResponseBody
    public List<NGO> listNGOs(){
        return ngoService.ListNGOs();
    }

    @DeleteMapping("/deleteNGO/{idNgo}")
    @ResponseBody
    public void deleteNGO(@PathVariable("idNgo") Integer idNgo){
        ngoService.supprimerNGO(idNgo);
    }
    @PutMapping("/modifierNGO/{idNgo}")
    @ResponseBody
    public void modifierNGO(@RequestBody NGO r,@PathVariable("idNgo") Integer idNgo){
        ngoService.updateNGO(r,idNgo);
    }

    @GetMapping("/getNGO/{idNGO}")
    @ResponseBody
    public NGO getNGOByiD(@PathVariable("idNgo") Integer idNgo){
        //return ngoService.getNGOById(idNgo);
        return ngoService.getNGOById(idNgo);
    }

    @GetMapping("/statNGO")
    ResponseEntity<?> StatistiqueSelonTypeNGO()
    {
        return 	ngoService.StatistiqueSelonTypeNGO();
    }
}