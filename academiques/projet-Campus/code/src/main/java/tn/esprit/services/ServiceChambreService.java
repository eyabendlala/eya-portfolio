package tn.esprit.services;

import tn.esprit.Interfaces.IServiceChambreService;
import tn.esprit.entities.ServiceChambre;
import tn.esprit.repositories.ServiceChambreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class ServiceChambreService implements IServiceChambreService {

    private final ServiceChambreRepository serviceChambreRepository;


    @Override
    public List<ServiceChambre> retrieveAllServiceChambres() {
        return serviceChambreRepository.findAll();
    }

    @Override
    public ServiceChambre addService(ServiceChambre serviceChambre) {
        return serviceChambreRepository.save(serviceChambre);
    }

    @Override
    public void deleteService(Long id) {
        serviceChambreRepository.deleteById(id);
    }

    @Override
    public ServiceChambre updateService(ServiceChambre serviceChambre) {
        return serviceChambreRepository.save(serviceChambre);
    }
    public Map<String, Integer> getServiceChambreCountByNomService() {
        List<ServiceChambre> allServiceChambres = serviceChambreRepository.findAll();
        Map<String, Integer> serviceCountMap = new HashMap<>();
        for (ServiceChambre serviceChambre : allServiceChambres) {
            String nomService = serviceChambre.getNomService();
            if (serviceCountMap.containsKey(nomService)) {
                int count = serviceCountMap.get(nomService);
                serviceCountMap.put(nomService, count + 1);
            } else {
                serviceCountMap.put(nomService, 1);
            }
        }
        return serviceCountMap;
    }

}
