package tn.esprit.entities;

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
public class FormulaireSatisfaction implements Serializable {


    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long idForm;

    private Integer satisfactionRepas;
    private Integer satisfactionService;
    private Integer note_acceuil;
    private Integer note_ambiance;
    private String proposition;


    private LocalDateTime dateSubmitted =LocalDateTime.now();


    @ManyToOne
    private User user;



}
