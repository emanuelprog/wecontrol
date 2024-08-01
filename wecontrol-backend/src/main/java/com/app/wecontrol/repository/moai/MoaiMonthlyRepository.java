package com.app.wecontrol.repository.moai;

import com.app.wecontrol.dtos.moai.MoaiMonthly;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MoaiMonthlyRepository extends MongoRepository<MoaiMonthly, String> {
    List<MoaiMonthly> findByIdMoai(String id);
}
