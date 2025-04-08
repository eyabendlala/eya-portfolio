package tn.esprit.Interfaces;

import tn.esprit.dataTransfer.response.AssignedResponse;

import java.util.List;

public interface IDashboarService {
    List<AssignedResponse> getChambersAssigned();
}
