package com.example.backend.controllers;

import com.example.backend.services.AiBody;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/ai")

public class AiController {
    private final AiBody aiBody;

    public AiController(AiBody aiBody) {
        this.aiBody = aiBody;
    }
    @PostMapping("body")
    public ResponseEntity<Map<String,String>> Generatebody(@RequestBody Map<String,String> request){
        String prompt = request.get("prompt");
        String Type = request.get("type");
        String sender = request.get("sender");
        String res = aiBody.generateEmailBody(prompt,Type,sender);
        return ResponseEntity.ok(Map.of("result",res));
    }
}
