package tn.esprit.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FactureR implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFactureR;
    @Enumerated(EnumType.STRING)
    private TypeAbonnementR typeFactureR;
    @Enumerated(EnumType.STRING)
    private TypeModalite typeModalite;
    @Temporal(TemporalType.DATE)
    Date dateDebutAbnR;
    @Temporal(TemporalType.DATE)
    Date dateFinAbnR;
    String emailUser;
    private Boolean statusPaiementR;
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    private PackR packR;


}
