package tn.esprit.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.experimental.FieldDefaults;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;


@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@ToString
@Getter
@Setter
@Data

public class Events implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEvents;

    private int nbrParticipant;
    private int MaxNbrParticipant;
    private float Ratiing;

    @Temporal(TemporalType.DATE)
    private Date StartDate;

    @Temporal(TemporalType.DATE)
    private Date EndDate;

    private String Name;
    private String Topic;
    private String location;
    private String Image;
    @Enumerated(EnumType.STRING)
    private Places Places ;
    @Enumerated(EnumType.STRING)
    private Themes Themes;
    @Override
    public String toString() {
        return "Events{" +
                "idEvents=" + idEvents +
                ", nbrParticipant=" + nbrParticipant +
                ", MaxNbrParticipant=" + MaxNbrParticipant +
                ", Ratiing=" + Ratiing +
                ", StartDate=" + StartDate +
                ", EndDate=" + EndDate +
                ", Name='" + Name + '\'' +
                ", Topic='" + Topic + '\'' +
                ", location='" + location + '\'' +
                ", Image='" + Image + '\'' +
                ", Places=" + Places +
                ", Themes=" + Themes +
                '}';
    }

  /* @JsonIgnore
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "event_user",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> users = new HashSet<>();*/
    /*
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "event_user",
            joinColumns = @JoinColumn(name = "idEvents", referencedColumnName = "idEvents"),
            inverseJoinColumns = @JoinColumn(name = "userId", referencedColumnName = "userId"))
    private Set<User> users = new HashSet<>();

/*
    @JsonIgnore
    @ManyToMany(mappedBy="Evenements", cascade = CascadeType.ALL)
    private Set<User> users; */
  @JsonIgnore
  @ManyToMany
  @JoinTable(
          name = "event_user",
          joinColumns = @JoinColumn(name = "idEvents"),
          inverseJoinColumns = @JoinColumn(name = "userId")
  )
  private List<User> users = new ArrayList<>();
}

