package com.example.contactapi.controller;


import com.example.contactapi.dto.ContactDto;
import com.example.contactapi.model.Contact;
import com.example.contactapi.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.function.Function;

import static com.example.contactapi.constant.Constant.PHOTO_DIR;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ModelMapper modelMapper;

    private final ContactService contactService;

    private ContactDto convertToDto(Contact contact) {
        return modelMapper.map(contact, ContactDto.class);
    }

    @PostMapping
    public ResponseEntity<ContactDto> createContact(@RequestBody ContactDto contactDto){
        Contact contactRequest = modelMapper.map(contactDto, Contact.class);
        Contact contact = contactService.createContact(contactRequest);
        ContactDto contactResponse  = modelMapper.map(contact, ContactDto.class);
        return ResponseEntity.created(URI.create("/contacts/userID")).body(contactResponse);
    }

    @GetMapping()
    public ResponseEntity<Page<ContactDto>> getContacts(@RequestParam(value = "page", defaultValue="0") int page,
                                                     @RequestParam(value = "size", defaultValue = "10") int size){
        Page<Contact> contacts = contactService.getAllContact(page, size);
        Page<ContactDto> contactDtos = contacts.map(this::convertToDto);
        return ResponseEntity.ok().body(contactDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDto> getContact(@PathVariable(value = "id") String id){
        Contact contact = contactService.getContact(id);
        ContactDto contactDto = modelMapper.map(contact, ContactDto.class);
        return ResponseEntity.ok().body(contactDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContact(@PathVariable(value = "id") String id){
        Optional<Contact> contact = Optional.ofNullable(contactService.getContact(id));
        if(contact.isPresent()){
            contactService.deleteContact(contact.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/photo")
    public ResponseEntity<String> uploadPhoto(@RequestParam("id") String id, @RequestParam("photo") MultipartFile photo){
        return ResponseEntity.ok().body(contactService.uploadPhoto(id, photo));
    }

    @GetMapping(path="/image/{filename}", produces=IMAGE_PNG_VALUE)
    public byte[] getPhoto(@PathVariable("filename") String fileName) throws IOException {
        return Files.readAllBytes(Paths.get(PHOTO_DIR + fileName));
    }
}
