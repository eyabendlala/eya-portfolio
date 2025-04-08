package tn.esprit.Interfaces;

import tn.esprit.entities.Commentaire;
import tn.esprit.entities.Post;
import tn.esprit.entities.User;

import java.util.List;

public interface IPostService {


     Post ajouterPost(Post p);
     List<Post> getAllPosts();
     Post getPostById(Long idPost);
     void updatePost(Post post, Long idPost);
     void deletePost( Long id);
     void assignPostToUser( Post p, Long IdUser);
      //List<Post> getPostsByUser(Integer userId,User user);

     List<Commentaire> getCommentsByPoste(Long idPost);

     List<Post> searchByTitleOrContent(String keyword);
     List<Post> searchByUser(String nomUser);
     List<Post> searchByTitleOrContentAndUser(String keyword, String nomUser);
     void deleteUncommentedPosts();

     Post likePost(Long postId, User user);
     //String likePoste(Long idPost, Long idUser);

}
