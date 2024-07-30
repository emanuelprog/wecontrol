package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.login.LoginResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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

    public Moai(String name, String value, String year, String rules, String duration, String status, LoginResponseDTO organizer) {
        this.name = name;
        this.value = value;
        this.year = year;
        this.rules = rules;
        this.duration = duration;
        this.status = status;
        this.organizer = organizer;
    }
}
