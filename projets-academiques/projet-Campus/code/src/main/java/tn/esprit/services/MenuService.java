package tn.esprit.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.Interfaces.IMenuService;
import tn.esprit.repositories.IMenuRepository;

@Service
@Slf4j
public class MenuService implements IMenuService {
    @Autowired
    IMenuRepository menuRepository;

}
