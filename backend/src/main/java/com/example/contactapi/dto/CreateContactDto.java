package com.example.contactapi.dto;

import com.example.contactapi.model.Contact;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateContactDto {
    private String username;
    private ContactDto contact;
}
