package com.example.contactapi.utils;

import org.springframework.context.annotation.Bean;

import java.security.KeyPair;
import java.security.KeyPairGenerator;

public class KeyGeneratorUility {

    public static KeyPair generateRSAKeyPair() {

        KeyPair keyPair;

        try{
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            keyPair = generator.generateKeyPair();
        }catch(Exception e){
            throw new IllegalStateException();
        }

        return keyPair;
    }

}
