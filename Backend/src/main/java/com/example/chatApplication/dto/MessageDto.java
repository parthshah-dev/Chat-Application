package com.example.chatApplication.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {

    private Long id;
    private String sender;
    private String content;
    private String time;
    private LocalDateTime timestamp;

    public static String formatTime(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("h:mm a");
        return dateTime.format(formatter);
    }
}