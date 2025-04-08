package tn.esprit.controllers;


import org.springframework.security.access.prepost.PreAuthorize;
import tn.esprit.entities.AbonnementF;
import tn.esprit.entities.Chambre;
import tn.esprit.Interfaces.IAbonnementFService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/abonnement")
public class AbonnementController {

   private final IAbonnementFService abonnementService;

    @GetMapping("/retrieve-all-subs")
    public List<AbonnementF> getAbonnements() {
        List<AbonnementF> listAbonnements = abonnementService.retrieveAllSubscription();
        return listAbonnements;
    }
    @PostMapping("/add-sub")

    public AbonnementF addSub(@RequestBody AbonnementF abonnementF) {
        return abonnementService.addSubscription(abonnementF);
    }
    @DeleteMapping("/delete-sub/{sub-id}")
    void removeSub(@PathVariable("sub-id") Long subId) {
        abonnementService.deleteSubscription(subId);
    }



    @PutMapping("/modify-sub")
    AbonnementF modifySub(@RequestBody AbonnementF abonnementF) {
        return abonnementService.updateSubscription(abonnementF);


    }

    @GetMapping("/hello")
    @PreAuthorize("hasAnyRole('ROLE_MODERATOR', 'ROLE_USER')")
    public String hello(){
        return "hello";
    }
}
