package tn.esprit.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Chambre implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloc;

    private boolean disponibilte = true;

    private Long placeDisponible;


    @OneToOne
    private TypeChambre typeChambre;


    @OneToMany
    private List<AbonnementF> abonnementF;





}
