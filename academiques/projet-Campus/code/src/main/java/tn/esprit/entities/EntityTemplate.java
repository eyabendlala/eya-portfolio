package tn.esprit.entities;

import java.io.Serializable;
import javax.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EntityTemplate implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	/*private String codeActe;
	private int cotationActe;
	private float prixUnitaireActe;
	private String designationUnitaireActe;*/

}
