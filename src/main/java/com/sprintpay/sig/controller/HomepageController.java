package com.sprintpay.sig.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomepageController {
    @GetMapping("/")
    public String landingPage(){
        return "index"; // retorune la page index de Angular
    }
    
}
