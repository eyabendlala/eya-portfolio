package tn.esprit.services;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.esprit.Interfaces.IPostService;
import tn.esprit.entities.Commentaire;
import tn.esprit.entities.Post;
import tn.esprit.entities.User;
import tn.esprit.repositories.IPostRepository;
import tn.esprit.repositories.UserRepository;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Slf4j
public class PostService implements IPostService {

    @Autowired
    IPostRepository postRepository;
    @Autowired

    UserRepository userRepository;
    @Autowired
    private Environment env;
    //@Autowired
   // PostLikeRepository postLikeRepository;

    @Override
    public Post ajouterPost(Post p) {
        Post p1 = postRepository.save(p);
        return p1;
    }

    @Override
    public List<Post> getAllPosts() {
        return (List<Post>) postRepository.findAll();

    }

    @Override
    public Post getPostById(Long idPost) {
        return postRepository.findById(idPost).get();
    }


    public void updatePost(Post post, Long idPost) {
        Post p = postRepository.findById(idPost).orElse(null);

        p.setIdPost(idPost);
        p.setTitle(post.getTitle());
        p.setContent(post.getContent());
        p.setImageP(post.getImageP());
        // p.setComments(post.getComments());
        postRepository.save(p);

    }

    @Override
    public void deletePost(Long id) {
        Post p = postRepository.findById(id).orElse(null);
        postRepository.delete(p);
    }


    @Override
    public void assignPostToUser(Post p, Long IdUser) {

        User user = userRepository.findById(IdUser).get();
        p.setUser(user);
        postRepository.save(p);

    }

    @Override
    public List<Commentaire> getCommentsByPoste(Long idPost) {
        Post p = postRepository.findById(idPost).get();
        return (List<Commentaire>) p.getComments();

    }

    @Override
    public List<Post> searchByTitleOrContent(String keyword) {
        return postRepository.findByTitleContainingOrContentContaining(keyword, keyword);
    }

    @Override
    public List<Post> searchByUser(String nomUser) {
        return postRepository.findByUser_userNameContaining(nomUser);
    }

    @Override
    public List<Post> searchByTitleOrContentAndUser(String keyword, String userName) {
        return postRepository.findByTitleContainingOrContentContainingAndUser_userNameContaining(keyword, keyword, userName);
    }

    /* @Override
     public List<Post> getPostsByUser(User user) {
         return postRepository.findByUser((user);
     }*/
    @Scheduled(cron = "0 10 23 * * ?")//// exécute la méthode chaque nuit à 22:59
    public void deleteUncommentedPosts() {
        // int days = Integer.parseInt(env.getProperty("app.posts.deleteAfterDays"));
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(20);
        //.minusDays(15);// supprime les posts non commentés qui ont plus de 30 jours

        List<Post> posts = postRepository.findByCommentsIsNullAndDateCreatedBefore(threshold);
        postRepository.deleteAll(posts);
    }

    @Override
    @Transactional
        public Post likePost(Long postId, User user) {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new EntityNotFoundException("Post not found"));
            Set<User> likes = post.getLikes();
            if (likes.contains(user)) {
                throw new IllegalArgumentException("User already liked this post");
            }
            likes.add(user);
            post.setLikes(likes);
            post.setNbLikes((long) likes.size());
            return postRepository.save(post);
    }}

    /*@Override
    public String likePoste(Long idPost, Long idUser) {

        Optional<Post> poste = postRepository.findById(idPost);
        Optional<User> user = userRepository.findById(idUser);

        System.out.println(poste.isPresent());
        System.out.println(user.isPresent());

        System.out.println(idPost);
        System.out.println(idUser);

        if (poste.isPresent() || user.isPresent()) {

            if(!postLikeRepository.existsByPostAndUser(poste.get(), user.get())) {


                Post post = poste.get();
                if(post.getNbLikes() != null) {
                    post.setNbLikes(Long.valueOf("O"));
                    postRepository.save(post);
                }
                Post p = postRepository.findById(idPost).get();
                p.setNbLikes(p.getNbLikes() + Long.valueOf("1"));

                return "liked";
            }


            return "already liked";



        }

        //if (postLikeRepository.existsByPostAndUser(poste.get(), user.get())) {
        //    return "already exists";
        //} else {
        //    Post post = poste.get();
        //    log.info("this is the post number of likes please check");


        //post.setNbLikes(post.getNbLikes() + 1L);
        //postRepository.save(post);

        //PostLike postLike = new PostLike();
        //postLike.setPost(post);
        //postLike.setUser(user.get());
        //postLikeRepository.save(postLike);

        //    return "success";
        //}}

        return "checking";
    }*/



