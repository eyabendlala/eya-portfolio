package tn.esprit.controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.Interfaces.IPlatService;
import tn.esprit.entities.Plat;
import tn.esprit.repositories.IPlatRepository;

import tn.esprit.services.PlatService;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/Resto/Plat/")
public class PlatController {
    @Autowired
    private IPlatService iPlatRService;
    @Autowired
    private PlatService platService;

    @GetMapping("/api/plats/{nom}")
    public ResponseEntity<Plat> getPlatNutritionInformation(@PathVariable String nom) {
        Plat plat = platService.getPlatNutritionInformation(nom);
        return new ResponseEntity<>(plat, HttpStatus.OK);
    }
    @PostMapping("addPlat")
    public Plat createPlat(@RequestBody Plat plat) {
        System.out.printf(String.valueOf(plat));
        return iPlatRService.createPlat(plat);
    }
    @GetMapping("allPlats")
    public List<Plat> getAllPlats()  {
        return iPlatRService.getAllPlats();
    }

    @GetMapping("getPlatById/{idPlat}")
    public Plat getPlatById(@PathVariable(value = "idPlat") Long idPlat) {
        return iPlatRService.getPlatById(idPlat);
    }

    @PutMapping("updatePlat/{idPlat}")
    public Plat updatePlat(@PathVariable(value = "idPlat") Long idPlat, @RequestBody Plat updatedPlat) {
        return iPlatRService.updatePlat(idPlat, updatedPlat);
    }

    @DeleteMapping("deletePlat/{idPlat}")
    public void deletePlat(@PathVariable(value = "idPlat") Long idPlat) {
        iPlatRService.deletePlat(idPlat);
    }
}
