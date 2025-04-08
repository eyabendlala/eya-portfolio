package tn.esprit.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.twilio.Twilio;
import com.twilio.type.PhoneNumber;
import com.twilio.rest.api.v2010.account.Message;

import tn.esprit.entities.Response;
import tn.esprit.services.ResponseService;

@RestController
@RequestMapping("/response")
@CrossOrigin(origins = "*") // Optional: for frontend integration
public class ResponseController {

    @Autowired
    ResponseService responseService;

    // Get all responses
    @GetMapping("/listResponses")
    public List<Response> listResponses() {
        return responseService.getAllResponses();
    }

    // Add a response and send SMS
    @PostMapping("/add-response/{idReclamation}")
    public void addResponse(@RequestBody Response r, @PathVariable("idReclamation") Long idReclamation) {
        responseService.addResponse(r, idReclamation);
        sendSms("+21692569708"); // This should ideally be dynamic or from the Reclamation
    }

    // Send SMS using Twilio (with env vars)
    public void sendSms(String toNumber) {
        String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
        String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");
        String FROM_NUMBER = System.getenv("TWILIO_FROM_NUMBER");

        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        try {
            Message.creator(
                    new PhoneNumber(toNumber),
                    new PhoneNumber(FROM_NUMBER),
                    "Votre réclamation a été traitée.")
                    .create();
        } catch (Exception e) {
            System.err.println("Error sending SMS: " + e.getMessage());
        }
    }

    // Delete a response
    @DeleteMapping("/deleteResponse/{idResponse}")
    public void deleteResponse(@PathVariable("idResponse") Long idResponse) {
        responseService.supprimerResponse(idResponse);
    }

    // Update a response
    @PutMapping("/modifierResponse/{idResponse}")
    public void modifierResponse(@RequestBody Response r, @PathVariable("idResponse") Long idResponse) {
        responseService.updateResponse(r, idResponse);
    }

    // Get responses by reclamation
    @GetMapping("/getResponsesByReclamation/{idReclamation}")
    public List<Response> getResponsesByReclamation(@PathVariable("idReclamation") Long idReclamation) {
        return responseService.getResponsesByReclamation(idReclamation);
    }
}
