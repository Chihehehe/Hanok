package com.hanok.controller;

import com.hanok.model.Platter;
import com.hanok.repository.PlatterRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/platters")
public class PlatterController {

    private final PlatterRepository platterRepository;

    public PlatterController(PlatterRepository platterRepository) {
        this.platterRepository = platterRepository;
    }

    @GetMapping
    public List<Platter> list() {
        return platterRepository.findAll();
    }
}


