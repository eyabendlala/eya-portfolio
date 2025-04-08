package tn.esprit.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PackR implements Serializable {

        private static final long serialVersionUID = 1L;
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long idPackR;
        private String descriptionPackR;
        private String disponibilitePackR;
        private Double prixPackR;
        @Enumerated(EnumType.STRING)
        private TypePackR typePackR;
        @JsonIgnore
         @ManyToOne
         User userPackR;

}
