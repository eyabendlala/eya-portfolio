package tn.esprit.controllers;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import tn.esprit.entities.Chambre;
import tn.esprit.entities.ServiceChambre;
import tn.esprit.Interfaces.IServiceChambreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/service")
public class ServiceChambreController {


    private final IServiceChambreService serviceChambreService;

    @PostMapping("/add-service")
     ServiceChambre addService(@RequestBody ServiceChambre serviceChambre) {
        return serviceChambreService.addService(serviceChambre);
    }

    @DeleteMapping("/delete-service")
     void deleteService(@PathVariable("chambre-id") Long serviceId) {
        serviceChambreService.deleteService(serviceId);
    }
    @PutMapping("/modify-service")
     ServiceChambre updateService(ServiceChambre serviceChambre)
    {
        return serviceChambreService.updateService(serviceChambre);
    }

    @GetMapping("/retrieve-all-services")
    public List<ServiceChambre> getServices() {
        List<ServiceChambre> listServices = serviceChambreService.retrieveAllServiceChambres();
        return listServices;
    }
    @GetMapping("/serviceChambreCountByNomService")
    public ResponseEntity<Map<String, Integer>> getServiceChambreCountByNomService() {
        Map<String, Integer> serviceCountMap = serviceChambreService.getServiceChambreCountByNomService();
        return new ResponseEntity<>(serviceCountMap, HttpStatus.OK);
    }
}
