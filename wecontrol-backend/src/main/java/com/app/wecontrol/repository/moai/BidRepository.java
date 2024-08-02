package com.app.wecontrol.repository.moai;

import com.app.wecontrol.dtos.bid.Bid;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface BidRepository extends MongoRepository<Bid, String> {
    @Aggregation(pipeline = {
            "{ '$match': { 'idMonthly': ?0 } }",
            "{ '$addFields': { 'valueBidDouble': { '$toDouble': '$valueBid' } } }",
            "{ '$sort': { 'valueBidDouble': -1 } }"
    })
    List<Bid> findAllByIdMonthlyOrderByValueBidDesc(String id);
}
