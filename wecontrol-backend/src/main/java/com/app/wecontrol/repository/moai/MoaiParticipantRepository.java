package com.app.wecontrol.repository.moai;

import com.app.wecontrol.dtos.moai.MoaiParticipant;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MoaiParticipantRepository extends MongoRepository<MoaiParticipant, String> {
    List<MoaiParticipant> findAllByIdMoai(String idMoai);
}
