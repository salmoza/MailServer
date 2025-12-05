package com.example.backend.controllers;


import com.example.backend.dtos.FolderDto;
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

    @GetMapping("/{userId}")
    public List<Folder> getFolders(@PathVariable String userId) {
        return folderService.getFolders(userId);
    }

//    @DeleteMapping("/{userId}")
//    public void deleteFolders(){
//        folderRepo.deleteAll();
//    }

    @DeleteMapping("/{folderId}/{userId}")
    public void deleteFolder(@PathVariable String folderId, @PathVariable String userId){
        folderService.deleteFolder(userId, folderId);
    }

    @PostMapping
    public Folder createFolder(@RequestBody FolderDto folderDto){
        System.out.println("createFolder");
        return folderService.createFolder(folderDto.userId, folderDto.folderName);
    }



}
