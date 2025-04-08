package tn.esprit.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hi")
    @ResponseBody
    public String sayHi() {
        return "Hi";
    }
}
