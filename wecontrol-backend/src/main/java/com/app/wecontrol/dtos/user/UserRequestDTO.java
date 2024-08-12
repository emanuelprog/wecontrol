package com.app.wecontrol.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDTO {
    private String id;
    private String email;
    private String name;
    private String cellphone;
}
