package tn.esprit.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Plat implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPlat;

    @Enumerated(EnumType.STRING)
    private TypePlat typePlat;

    private String nomMenu;
    private String imagePlat;
    private String specificationMenu;

    @JsonIgnore
    @ManyToMany(cascade = CascadeType.ALL)
    private Set<Menu> menus;

    private String nutritionalInformation;

    private int calories;
    private int protein;
    private int fat;
    private int carbohydrates;
}
