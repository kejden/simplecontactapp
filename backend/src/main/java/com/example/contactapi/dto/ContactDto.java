package com.example.contactapi.dto;

import lombok.Data;

@Data
public class ContactDto {
    private String id;
    private String name;
    private String email;
    private String title;
    private String phone;
    private String address;
    private String status;
    private String photoURL;
}
