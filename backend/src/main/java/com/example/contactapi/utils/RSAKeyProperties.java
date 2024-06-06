package com.example.contactapi.utils;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.security.KeyPair;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Component
@Getter
@Setter
public class RSAKeyProperties {

    private final RSAPrivateKey privateKey;
    private final RSAPublicKey publicKey;

    public RSAKeyProperties() {
        KeyPair pair = KeyGeneratorUility.generateRSAKeyPair();
        this.privateKey = (RSAPrivateKey) pair.getPrivate();
        this.publicKey = (RSAPublicKey) pair.getPublic();
    }

}
