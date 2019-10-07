package com.mes.gotogether.repositories.domain;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import com.mes.gotogether.domains.Address;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface AddressRepository extends ReactiveMongoRepository<Address, ObjectId> {

    Mono<Address> findFirstAddressByStreetNameAndHouseNumberAndCityAndCountryOrderByLastModifiedDesc(String streetName,
                                                                           String houseNumber,
                                                                           String city,
                                                                           String country);

    Flux<Address> findFirst10AddressByLatitudeAndLongitudeOrderByLastModifiedDesc(Double latitude, Double longitude);

    Mono<Void> deleteAddressByStreetNameAndHouseNumberAndCityAndCountry(String streetName,
                                                                           String houseNumber,
                                                                           String city,
                                                                           String country);

    Mono<Void> deleteAddressByLatitudeAndLongitude(Double latitude, Double longitude);
}
