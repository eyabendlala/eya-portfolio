package tn.esprit.controllers;

import tn.esprit.dataTransfer.response.AssignedResponse;
import tn.esprit.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/dash")
@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping()
    public ResponseEntity<?> getChambersAndUsersAssigned() {

        List<AssignedResponse> responseList = dashboardService.getChambersAssigned();

        return ResponseEntity.ok(responseList);

    }

}
