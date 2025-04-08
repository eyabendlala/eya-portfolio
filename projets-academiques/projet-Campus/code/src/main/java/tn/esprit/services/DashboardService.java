package tn.esprit.services;

import tn.esprit.Interfaces.IDashboarService;
import tn.esprit.dataTransfer.response.AssignedResponse;
import tn.esprit.entities.Chambre;
import tn.esprit.repositories.ChambreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService implements IDashboarService {

    private final ChambreRepository chambreRepository;

    @Override
    public List<AssignedResponse> getChambersAssigned() {

        List<Chambre> chambres = chambreRepository.findAll();


        return chambres.stream().map(chambre -> new AssignedResponse(chambre.getId(), chambre.getBloc(), chambre.getAbonnementF().stream().map(abonnementF -> abonnementF.getUser().getUserName()).collect(Collectors.toList()))).collect(Collectors.toList());

    }
}
