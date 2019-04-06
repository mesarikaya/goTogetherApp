package com.mes.gotogether.services.domain;

import com.mes.gotogether.domains.Address;
import com.mes.gotogether.domains.Group;
import org.bson.types.ObjectId;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface GroupService {

    Mono<Group> findById(ObjectId id);
    Flux<Group> findGroupsByOriginAddress(Address originAddress);
    Flux<Group> findGroupsByDestinationAddress(Address destinationAddress);
    Flux<Group> findGroupsByOriginAndDestinationAddress(Address originAddress, Address destinationAddress);
    Flux<Group> findGroupsByOriginAndDestinationGeoLocationDetails(
            Double originLatitude,
            Double originLongitude,
            Double destinationLatitude,
            Double destinationLongitude
    );

    Flux<Group> findGroupsByOriginWithinSearchRadius(
            Double originLatMin, Double originLatMax,
            Double originLongMin, Double originLongMax);

    Flux<Group> findGroupsByDestinationWithinSearchRadius(
            Double destLatMin, Double destLatMax,
            Double destLongMin, Double destLongMax);

    Flux<Group> findGroupsByOriginAndDestinationWithinSearchRadius(
            Double originLatMin, Double originLatMax,
            Double originLongMin, Double originLongMax,
            Double destLatMin, Double destLatMax,
            Double destLongMin, Double destLongMax);

    Flux<Group> findAll();

    Mono<Group> saveOrUpdate(Group group);

    Mono<Void> deleteById(ObjectId id);
    Mono<Void> deleteAll();
}