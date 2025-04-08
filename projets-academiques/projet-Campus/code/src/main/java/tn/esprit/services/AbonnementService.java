package tn.esprit.services;

import tn.esprit.Interfaces.IAbonnementFService;
import tn.esprit.entities.AbonnementF;
import tn.esprit.repositories.AbonnementFRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AbonnementService implements IAbonnementFService {

    private final AbonnementFRepository abonnementFRepository;

    @Override
    public List<AbonnementF> retrieveAllSubscription() {
        return abonnementFRepository.findAll();
    }

    @Override
    public AbonnementF addSubscription(AbonnementF abonnementF) {
        return abonnementFRepository.save(abonnementF);
    }

    @Override
    public void deleteSubscription(Long id) {
        abonnementFRepository.deleteById(id);
    }

    @Override
    public AbonnementF updateSubscription(AbonnementF abonnementF) {
        return abonnementFRepository.save(abonnementF);
    }
}
