package com.example.demo.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String username;
    private String email;
    private String city;
    private String state;
    private String currentPassword;
    private String newPassword;
}
