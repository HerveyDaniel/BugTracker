package com.herveydaniel;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.InitBinder;

@SpringBootApplication
public class BugtrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(BugtrackerApplication.class, args);
		System.out.println(org.hibernate.Version.getVersionString());
	}
	@Bean
	public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
		return builder -> builder.serializationInclusion(JsonInclude.Include.NON_NULL);


	}


}



