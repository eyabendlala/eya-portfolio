package tn.esprit.services;

import tn.esprit.Interfaces.IChambreService;
import tn.esprit.entities.Chambre;
import tn.esprit.entities.TypeChambre;
import tn.esprit.repositories.ChambreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChambreService implements IChambreService {

    private final ChambreRepository chambreRepository;


    @Override
    public List<Chambre> retrieveAllChambres() {
        return chambreRepository.findAll();
    }



    @Override
    public Chambre addChambre(Chambre chambre) {
        return chambreRepository.save(chambre);
    }

    @Override
    public void deleteChambre(Long id) {
        chambreRepository.deleteById(id);
    }



    @Override
    public Chambre modifyChambre(Chambre chambre) {
        return chambreRepository.save(chambre);
    }


    @Override
    public List<Chambre> getChambresDisponibles(boolean disponibilite) {
        return chambreRepository.findChambresByDisponibilte(true);
    }

        @Override
        public List<Chambre> findChambersLowerThanPrice(String maxPrice) {
            List<Chambre> chambers = chambreRepository.findAll();
            List<Chambre> filteredChambers = new ArrayList<>();
            for (Chambre chamber : chambers) {
                TypeChambre typeChambre = chamber.getTypeChambre();
                if (typeChambre != null && typeChambre.getPrixTC() != null) {
                    double prixTC = Double.parseDouble(typeChambre.getPrixTC());
                    double maxPriceDouble = Double.parseDouble(maxPrice);
                    if (prixTC <= maxPriceDouble) {
                        filteredChambers.add(chamber);
                    }
                }
            }
            return filteredChambers;
        }
    }

