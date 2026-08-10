package com.example.chatApplication.controller;

import com.example.chatApplication.dto.MessageDto;
import com.example.chatApplication.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/chat.send/{roomId}")
    public void sendMessage(@DestinationVariable String roomId,
                            @Payload MessageDto messageDto) {
        chatService.sendMessage(roomId, messageDto);
    }
}

