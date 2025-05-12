package com.bookingservice.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;


import feign.Response;
import feign.codec.ErrorDecoder;
import feign.codec.ErrorDecoder.Default;

@Component
public class CustomErrorDecoder implements ErrorDecoder {

	private final ErrorDecoder defaultErrorDecoder = new Default();

	@Override
	public Exception decode(String methodKey, Response response) {
		        if (response.status() == HttpStatus.NOT_FOUND.value()) {
		            return new FlightNotFoundException("No Flights with the flightNumber");  // Convert Feign error to your exception
		        }
		        
		        if (response.status() == HttpStatus.BAD_REQUEST.value()) {
		            return new FlightHandlingException("Invalid request: Please check the input parameters.");  // Handle 400
		        }
		        
		        return defaultErrorDecoder.decode(methodKey, response);
	}
}
