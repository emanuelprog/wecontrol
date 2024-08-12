package com.app.wecontrol.repository.moai;

import com.app.wecontrol.models.moai.Moai;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface MoaiRepository extends MongoRepository<Moai, String> {
    Optional<Moai> findByNameAndValueAndYear(String name, Integer value, Integer year);

    List<Moai> findAllByOrganizerId(String organizerId);
}
