package tn.esprit.controllers;


import tn.esprit.Interfaces.IChambreService;
import tn.esprit.entities.Chambre;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chambre")
public class ChambreController {
  private final IChambreService chambreService;


    @GetMapping("/retrieve-all-chambers")
     List<Chambre> getChambres() {
        List<Chambre> listChambres = chambreService.retrieveAllChambres();
        return listChambres;
    }

    @PostMapping("/add-chambre")
     Chambre addChambre(@RequestBody Chambre chambre) {
        return chambreService.addChambre(chambre);
    }



    @DeleteMapping("/delete-chambre/{chambre-id}")
     void removeChambre(@PathVariable("chambre-id") Long chambreId) {
        chambreService.deleteChambre(chambreId);
    }



    @PutMapping("/modify-chambre")
     Chambre modifyChambre(@RequestBody Chambre chambre) {

        return chambreService.modifyChambre(chambre);
    }

    @GetMapping("/disponibles/{disponibilite}")
    public ResponseEntity<List<Chambre>> getChambresDisponibles(@PathVariable boolean disponibilite) {
        List<Chambre> chambres = chambreService.getChambresDisponibles(disponibilite);
        if (!chambres.isEmpty()) {
            return ResponseEntity.ok(chambres);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/price/{maxPrice}")
    public ResponseEntity<List<Chambre>> findChambersLowerThanPrice(@PathVariable String maxPrice) {
        List<Chambre> chambers = chambreService.findChambersLowerThanPrice(maxPrice);
        if (chambers.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(chambers);
    }


}
