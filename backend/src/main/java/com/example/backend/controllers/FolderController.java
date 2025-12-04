package com.example.backend.controllers;


import com.example.backend.entities.Folder;
import com.example.backend.repo.FolderRepo;
import com.example.backend.services.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/folder")
public class FolderController {
    @Autowired
    private FolderRepo folderRepo;

    @Autowired
    private FolderService folderService;

    @GetMapping
    public List<Folder> getFolders(){
        return folderRepo.findAll();
    }

    @DeleteMapping
    public void deleteFolders(){
        folderRepo.deleteAll();
    }

    @DeleteMapping("/{folder_id}/{user_id}")
    public void deleteFolder(@PathVariable Long folder_id, @PathVariable Long user_id){
        folderService.deleteFolder(user_id, folder_id);
    }

    @PostMapping
    public Folder createFolder(@RequestBody Folder folder){
        return folderService.createFolder();
    }


}
