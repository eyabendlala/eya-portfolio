package tn.esprit.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tn.esprit.entities.Projet;
import tn.esprit.entities.Revenus;
import tn.esprit.repositories.ProjetRepository;

@Service
public class ProjetService {
@Autowired
ProjetRepository projetRepo;


public Projet ajouterProjet(Projet r) {
	
	return projetRepo.save(r);
	
}

public List<Projet> ListProjet(){
	return projetRepo.findAll();
}


public void supprimerProjet(Long idProjet) {
	Projet r = projetRepo.findById(idProjet).orElse(null);
	
	projetRepo.delete(r);
}
	
public void updateProjet(Projet Projet, Long idProjet) {
	
	Projet pr= projetRepo.findById(idProjet).orElse(null);	
	
	pr.setIdProjet(idProjet);
	pr.setName(Projet.getName());
	pr.setPrixProjet(Projet.getPrixProjet());
	pr.setTechnologies(Projet.getTechnologies());
	pr.setClasse(Projet.getClasse());
	
	projetRepo.save(pr);
	
}	


}
