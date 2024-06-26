package com.example.contactapi.service;

import com.example.contactapi.dto.ContactDto;
import com.example.contactapi.model.Contact;
import com.example.contactapi.model.User;
import com.example.contactapi.repository.ContactRepository;
import com.fasterxml.jackson.databind.util.BeanUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.beans.BeanUtils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Function;

import static com.example.contactapi.constant.Constant.PHOTO_DIR;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    private final UserService userService;
    private final ModelMapper modelMapper;

    public Contact getContact(String id){
        return contactRepository.findById(id).orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    public Contact createContact(Contact contact){
        return contactRepository.save(contact);
    }

    public void deleteContact(Contact contact){
        contactRepository.deleteById(contact.getId());
    }

    public Contact updateContact(String id, Contact contact){
        Optional<Contact> prevContactOpt = contactRepository.findById(id);
        if(prevContactOpt.isPresent()){
            Contact prevContact = prevContactOpt.get();
            BeanUtils.copyProperties(contact, prevContact, "id");
            return contactRepository.save(prevContact);
        }else{
            throw new RuntimeException("Contact not found");
        }
    }

    public String uploadPhoto(String id, MultipartFile file){
        Contact contact = getContact(id);
        String photoURL = photoFunction.apply(id, file);
        contact.setPhotoURL(photoURL);
        contactRepository.save(contact);
        return photoURL;
    }

    private final Function<String, String> fileExtension = filename ->
            Optional.of(filename)
                    .filter(name -> name.contains("."))
                    .map(name -> "." + name.substring(filename.lastIndexOf(".") + 1))
                    .orElse(".png");

    private final BiFunction<String, MultipartFile, String> photoFunction = (id, image) -> {
        String filename = fileExtension.apply(image.getOriginalFilename());
        try{
            Path fileStorageLocation = Paths.get(PHOTO_DIR).toAbsolutePath().normalize();
            if(!Files.exists(fileStorageLocation)){
                Files.createDirectories(fileStorageLocation);
            }
            Files.copy(image.getInputStream(), fileStorageLocation.resolve(id + filename), REPLACE_EXISTING);
            return ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/contacts/image/" + id +  filename).toUriString();
        }catch(Exception e){
            throw new RuntimeException("Unable to save image.");
        }
    };

    public Page<ContactDto> getUsersContacts(String userName, int page, int size){
        User user = userService.findUserByUserName(userName);
        return contactRepository.findAllByUser(user, PageRequest.of(page, size, Sort.by("name"))).map(contact -> modelMapper.map(contact, ContactDto.class));
    }
}
