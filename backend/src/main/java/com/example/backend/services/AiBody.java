package com.example.backend.services;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class AiBody {
    @Value("${gemini.api.key}")
    private String apiKey;
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    public String generateEmailBody(String prompt,String type,String senderName) {
        String todayDate = LocalDate.now().toString();
        String contextInstructions = String.format(
                "Context Details:\n"+
                        "-senderName: %s\n"+
                        "-Today's Date : %s\n",
                senderName,todayDate
        );
        String finalPrompt = String.format(
                "%s\n"+
                "Task: Write a single , short email body about: '%s'. "+
                        "Tone: %s. "+
                        "Rules: "+
                        "1. Return ONLY the email body text.\n "+
                        "2. Do NOT write a subject line.\n "+
                        "3. Do NOT provide multiple options.\n "+
                        "4. Do NOT include any introductory or concluding advice.\n "+
                        "5. Keep it under 150 words.\n"+
                        "6. Use the provided Context Details to fill in the sender and the date automatically.\n"+
                        "Do not use placeHolders for date and the sender Name you can use them for the receivers if you need them",
                contextInstructions,prompt,type
        );
        try {
            Client client = Client.builder().apiKey(apiKey).build();
            GenerateContentResponse response = client.models.generateContent(
                    "gemini-flash-latest",
                    finalPrompt,
                    null
            );
            return  response.text().trim();
        }
        catch (Exception error){
            return "Ai Generation failed: "+error.getMessage();
        }
    }
}
