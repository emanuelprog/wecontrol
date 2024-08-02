package com.app.wecontrol.dtos.bid;

import com.app.wecontrol.dtos.user.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bids")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Bid {
    @Id
    private String id;
    private String idMonthly;
    private UserResponseDTO user;
    private String valueBid;

    public Bid(String idMonthly, UserResponseDTO user, String valueBid) {
        this.idMonthly = idMonthly;
        this.user = user;
        this.valueBid = valueBid;
    }
}
