package tn.esprit.controllers;

import com.stripe.Stripe;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.FactureR;
import tn.esprit.repositories.FactureRRepository;
import tn.esprit.services.FactureRService;
import tn.esprit.services.StripeService;


@AllArgsConstructor
@RestController
@RequestMapping("/FactureR/")
public class FactureRController {
    @Autowired
    private FactureRService factureRService;

    @Autowired
    private StripeService stripeService;
    @Autowired
    private FactureRRepository factureRepository;

    @GetMapping("api/hello")
    public String hello() {
        return "Hello, world!";
    }
    /*------------------------------Payment API--------------------------*/

    @PostMapping("/pay/{id}")
    public ResponseEntity<String> pay(@PathVariable(value = "id")  long factureR) {
        // Call Stripe payment processing method
        Stripe.apiKey ="sk_test_51Mh9fPDJjqsVZX1ZIYe5ugXUyeaqDIisghTY7UGpHotBsb1GmtqK1Xys7h014JERx84BEts4CM0RwolYJK5c3hOM00YASyBqsk";
        double prix=factureRepository.findPricByFacture(factureR);
        int user=factureRepository.findUserByFacture(factureR);
        ResponseEntity<String> responseEntity = stripeService.chargeCard(prix, user);
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            // Update payment status in database
            factureRService.updatePaymentStatus(factureR);
        }
        return responseEntity;
    }

    @GetMapping("/getfacturebyid/{id}")
    public FactureR getFactureRById(@PathVariable(value = "id") long idFactureR) {
        return factureRService.getFactureRById(idFactureR);
    }
}

