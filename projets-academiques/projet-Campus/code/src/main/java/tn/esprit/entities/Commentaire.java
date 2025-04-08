package tn.esprit.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Commentaire implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCom;
    private String contentCom;

    private LocalDateTime dateCreated =LocalDateTime.now();


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "commenter_user")
    @JsonIgnore // ignore userCommenter property during serialization
    private User userCommenter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore // ignore post property during serialization
    private Post post;

}
