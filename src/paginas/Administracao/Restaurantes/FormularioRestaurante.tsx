import {
  AppBar,
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Toolbar,
  Link,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IRestaurante from "../../../interfaces/IRestaurante";
import http from "../../../http";
import { Link as RouterLink } from "react-router-dom";

const FormularioRestaurante = () => {
  const parametros = useParams();
  const [nomeRestaurante, setNomeRestaurante] = useState("");

  useEffect(() => {
    if (parametros.id) {
      http
        .get<IRestaurante>(`restaurantes/${parametros.id}/`)
        .then((resposta) => setNomeRestaurante(resposta.data.nome))
        .catch((erro) => {
          console.error("Erro ao buscar o restaurante:", erro);
          alert("Não foi possível carregar os dados do restaurante.");
        });
    }
  }, [parametros.id]);

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (parametros.id) {
      http
        .put(`restaurantes/${parametros.id}/`, {
          nome: nomeRestaurante,
        })
        .then(() => {
          alert("Restaurante Atualizado");
        });
    } else {
      http
        .post("restaurantes/", {
          nome: nomeRestaurante,
        })
        .then(() => {
          alert("Restaurante Cadastrado");
        });
    }
  };
  return (
    <>
      <Box>
        <Container maxWidth="lg" sx={{ mt: 1 }}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <Typography component="h1" variant="h6">
                Formulário de Restaurantes
              </Typography>
              <Box
                component="form"
                sx={{ width: "100%" }}
                onSubmit={aoSubmeterForm}
              >
                <TextField
                  value={nomeRestaurante}
                  onChange={(evento) => setNomeRestaurante(evento.target.value)}
                  id="standard-basic"
                  label="Nome do Restaurante"
                  variant="standard"
                  fullWidth
                  required
                />
                <Button
                  sx={{ marginTop: 1 }}
                  type="submit"
                  variant="outlined"
                  fullWidth
                >
                  Salvar
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default FormularioRestaurante;
