package com.rafael.pr_gym_backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Routes friendly page URLs to the static frontend files.
 */
@Controller
public class PageController {

    @GetMapping({"/dashboard", "/dashboard/"})
    public String dashboard() {
        return "forward:/index.html";
    }
}
