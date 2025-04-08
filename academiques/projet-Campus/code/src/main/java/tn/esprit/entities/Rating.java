package tn.esprit.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Data
public class Rating implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ratingId;

    @JsonIgnore
    @ManyToOne
    private Events event;

    @ManyToOne

    private User ratingOwner;

    private int rating;
}
