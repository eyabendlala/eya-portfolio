package tn.esprit.Interfaces;

import tn.esprit.entities.Commentaire;

import java.util.List;

public interface ICommentaireService {

    Commentaire ajouterCom(Commentaire c);
    List<Commentaire> getAllCom();
    Commentaire getComById(Long idCom);
    void deleteCom( Long id);
    void updateCom(Commentaire commentaire, Long idCom);

    void assignCommentToUser(Long IdCom, Long IdUser) ;
    String AddCommentPub(Commentaire commentD, Long idPost , Long idUser ) ;






}
