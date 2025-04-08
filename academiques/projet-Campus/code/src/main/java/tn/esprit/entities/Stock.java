package tn.esprit.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Stock implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idIngr;
	private String codeIngr;
	@Temporal(TemporalType.DATE)
	private Date dateAjoutIngr;
	@Temporal(TemporalType.DATE)
	private Date dateExpiration;
	@Temporal(TemporalType.DATE)
	private Date dateFabrication;
	private String nomIngr;
	private float prixUnitaireIngr;
	private float qttIngr;
	private float qttSurplus;
	private String uniteIngr;

	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	Fournisseur fournisseur;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "surplus_id", referencedColumnName = "idSurplus")
	SurplusAlim surplusIngr;
	/*@OneToOne(mappedBy = "stockIngr")
	private SurplusAlim surplus;*/


}
