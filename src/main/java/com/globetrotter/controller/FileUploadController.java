package com.globetrotter.controller;

import com.globetrotter.service.TripService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips")
public class FileUploadController {
    private final TripService tripService;
    private final Path uploadDir;

    public FileUploadController(TripService tripService, @Value("${app.upload-dir}") String uploadDir) {
        this.tripService = tripService;
        this.uploadDir = Paths.get(uploadDir);
    }

    @PostMapping("/{id}/cover")
    public String uploadCover(Authentication auth, @PathVariable Long id,
                              @RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("File is empty");
        Files.createDirectories(uploadDir);

        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + (extension == null ? "" : "." + extension);
        Files.copy(file.getInputStream(), uploadDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

        String url = "/uploads/" + filename;
        tripService.setCoverPhoto(auth.getName(), id, url);
        return url;
    }
}
