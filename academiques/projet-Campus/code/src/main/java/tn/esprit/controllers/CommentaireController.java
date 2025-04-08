package tn.esprit.controllers;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.Commentaire;
import tn.esprit.Interfaces.ICommentaireService;

import java.util.List;

@RequestMapping("/Forum/Commentaire")
@AllArgsConstructor
@RestController
public class CommentaireController {

    @Autowired
    ICommentaireService commentaireService;


    @PostMapping("/ajouter-com")
    public Commentaire ajouterCom(@RequestBody Commentaire c) {
        return commentaireService.ajouterCom(c);
    }

    @GetMapping("/listCom")

    public List<Commentaire> getAllCom() {
        return commentaireService.getAllCom();

    }

    @GetMapping("/getCom/{idCom}")
    public Commentaire getComById(@PathVariable("idCom") Long idCom) {
        return commentaireService.getComById(idCom);
    }


    @PutMapping("/modifierPost/{idCom}")
    @ResponseBody
    public void updateCom(@RequestBody Commentaire c, @PathVariable("idCom") Long idCom) {
        commentaireService.updateCom(c, idCom);
    }


    @DeleteMapping("/deletePost/{idCom}")
    @ResponseBody
    public void deleteCom(@PathVariable("idCom") Long idCom) {
        commentaireService.deleteCom(idCom);
    }


    @PostMapping("/assign_Commentaire_To_User/{IdCom}/{IdUser}")
    @ResponseBody
    public void assignCommentToUser(@PathVariable("IdCom") Long IdCom, @PathVariable("IdUser") Long IdUser) {
        commentaireService.assignCommentToUser(IdCom, IdUser);

    }

    @PostMapping("/AddCommentPub/{idPost}/{idUser}")
    @ResponseBody
    public String AddCommentPub(@RequestBody Commentaire commentD,@PathVariable Long idPost,@PathVariable Long idUser) {
        //commentaireService.AddCommentPub(commentD,idPost, idUser);
        //return "Comment added successfuly " ;
        //try {
             return  commentaireService.AddCommentPub(commentD,idPost, idUser);

              // ResponseEntity.ok().build().toString();
        //} catch (EntityNotFoundException e) {
          //  return ResponseEntity.notFound().build().toString();
        //} catch (IllegalArgumentException e) {
         //   return ResponseEntity.badRequest().build().toString();
        //}

    }



    }






