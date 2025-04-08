package tn.esprit.controllers;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.Transaction_Surplus_NGO;
import tn.esprit.services.TransactionSNServiceImpl;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@AllArgsConstructor
public class TransactionSNController {
    @Autowired
    TransactionSNServiceImpl transService;

    @PostMapping("/addTransaction")
    @ResponseBody
    public Transaction_Surplus_NGO addTrans(@RequestBody Transaction_Surplus_NGO r)
    {
        return  transService.ajouterTrans(r);

    }

    @PostMapping("/assignSuplusToNGO")
    public void assignsurplustongo (int surplusId, int ngoId, float qttSurplus) {
        transService.assignSurplusToNGO(surplusId, ngoId, qttSurplus);
    }

    @GetMapping("/listTransaction")
    @ResponseBody
    public List<Transaction_Surplus_NGO> listTrans(){

        return transService.ListTrans();
    }

    @DeleteMapping("/deleteTransaction/{idTrans}")
    @ResponseBody
    public void deleteTrans(@PathVariable("idTrans") Integer idTrans){

        transService.supprimerTrans(idTrans);
    }

    @PutMapping("/modifierTransaction/{idTrans}")
    @ResponseBody
    public void modifierTrans(@RequestBody Transaction_Surplus_NGO r,@PathVariable("idTrans") Integer idTrans){
        transService.updateTrans(r,idTrans);
    }

    @GetMapping("/getTransaction/{idTrans}")
    @ResponseBody
    public Transaction_Surplus_NGO getTransByiD(@PathVariable("idTrans") Integer idTrans){

        return transService.getTransById(idTrans);
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<InputStreamResource> exportDonationsPdf()
    {
        List<Transaction_Surplus_NGO> donations = transService.ListTrans();
        ByteArrayInputStream bais = transService.donationsPDFReport(donations);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition","inline; filename=donations.pdf");
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bais));
    }
}