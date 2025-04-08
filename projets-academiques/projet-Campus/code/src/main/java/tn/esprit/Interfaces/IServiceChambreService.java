package tn.esprit.Interfaces;

import tn.esprit.entities.ServiceChambre;

import java.util.List;
import java.util.Map;

public interface IServiceChambreService {

    List<ServiceChambre> retrieveAllServiceChambres();

    ServiceChambre addService(ServiceChambre serviceChambre);

    void deleteService(Long id);

    ServiceChambre updateService(ServiceChambre serviceChambre);

    Map<String, Integer> getServiceChambreCountByNomService();
}
