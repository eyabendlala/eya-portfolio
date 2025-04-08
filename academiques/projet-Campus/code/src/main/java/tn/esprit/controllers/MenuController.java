package tn.esprit.controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.Interfaces.IMenuService;
import tn.esprit.Interfaces.IPackRService;

@AllArgsConstructor
@RestController
@RequestMapping("/Resto/Menu/")
public class MenuController {
    @Autowired
    private IMenuService iMenuRService;
}
