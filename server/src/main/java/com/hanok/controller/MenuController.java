package com.hanok.controller;

import com.hanok.model.Category;
import com.hanok.model.MenuItem;
import com.hanok.repository.CategoryRepository;
import com.hanok.repository.MenuItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MenuController {

    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;

    public MenuController(CategoryRepository categoryRepository, MenuItemRepository menuItemRepository) {
        this.categoryRepository = categoryRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/menu-items")
    public ResponseEntity<List<MenuItem>> getMenuItems(@RequestParam(name = "categoryId", required = false) Long categoryId) {
        if (categoryId == null) {
            return ResponseEntity.ok(menuItemRepository.findAll());
        }
        return ResponseEntity.ok(menuItemRepository.findByCategoryIdOrderByNameAsc(categoryId));
    }
}


