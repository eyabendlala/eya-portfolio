package tn.esprit.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Transaction_Surplus_NGO implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idTransaction;
	@ManyToOne
	@JoinColumn(name = "ngo_id")
	NGO ngo;

	@ManyToOne
	@JoinColumn(name = "surplus_id")
	SurplusAlim surplusAlim;

	@Column(name = "dateDonation")
	@Temporal(TemporalType.DATE)
	private Date dateDonation;

	@Column(name = "qttDonation")
	private float qttDonated;

}
