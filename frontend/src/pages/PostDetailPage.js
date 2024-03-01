import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { BACKEND_URL } from '../configuration/BackendConfig';

function PostDetailPage() {
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { postId } = useParams();

  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      delete axios.defaults.headers.common["Authorization"];
      navigate("/login");
    } else {
      axios.defaults.headers.common["Authorization"] = token;
    }
  }, [token, navigate]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/posts/${postId}`)
      .then(response => {
        setPost(response.data);
      })
      .catch(error => {
        console.error("Error fetching post details:", error);
      });

    fetchComments();
  }, [postId]);



  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    setSubmitting(true);
    axios.post(`${BACKEND_URL}/api/comments/create`, {
      postId: postId,
      content: comment,
    })
      .then(response => {
        setComment('');
        setError('');
        fetchComments();
      })
      .catch(error => {
        console.error("Error posting comment:", error);
        setError('Failed to post comment. Please try again.');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleDeleteComment = (commentId) => {
    axios.delete(`${BACKEND_URL}/api/comments/delete/${commentId}`)
      .then(response => {
        fetchComments();
      })
      .catch(error => {
        console.error("Error deleting comment:", error);
      });
  }


  const fetchComments = () => {
    axios.get(`${BACKEND_URL}/api/comments/post/${postId}`)
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error("Error fetching comments:", error);
      });
  }


  if (!post) {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col md={8}>
            <span className="sr-only">Loading...</span>
            <Spinner animation="border" role="status">
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{post.category}</Card.Subtitle>
              <Card.Text>{post.content}</Card.Text>
            </Card.Body>
          </Card>
          <hr />
          <Card>
            <Card.Body>
              <Card.Title>Comments</Card.Title>
              {comments.map(comment => (
                <Card key={comment.id} className="mb-2">
                  <Card.Body>
                    <Card.Text>{comment.content}</Card.Text>
                    <Card.Text className="text-muted">Created at: {comment.createdAt}</Card.Text>
                    <Card.Text className="text-muted">Author: {comment.author}</Card.Text>
                  </Card.Body>
                  {/* add delete button if the comment is created by the current user */}
                  {comment.author === localStorage.getItem("username") && (
                    <Card.Footer>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteComment(comment.id)}>Delete</Button>
                    </Card.Footer>
                  )}
                </Card>
              ))}
            </Card.Body>
          </Card>
          <hr />
          <Card>
            <Card.Body>
              <Form onSubmit={handleCommentSubmit}>
                <Form.Group className="mb-3" controlId="comment">
                  <Form.Label>Add a comment:</Form.Label>
                  <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} disabled={submitting} />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Comment'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PostDetailPage;