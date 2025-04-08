package tn.esprit.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.Forbiden;
import tn.esprit.services.ForbidenService;

import java.util.List;

//@Api(tags = "forbiden Management")
@CrossOrigin
@RestController
@RequestMapping("/forbiden")

public class ForbidenRestController {
    @Autowired
    private ForbidenService forbidenSer ;

    @GetMapping("/retrieve-forbiden/{id}")
    //@ApiOperation(value = "recuperer un forbiden  ")
    @ResponseBody
    public Forbiden getforbiden (@PathVariable("id") Long id)
    {
        return forbidenSer.getforbidenword(id);
    }

    @GetMapping("/retrieve-all")
    //@ApiOperation(value = "Récupérer la liste des forbiden ")
    @ResponseBody
    public List<Forbiden> getforbidens()
    {
        List<Forbiden> forbidens = forbidenSer.getall();
        return forbidens;
    }

    @PostMapping("/add-forbiden")
   // @ApiOperation(value = "ajouter un forbiden ")
    @ResponseBody
    public void addad(@RequestBody Forbiden forbiden )
    {
        forbidenSer.addforbidenword(forbiden);


    }

    @DeleteMapping("/remove-forbiden/{id}")
    //@ApiOperation(value = "supprimer un forbiden ")
    @ResponseBody
    public void removeforbiden(@PathVariable("id") Long id )
    {
        forbidenSer.deleteforbidenword(id);
    }

    @PutMapping("/modify-forbiden")
    //@ApiOperation(value = "modifier un forbiden ")
    @ResponseBody
    public void modifyAd(@RequestBody Forbiden forbiden)
    {
        forbidenSer.updateforbidenword(forbiden);

    }

}






