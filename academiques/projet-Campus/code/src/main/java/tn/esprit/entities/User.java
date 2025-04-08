package tn.esprit.entities;

import java.util.*;
import javax.persistence.*;
import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;
import lombok.experimental.FieldDefaults;



@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@ToString
@Getter
@Setter


@Data
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"username"}),
        @UniqueConstraint(columnNames = {"email"})
})
public class User implements Serializable {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long userId;
    private String userName;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private Date birthDate;
    private Boolean abonneRestaurant =true;
    private Boolean abonneFoyer =true;

    private boolean accountNonExpired = true;

    private boolean accountNonLocked = true;

    private boolean credentialsNonExpired = true;

    private boolean enabled = true;

    public User(String username, String email, String password,String phone) {
        this.userName = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }

    public User(String username, String email, String encode) {
        this.userName = username;
        this.email = email;
        this.password = encode;
    }

    public String getPhone() {
        return String.valueOf(phone);
    }
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "userId"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "roleId"))
    private Set<Role> roles;

    /*@ManyToMany(mappedBy = "users")
    private Set<Events> events = new HashSet<>();
  /* @JsonIgnore
   @ManyToMany( cascade = CascadeType.ALL)
   private Set<Events> Evenements;
    @OneToMany(mappedBy="ratingOwner", fetch= FetchType.LAZY, cascade=CascadeType.ALL)
    private List<Rating> listRatings;
*/
    @JsonIgnore
    @ManyToMany(mappedBy = "users")
    private List<Events> events = new ArrayList<>();
    @JsonIgnore
    @OneToMany(mappedBy = "userM")
    private List<Menu> MenuList;
    @JsonIgnore
    @OneToMany(mappedBy = "userPackR")
    private List<PackR> PackRList;
    @OneToMany(mappedBy= "user" ,cascade=CascadeType.ALL)
    private List<FormulaireSatisfaction> formulaireSatisfactions;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private AbonnementF abonnementF;
    public boolean getState() {
        return false;
    }
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    @JsonIgnore
    private List<Reclamation> reclamations;
}
