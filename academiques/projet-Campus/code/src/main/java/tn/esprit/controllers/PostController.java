package tn.esprit.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.Commentaire;
import tn.esprit.entities.Post;
import tn.esprit.Interfaces.IPostService;
import tn.esprit.entities.User;

import java.util.List;

@org.springframework.web.bind.annotation.RestController

@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/Forum/Post")


public class PostController {

    @Autowired
    IPostService postService;

   // @Autowired
   // PostLikeRepository postLikeRepository;



    @PostMapping("/ajouter-post")
    public Post ajouterPost(@RequestBody Post p) {
        return postService.ajouterPost(p);
    }

    @GetMapping("/listPosts")

    public List<Post> getAllPosts() {
        return postService.getAllPosts();

    }

    @GetMapping("/getPost/{idPost}")
    public Post getPostById(@PathVariable("idPost") Long idPost) {
        return postService.getPostById(idPost);
    }



    @PutMapping("/modifierPost/{idPost}")
    @ResponseBody
    public void updatePost (@RequestBody Post p,@PathVariable("idPost") Long idPost){
        postService.updatePost(p,idPost);
    }


    @DeleteMapping("/deletePost/{idPost}")
    @ResponseBody
    public void deletePost(@PathVariable("idPost") Long idPost){
        postService.deletePost(idPost);
    }


    @PostMapping("/assign_Post_To_User/{IdUser}")
    @ResponseBody
    public void assignPostToUser(@RequestBody Post p, @PathVariable("IdUser") Long IdUser)
    {
        postService.assignPostToUser(p,IdUser);
        // envoyer une notification aux utilisateurs
        //String notificationMessage = "Un nouveau poste a été publié dans le fil de discussion : " + p.getTitle();
       // FirebaseMessaging.getInstance().send(notificationMessage);
    }

   /* @GetMapping("/getPostsByUser/{idUser}")
    public List<Post> getPostsByUser(@PathVariable Integer idUser,User user) {
        return postService.getPostsByUser(idUser,user);
    }*/

   @GetMapping("/comments/{idPost}")
   public List<Commentaire> getCommentsByPoste(@PathVariable Long idPost) {
       return postService.getCommentsByPoste(idPost);
   }


    @GetMapping("/search")
    public ResponseEntity<List<Post>> search(@RequestParam(name="keyword", required=false) String keyword,
                                             @RequestParam(name="nomUser", required=false) String nomUser)
    {
        List<Post> posts;

        if(keyword != null && nomUser != null) {
            posts = postService.searchByTitleOrContentAndUser(keyword, nomUser);
        } else if(keyword != null) {
            posts = postService.searchByTitleOrContent(keyword);
        } else if(nomUser != null) {
            posts = postService.searchByUser(nomUser);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @DeleteMapping("/deleteUncommentedPosts")
    //@Scheduled(cron = "0 10 15 * * ?")
    public void deleteUncommentedPosts() {
        postService.deleteUncommentedPosts();
    }

   /* @PostMapping("/{idPost}/like/{idUser}")

    public ResponseEntity<?> likePoste(@PathVariable Long idPost, @PathVariable Long idUser) {

        System.out.println(idPost);
        System.out.println(idPost);
        String responseEntity =  postService.likePoste( idPost, idUser);

        System.out.println(responseEntity);

        return ResponseEntity.ok("checking yet");
    }*/



    @PostMapping("/{postId}/like")
    public ResponseEntity<Post> likePost(@PathVariable Long postId, @RequestBody User user) {
        Post post = postService.likePost(postId, user);
        return ResponseEntity.ok(post);
    }
}



















