package com.example.chatApplication.service.impl;

import com.example.chatApplication.dto.MessageDto;
import com.example.chatApplication.entity.Message;
import com.example.chatApplication.entity.Room;
import com.example.chatApplication.repository.MessageRepository;
import com.example.chatApplication.repository.RoomRepository;
import com.example.chatApplication.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final MessageRepository messageRepository;
    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public MessageDto sendMessage(String roomId, MessageDto messageDto) {
        Room room = roomRepository.findById(roomId).orElse(null);
        if (room == null) {
            throw new IllegalArgumentException("Room not found: " + roomId);
        }

        Message message = Message.builder()
                .sender(messageDto.getSender())
                .content(messageDto.getContent())
                .room(room)
                .build();

        Message saved = messageRepository.save(message);

        MessageDto savedDto = toDto(saved);
        broadcastMessage(roomId, savedDto);
        return savedDto;
    }

    @Override
    public void broadcastMessage(String roomId, MessageDto messageDto) {
        messagingTemplate.convertAndSend("/topic/room/" + roomId, messageDto);
    }

    private MessageDto toDto(Message message) {
        LocalDateTime time = message.getCreatedAt() != null ? message.getCreatedAt() : LocalDateTime.now();
        return MessageDto.builder()
                .id(message.getId())
                .sender(message.getSender())
                .content(message.getContent())
                .time(MessageDto.formatTime(time))
                .timestamp(time)
                .build();
    }
}
