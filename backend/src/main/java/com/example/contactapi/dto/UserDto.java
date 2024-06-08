package com.example.contactapi.dto;

import com.example.contactapi.model.Contact;
import lombok.Data;

import java.util.Set;

@Data
public class UserDto {
    private Integer id;
    private String username;
    private String password;
    private Set<ContactDto> contacts;
}
