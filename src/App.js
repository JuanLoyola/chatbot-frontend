import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  List,
  ListItem,
  Paper,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

const UserBubble = styled(Paper)(({ theme }) => ({
  backgroundColor: "#388e3c",
  color: "#fff",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  maxWidth: "75%",
  marginLeft: "auto",
  textAlign: "right"
}));

const BotBubble = styled(Paper)(({ theme }) => ({
  backgroundColor: "#1976d2",
  color: "#fff",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  maxWidth: "75%",
  marginRight: "auto",
  textAlign: "left"
}));

const ErrorBubble = styled(Paper)(({ theme }) => ({
  backgroundColor: "#d32f2f",
  color: "#fff",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  maxWidth: "75%",
  marginRight: "auto",
  textAlign: "left"
}));

function App() {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    const newConversation = [
      ...conversation,
      { sender: "user", text: question }
    ];
    setConversation(newConversation);
    setLoading(true);

    try {
      setTimeout(async () => {
        const response = await axios.post("http://localhost:8080/chatbot", {
          question
        });

        setConversation([
          ...newConversation,
          { sender: "bot", text: response.data.response }
        ]);
        setLoading(false);
      }, 1500); // delay just for the demo
    } catch (error) {
      console.error("Error enviando la pregunta:", error);
      setConversation([
        ...newConversation,
        { sender: "error", text: "Hubo un error al procesar tu solicitud." }
      ]);
      setLoading(false);
    }

    setQuestion("");
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Chatbot
      </Typography>

      <Paper
        elevation={3}
        style={{ padding: "1rem", maxHeight: "400px", overflowY: "auto" }}
      >
        <List>
          {conversation.map((message, index) => (
            <ListItem key={index}>
              {message.sender === "user" ? (
                <UserBubble>{message.text}</UserBubble>
              ) : message.sender === "bot" ? (
                <BotBubble>{message.text}</BotBubble>
              ) : (
                <ErrorBubble>{message.text}</ErrorBubble>
              )}
            </ListItem>
          ))}

          {loading && (
            <ListItem>
              <BotBubble>
                <CircularProgress
                  size={20}
                  color="inherit"
                  style={{ marginRight: "8px" }}
                />
                El bot está escribiendo...
              </BotBubble>
            </ListItem>
          )}

          <div ref={chatEndRef} />
        </List>
      </Paper>

      <Box mt={2} component="form" onSubmit={handleSubmit}>
        <TextField
          label="Escribe tu pregunta"
          variant="outlined"
          fullWidth
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "1rem" }}
        >
          Enviar
        </Button>
      </Box>
    </Container>
  );
}

export default App;
