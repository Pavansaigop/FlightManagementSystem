package com.apigateway.filter;

import java.security.PublicKey;

import org.apache.commons.lang.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.apigateway.service.Openfeign;

@RestController
public class Controller {
	
	@Autowired
	private Openfeign openfeign;
	
	@GetMapping("/validateToken/{token}")
	public String Validate(@PathVariable  String token) {
		return openfeign.validateToken(token);
	}

}
