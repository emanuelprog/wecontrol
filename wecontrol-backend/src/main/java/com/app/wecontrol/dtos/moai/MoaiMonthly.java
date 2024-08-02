package com.app.wecontrol.dtos.moai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "moais-monthly")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class MoaiMonthly {
    @Id
    private String id;
    private String idMoai;
    private String month;
    private LocalDateTime bidStartDate;
    private LocalDateTime bidEndDate;
    private String status;
}
