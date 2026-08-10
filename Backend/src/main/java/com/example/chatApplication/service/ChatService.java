package com.example.chatApplication.service;

import com.example.chatApplication.dto.MessageDto;

public interface ChatService {

    MessageDto sendMessage(String roomId, MessageDto messageDto);

    void broadcastMessage(String roomId, MessageDto messageDto);

}
