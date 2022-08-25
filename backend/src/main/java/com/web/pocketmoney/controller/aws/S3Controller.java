package com.web.pocketmoney.controller.aws;

import com.web.pocketmoney.dto.aws.S3DeleteResponseDto;
import com.web.pocketmoney.service.aws.S3Uploader;
import com.web.pocketmoney.dto.aws.S3UploadResponseDto;
import com.web.pocketmoney.entity.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RequiredArgsConstructor
@RestController
@Log4j2
public class S3Controller {
    private final S3Uploader s3Uploader;


    @PostMapping("/image")
    public ResponseEntity<S3UploadResponseDto> updateUserImage(@AuthenticationPrincipal User user, @RequestParam("images") MultipartFile multipartFile) throws IOException {
        log.info("s3 Contorller : " + multipartFile);
        return ResponseEntity.ok(s3Uploader.uploadFiles(multipartFile, "static"));
    }
}
