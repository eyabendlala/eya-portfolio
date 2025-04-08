package tn.esprit.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SurplusAlim implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idSurplus;
	private Boolean donatedOrNot;
	@Temporal(TemporalType.DATE)
	private Date dateAjoutSurplus;
	private float qttIngrSurplus;


	@OneToOne(mappedBy = "surplusIngr")
	@JsonIgnore
	Stock ingredient;
	/*@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "stock_id", referencedColumnName = "idStock")
	private Stock stockIngr;*/

	@OneToMany(mappedBy = "surplusAlim")
	@JsonIgnore
	private Set<Transaction_Surplus_NGO> transaction_surplus_ngo = new HashSet<Transaction_Surplus_NGO>();

}
