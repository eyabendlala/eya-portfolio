package tn.esprit.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Menu implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMenu;
    private String imageMenu;
    @Temporal(TemporalType.DATE)
    private Date dateMenu;
    private String descriptionMenu;
    @JsonIgnore
    @ManyToOne
    User userM;
    @JsonIgnore
    @ManyToMany(mappedBy="menus", cascade = CascadeType.ALL)
    private Set<Plat> plats;
}

