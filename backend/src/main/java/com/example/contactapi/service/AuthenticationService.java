package com.example.contactapi.service;

import com.example.contactapi.dto.LoginResponseDto;
import com.example.contactapi.dto.UserDto;
import com.example.contactapi.model.Role;
import com.example.contactapi.model.User;
import com.example.contactapi.repository.RoleRepository;
import com.example.contactapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final TokenService tokenService;

    private final ModelMapper modelMapper;


    public User registerUser(String username, String password) {
        String encodedPassword = passwordEncoder.encode(password);
        Role role = roleRepository.findByAuthority("USER").get();
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        return userRepository.save( new User(0,username, encodedPassword, roles));
    }

    public LoginResponseDto loginUser(String username, String password) {
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            String token = tokenService.generateJwt(authentication);
            User user = userRepository.findByUsername(username).get();
            UserDto userDto = modelMapper.map(user, UserDto.class);
            return new LoginResponseDto(userDto, token);
        }catch (AuthenticationException e){
            return new LoginResponseDto(null, "");
        }
    }

}
