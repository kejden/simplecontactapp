package com.example.contactapi.controller;


import com.example.contactapi.dto.ContactDto;
import com.example.contactapi.dto.CreateContactDto;
import com.example.contactapi.model.Contact;
import com.example.contactapi.model.User;
import com.example.contactapi.repository.ContactRepository;
import com.example.contactapi.service.ContactService;
import com.example.contactapi.service.UserService;
import lombok.RequiredArgsConstructor;
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

import static com.example.contactapi.constant.Constant.PHOTO_DIR;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ModelMapper modelMapper;

    private final ContactService contactService;
    private final UserService userService;
    private final ContactRepository contactRepository;

    private ContactDto convertToDto(Contact contact) {
        return modelMapper.map(contact, ContactDto.class);
    }

    @PostMapping
    public ResponseEntity<ContactDto> createContact(@RequestBody CreateContactDto createContactDto) {
        User user = userService.findUserByUserName(createContactDto.getUsername());
        Contact contactRequest = modelMapper.map(createContactDto.getContact(), Contact.class);
        contactRequest.setUser(user);
        Contact savedContact = contactRepository.save(contactRequest);
        ContactDto contactResponse = modelMapper.map(savedContact, ContactDto.class);
        return ResponseEntity.created(URI.create("/contacts/" + contactResponse.getId())).body(contactResponse);
    }

    @GetMapping()
    public ResponseEntity<Page<ContactDto>> getContacts(@RequestParam String userName,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size){
        Page<ContactDto> contacts =  contactService.getUsersContacts(userName, page, size);
        return ResponseEntity.ok().body(contacts);
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
