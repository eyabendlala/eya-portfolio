package tn.esprit.services;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.Interfaces.ICommentaireService;
import tn.esprit.entities.Commentaire;
import tn.esprit.entities.Forbiden;
import tn.esprit.entities.Post;
import tn.esprit.entities.User;
import tn.esprit.repositories.ForbidenRepository;
import tn.esprit.repositories.ICommentaireRepository;
import tn.esprit.repositories.IPostRepository;
import tn.esprit.repositories.UserRepository;


import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class CommentaireService implements ICommentaireService {

    @Autowired
    ICommentaireRepository commentaireRepository;
    @Autowired

    UserRepository userRepository;
    @Autowired

    IPostRepository postRepository;
    @Autowired
    private ForbidenRepository forbidenRep ;

    @Override
    public Commentaire ajouterCom(Commentaire c) {
        Commentaire c1 = commentaireRepository.save(c);
        return c1;
    }

    @Override
    public List<Commentaire> getAllCom() {
        return (List<Commentaire>) commentaireRepository.findAll();
    }

    @Override
    public Commentaire getComById(Long idCom) {
        return commentaireRepository.findById(idCom).get();
    }

    @Override
    public void deleteCom(Long id) {
        Commentaire c = commentaireRepository.findById(id).orElse(null);
        commentaireRepository.delete(c);
    }

    @Override
    public void updateCom(Commentaire commentaire, Long idCom) {
        Commentaire co = commentaireRepository.findById(idCom).orElse(null);

        co.setIdCom(idCom);
        co.setContentCom(commentaire.getContentCom());
        commentaireRepository.save(co);

    }

    @Override
    public void assignCommentToUser(Long IdCom, Long IdUser) {

        Commentaire c = commentaireRepository.findById(IdCom).get();
        User user = userRepository.findById(IdUser).get();
        c.setUserCommenter(user);

        // updatePost(p, p.getIdPost());
        commentaireRepository.save(c);
    }

    @Override
    public String AddCommentPub(Commentaire commentD, Long idPost, Long idUser) {

        Post p = postRepository.findById(idPost).get();
        User u = userRepository.findById(idUser).get();

        //Restrition( Luser qui publie le poste  n'est pas le meme user qui commente le poste)

        //if (p.getUser().getIdPost().equals(commentD.getUser().getId()))
        /*if (p.getUser().getIdUser().equals(idUser)) {
            throw new IllegalArgumentException("The creator of the post cannot also be the creator of the comment");
        }*/

        commentD.setUserCommenter(u);

        String textbody= commentD.getContentCom();
        List<Forbiden> badwordlist = (List<Forbiden>) forbidenRep.findAll();



       /* int compteur=0;
        for(int i=0 ; i<badwordlist.size(); i++)
        {
            if (textbody.contains(badwordlist.get(i).getText()))
            {
                compteur++;
            }
        }
        if (compteur>0)
        {
            return "your Comment contains "+compteur+" bad words";
        }
        else
        {
        commentD.setPost(p);
        commentaireRepository.save(commentD);
        return "Comment added successfuly ";
        }*/


        for (Forbiden forbiden : badwordlist) {
            String badword = forbiden.getText();
            String replace = String.join("", Collections.nCopies(badword.length(), "*"));
            textbody = textbody.replaceAll("(?i)" + badword, replace);
        }
        commentD.setContentCom(textbody);
        commentD.setPost(p);
        commentaireRepository.save(commentD);
        return "Comment added successfully";


    }

}















