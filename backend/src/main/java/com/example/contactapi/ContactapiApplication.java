package com.example.contactapi;

import com.example.contactapi.model.Role;
import com.example.contactapi.model.User;
import com.example.contactapi.repository.RoleRepository;
import com.example.contactapi.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
@PropertySource("classpath:user.properties")
public class ContactapiApplication {

	@Bean
	public ModelMapper modelMapper(){
		return new ModelMapper();
	}

	@Bean
	CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder){
		return args -> {
				if(roleRepository.findByAuthority("ADMIN").isPresent()) return;
				Role adminRole = roleRepository.save(new Role("ADMIN"));
				roleRepository.save(new Role("USER"));

				Set<Role> roles = new HashSet<>();
				roles.add(adminRole);

				User admin = new User(0, "admin", passwordEncoder.encode("password"), roles);

				userRepository.save(admin);
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(ContactapiApplication.class, args);
	}

}
