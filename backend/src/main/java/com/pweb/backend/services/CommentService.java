package com.pweb.backend.services;

import com.pweb.backend.controllers.CommentController;
import com.pweb.backend.dao.entities.Comment;
import com.pweb.backend.dao.entities.Post;
import com.pweb.backend.dao.entities.User;
import com.pweb.backend.dao.repositories.CommentRepository;
import com.pweb.backend.dao.repositories.PostRepository;
import com.pweb.backend.dao.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public Collection<Comment> getAllComments(Integer postId) {
        if (!postRepository.existsById(postId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }

        return commentRepository.findAllByPostId(postId);
    }

    public void addComment(org.springframework.security.core.userdetails.User user, CommentController.AddCommentRequest addCommentRequest) {
        if (!postRepository.existsById(addCommentRequest.postId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }

        Optional<User> found = userRepository.findByUsername(user.getUsername());

        if (found.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        Optional<Post> post = postRepository.findById(addCommentRequest.postId);

        if (post.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found");
        }

        try {
            Comment comment = new Comment(addCommentRequest.content, found.get(), post.get());
            commentRepository.save(comment);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error adding comment");
        }
    }

    public void deleteComment(org.springframework.security.core.userdetails.User user, Integer id) {
        if (!commentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
        }

        Optional<User> found = userRepository.findByUsername(user.getUsername());

        if (found.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        Optional<Comment> comment = commentRepository.findById(id);

        if (comment.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
        }

        if (!comment.get().getUser().equals(found.get())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not the author of this comment");
        }

        try {
            commentRepository.deleteById(id);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error deleting comment");
        }
    }

    public Collection<Comment> getAllComments(org.springframework.security.core.userdetails.User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return commentRepository.findAllByUserUsername(user.getUsername());
    }

    public void updateComment(org.springframework.security.core.userdetails.User user, Integer id, CommentController.UpdateCommentRequest request) {
        if (!commentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
        }

        Optional<User> found = userRepository.findByUsername(user.getUsername());

        if (found.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        Optional<Comment> comment = commentRepository.findById(id);

        if (comment.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found");
        }

        if (!comment.get().getUser().equals(found.get())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not the author of this comment");
        }

        try {
            comment.get().setContent(request.content);
            commentRepository.save(comment.get());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error updating comment");
        }
    }
}
