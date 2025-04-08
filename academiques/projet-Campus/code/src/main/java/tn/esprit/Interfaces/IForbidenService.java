package tn.esprit.Interfaces;

import tn.esprit.entities.Forbiden;

import java.util.List;

public interface IForbidenService {
    void addforbidenword(Forbiden forbiden);
    void updateforbidenword(Forbiden forbiden);
    Forbiden getforbidenword(Long id);
    void deleteforbidenword(Long id);
     List<Forbiden> getall();


}
