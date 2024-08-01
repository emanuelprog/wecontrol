package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.login.LoginResponseDTO;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Document(collection = "moais")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Moai {
    @Id
    private String id;
    private String name;
    private String value;
    private String year;
    private String rules;
    private String duration;
    private String status;
    private LoginResponseDTO organizer;
    @CreatedDate
    private LocalDateTime createdAt;

    public Moai(String name, String value, String year, String rules, String duration, String status, LoginResponseDTO organizer, LocalDateTime createdAt) {
        this.name = name;
        this.value = value;
        this.year = year;
        this.rules = rules;
        this.duration = duration;
        this.status = status;
        this.organizer = organizer;
        this.createdAt = createdAt;
    }
}
