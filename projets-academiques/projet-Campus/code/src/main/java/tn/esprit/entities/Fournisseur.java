package tn.esprit.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Fournisseur implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idFourn;
	@Size(min=1,message="required")
	private String adrFourn;
	private String matriculeFourn;
	private String nomFourn;
	private String telFourn;
	private String emailFourn;
	@Enumerated(EnumType.STRING)
	private SpecialtyFourn specialty;


	@OneToMany(mappedBy = "fournisseur", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JsonIgnore
	Set<Stock> stocks;

	@Override
	public String toString() {
		return "Fournisseur{" +
				"id=" + idFourn +
				", name='" + nomFourn + '\'' +
				", address='" + adrFourn + '\'' +
				", matricule='" + matriculeFourn + '\'' +
				", phone number='" + telFourn + '\'' +
				", email='" + emailFourn + '\'' +
				", specialty='" + specialty + '\'' +
				'}';
	}
}
