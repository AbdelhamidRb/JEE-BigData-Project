package com.example.demo.services;


import com.example.demo.entities.Review;
import com.example.demo.repositories.ReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BigDataLoggingService bigDataLoggingService;

    @Transactional   // ← garantit que la session Hibernate est encore ouverte
    public Review createReview(Review review) {
        Review saved = reviewRepository.save(review);
        bigDataLoggingService.sendReviewToHDFS(saved); // relations encore accessibles
        return saved;
    }
}
