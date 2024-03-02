import axios from "axios";
import { useState } from 'react';
import { Button, Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { BACKEND_URL } from "../configuration/BackendConfig";

export default function Message({ message, fetchConversation }) {
    const username = localStorage.getItem("username");
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message.content);

    const handleDeleteMessage = (messageId) => {
        axios.delete(`${BACKEND_URL}/api/messages/delete/${messageId}`)
            .then(response => {
                fetchConversation();
            })
            .catch(error => {
                console.error("Error deleting message:", error);
                toast.error("Failed to delete message. Please try again.");
            });
    };

    const handleEditMessage = () => {
        setIsEditing(true);
    };

    return (
        <>
            <ToastContainer />
            <Card key={message.id} className="mb-2">
                <Card.Body>
                    {isEditing ? (
                        <textarea value={editedMessage} onChange={(e) => setEditedMessage(e.target.value)} />
                    ) : (
                        <Card.Text>{message.content}</Card.Text>
                    )}
                    <Card.Text className="text-muted">Created at: {message.createdAt}</Card.Text>
                    <Card.Text className="text-muted">Author: {message.author}</Card.Text>
                </Card.Body>
                {message.author === username && (
                    <Card.Footer>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteMessage(message.id)}>Delete</Button>
                    </Card.Footer>
                )}
            </Card>
        </>

    );
}