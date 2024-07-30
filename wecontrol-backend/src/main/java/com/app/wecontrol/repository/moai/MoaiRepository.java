package com.app.wecontrol.repository.moai;

import com.app.wecontrol.dtos.moai.Moai;
import com.app.wecontrol.dtos.moai.MoaiRequestDTO;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MoaiRepository extends MongoRepository<Moai, String> {
    Optional<Moai> findByNameAndValueAndYear(String name, String value, String year);
}
