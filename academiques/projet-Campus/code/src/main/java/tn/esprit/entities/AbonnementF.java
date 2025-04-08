package tn.esprit.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class AbonnementF implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date dateDebut;
    private Date dateFin;
    private float prix;
    private boolean statusPaiement;
    private boolean etatSanteF;

    @OneToOne
    private User user;

    @OneToOne
    private Chambre chambre;
}
