package com.mes.gotogether.services.externalconnections;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;

import com.mes.gotogether.domains.Address;
import com.mes.gotogether.domains.NomatimOpenStreetMapQuery;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Service
public class NomatimMapLocation implements GeoLocationService{

	private final RestTemplate restTemplate;
	private static final String baseUrl = "https://nominatim.openstreetmap.org/search/";
	private static final String jsonResultFormat = "?format=json&addressdetails=1&limit=1";  
	
	public NomatimMapLocation(RestTemplate restTemplate) {
		
		this.restTemplate = restTemplate;
	}

	@Override
	public Optional<Double[]> getAddressLongitudeAndLatitude(Address address) {
		
		if (ObjectUtils.isEmpty(address)) return Optional.empty();
		
        String urlParameter = address.getStreetName() + " " + address.getHouseNumber() + 
        		", " + address.getCity() +", " + address.getZipcode() + ", " + address.getCountry();
        String url = setGeoLocationSearchAddress(baseUrl, urlParameter, jsonResultFormat);
		NomatimOpenStreetMapQuery[] queryResult = getQueryResult(url);
		
        log.info("**** QUERY ARRAY LENGTH: " + queryResult.length);
        if (queryResult.length>0) {
        	log.info("******QUERY RESULT IS: " + queryResult[0].toString());
        }
        
        return returnResultAsOptional(queryResult);
	}

	@Override
	public Optional<Double[]> getFreeTextLongitudeAndLatitude(String searchAddress) {
		
		if (ObjectUtils.isEmpty(searchAddress) || ObjectUtils.isEmpty(searchAddress.trim())) return Optional.empty();
		
		String url = setGeoLocationSearchAddress(baseUrl, searchAddress, jsonResultFormat);
		
		NomatimOpenStreetMapQuery[] queryResult = getQueryResult(url);
		
        log.info("**** QUERY ARRAY LENGTH: " + queryResult.length);
        if (queryResult.length>0) {
        	log.info("******QUERY RESULT IS: " + queryResult[0].toString());
        }
		return returnResultAsOptional(queryResult);
	}
	
	private NomatimOpenStreetMapQuery[] getQueryResult(String searchAddress){
		
		NomatimOpenStreetMapQuery[] defaultResult = {};
		NomatimOpenStreetMapQuery[] queryResult = Optional.ofNullable(restTemplate.getForObject(
				searchAddress,
                NomatimOpenStreetMapQuery[].class))
				.orElse(defaultResult);
		
		return queryResult;
	}
	
	private String setGeoLocationSearchAddress(String... params) {
		
    	return Arrays.stream(params)
				.filter(p -> p!=null)
				.collect(Collectors.joining());
    }
	
	private Optional<Double[]> returnResultAsOptional(NomatimOpenStreetMapQuery[] queryResult) {
		
		Objects.requireNonNull(queryResult);
		if (queryResult.length>0)
			return Optional.of(new Double[]{queryResult[0].getLatitude(), queryResult[0].getLongitude()});
		else
			return Optional.empty();
	}
}