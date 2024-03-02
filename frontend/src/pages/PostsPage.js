import { Col, Container, Row, Button, Card, Pagination } from "react-bootstrap";
import MyNavbar from "../components/MyNavbar";
import axios from "axios";
import { useState, useEffect } from "react";
import BackendConfig, { BACKEND_URL } from "../configuration/BackendConfig";
import { useNavigate } from "react-router-dom";
import NewPost from "../components/NewPost";
import { FaPlusCircle } from "react-icons/fa";
import { FaRegNewspaper, FaRegClock, FaRegUser } from 'react-icons/fa';

function PostPage() {
  const [posts, setPosts] = useState([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

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
    fetchPosts();
  }, []);

  const fetchPosts = (pageNumber = 0, pageSize = 5) => {
    axios
      .get(BACKEND_URL + "/api/posts/all", {
        params: {
          page: pageNumber,
          size: pageSize,
        },
      })
      .then((response) => {
        console.log(response.data);
        setPosts(response.data);
      })
      .catch((error) => {
        alert("Error retrieving posts!");
        console.error(error.response.data);
      });
  };


  const deletePost = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
      return;
    }

    const deleteRequest = {
      id: id,
    };

    axios
      .delete(BACKEND_URL + "/api/posts/delete", { data: deleteRequest })
      .then((response) => {
        console.log(response.data);
        alert("Post deleted successfully!");
        fetchPosts();
      })
      .catch((error) => {
        alert("Error deleting post!");
        console.error(error.response.data);
      });
  };

  const getShortContent = (content) => {
    if (content.length > 15) {
      return content.substring(0, 15) + "...";
    }
    return content;
  }

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 0 || pageNumber > posts.totalPages + 1) {
      return;
    }

    setCurrentPage(pageNumber);
    fetchPosts(pageNumber - 1);
  };

  return (
    <>
      <Container className="w-50">
        <Row>
          <Col>
            <Button variant="success" onClick={() => setShowNewPostForm(true)}>
              <FaPlusCircle /> New Post
            </Button>
            <NewPost show={showNewPostForm} setShow={setShowNewPostForm} fetchPosts={fetchPosts} />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <Pagination className="mb-0">
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(posts.totalPages).keys()].map(pageNumber => (
                <Pagination.Item key={pageNumber + 1} active={pageNumber + 1 === currentPage} onClick={() => handlePageChange(pageNumber + 1)}>
                  {pageNumber + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === posts.totalPages} />
            </Pagination>
          </Col>
        </Row>
        <hr />
        <Row>
          {posts.length === 0 ? (
            <h2 className="text-center">No posts found</h2>
          ) : (
            posts.content.map((post, index) => {
              return (

                <Col md="12" key={index} className="p-2">
                  <Card className="card-hover-effect" onClick={() => navigate(`/post/${post.id}`)}>
                    <Card.Body>
                      <Card.Title><FaRegNewspaper className="me-2" />{post.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {post.category}
                      </Card.Subtitle>
                      <Card.Text>{getShortContent(post.content)}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted d-flex justify-content-between">
                      <small><FaRegClock className="me-1" />{new Date(post.createdAt).toLocaleDateString()}</small>
                      <Button
                        variant="danger"
                        onClick={(event) => {
                          event.stopPropagation();
                          deletePost(post.id);
                        }}
                      >
                        Delete Post
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
        
      </Container>
    </>
  );
}

export default PostPage;
