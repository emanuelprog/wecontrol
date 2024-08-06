package com.app.wecontrol;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WecontrolApplication {

	public static void main(String[] args) {
		SpringApplication.run(WecontrolApplication.class, args);
	}

}
