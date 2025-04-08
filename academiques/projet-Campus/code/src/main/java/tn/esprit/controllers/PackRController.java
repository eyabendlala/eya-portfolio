package tn.esprit.controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.PackR;
import tn.esprit.Interfaces.IPackRService;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/Resto/PackR/")
public class PackRController {
    @Autowired
    private IPackRService iPackRService;

    @PostMapping("addPackR")
    public PackR addPackR(@RequestBody PackR packR) {
        System.out.printf(String.valueOf(packR));
        return iPackRService.addPack(packR);
    }

    @PostMapping("ajouterEtAffceterPackRToUser/{idpackr}/{iduser}")
    public void ajouterEtAffceterPackRToUser(@PathVariable(value = "idpackr") Long idPackR, @PathVariable(value = "iduser")  Long idUser){
         iPackRService.ajouterEtAffceterPackRToUser(idPackR, idUser);
    }

        @GetMapping("allPacks")
        public List<PackR> getAllPacks() {
            return iPackRService.getAllPacks();
        }

        @GetMapping("getPackById/{idpackr}")
        public PackR findPackById(@PathVariable(value = "idpackr") Long idPackR) {
            return iPackRService.findPackById(idPackR);
        }

        @PutMapping("updatePack/{idPackR}")
        public PackR updatePack(@PathVariable(value = "idPackR") Long idPackR, @RequestBody PackR packRDetails) {
            return iPackRService.updatePack(idPackR, packRDetails);
        }

        @DeleteMapping("deletePack/{idPackR}")
        public void deletePack(@PathVariable(value = "idPackR") Long idPackR) {
            iPackRService.deletePack(idPackR);
        }


}
