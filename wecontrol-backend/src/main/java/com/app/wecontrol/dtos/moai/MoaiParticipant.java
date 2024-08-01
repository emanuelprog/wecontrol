package com.app.wecontrol.dtos.moai;

import com.app.wecontrol.dtos.login.LoginResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "moai-participant")
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class MoaiParticipant {
    @Id
    private String id;
    private LoginResponseDTO participant;
    private String idMoai;

    public MoaiParticipant(LoginResponseDTO participant, String idMoai) {
        this.participant = participant;
        this.idMoai = idMoai;
    }
}
