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
  useForkRef,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IRestaurante from "../../../interfaces/IRestaurante";
import http from "../../../http";
import { Link as RouterLink } from "react-router-dom";
import Itag from "../../../interfaces/Itag";
import Restaurante from "../../../componentes/ListaRestaurantes/Restaurante";

const FormularioPrato = () => {
  const parametros = useParams();

  const [nomePrato, setNomePrato] = useState("");
  const [descricao, setDescricao] = useState("");

  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<Itag[]>([]);

  const [imagem, setImagem] = useState<File | null>(null);

  const [restaurante, setRestaurante] = useState("");
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

  useEffect(() => {
    http
      .get<{ tags: Itag[] }>("tags/")
      .then((resposta) => setTags(resposta.data.tags));

    http
      .get<IRestaurante[]>("restaurantes/")
      .then((resposta) => setRestaurantes(resposta.data));
  }, []);

  const SelecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    if (evento.target.files?.length) {
      setImagem(evento.target.files[0]);
    } else {
      setImagem(null);
    }
  };

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formData = new FormData();

    formData.append("nome", nomePrato);
    formData.append("descricao", descricao);
    formData.append("tag", tag);
    formData.append("restaurante", restaurante);

    if (imagem) {
      formData.append("imagem", imagem as File);
    }

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };

    if (parametros.id) {
      // Atualizar prato existente
      http
        .put(`pratos/${parametros.id}/`, formData, config)
        .then(() => {
          alert("Prato atualizado com sucesso");
        })
        .catch((erro) => console.log(erro));
    } else {
      // Criar novo prato
      http
        .post("pratos/", formData, config)
        .then(() => {
          setNomePrato("");
          setDescricao("");
          setTag("");
          setRestaurante("");
          setImagem(null);
          alert("Prato cadastrado com sucesso");
        })
        .catch((erro) => console.log(erro));
    }
  };

  useEffect(() => {
    if (parametros.id) {
      http
        .get<{
          nome: string;
          descricao: string;
          tag: string;
          restaurante: string;
        }>(`pratos/${parametros.id}/`)
        .then((resposta) => {
          setNomePrato(resposta.data.nome);
          setDescricao(resposta.data.descricao);
          setTag(resposta.data.tag);
          setRestaurante(resposta.data.restaurante);
        })
        .catch((erro) => {
          console.error("Erro ao buscar o prato:", erro);
          alert("Não foi possível carregar os dados do prato.");
        });
    }
  }, [parametros.id]);

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
                Formulário de Pratos
              </Typography>
              <Box
                component="form"
                sx={{ width: "100%" }}
                onSubmit={aoSubmeterForm}
              >
                <TextField
                  value={nomePrato}
                  onChange={(evento) => setNomePrato(evento.target.value)}
                  id="standard-basic"
                  label="Nome do Prato"
                  variant="standard"
                  fullWidth
                  required
                />
                <TextField
                  value={descricao}
                  onChange={(evento) => setDescricao(evento.target.value)}
                  id="standard-basic"
                  label="Descrição do Prato"
                  variant="standard"
                  fullWidth
                  required
                  margin="dense"
                />
                <FormControl margin="dense" fullWidth>
                  <InputLabel id="select-tag">Tag</InputLabel>
                  <Select
                    labelId="select-tag"
                    value={tag}
                    onChange={(evento) => setTag(evento.target.value)}
                  >
                    {tags.map((tag) => (
                      <MenuItem key={tag.id} value={tag.value}>
                        {tag.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl margin="dense" fullWidth>
                  <InputLabel id="select-restaurante">Restaurante</InputLabel>
                  <Select
                    labelId="select-restaurante"
                    value={restaurante}
                    onChange={(evento) => setRestaurante(evento.target.value)}
                  >
                    {restaurantes.map((restaurante) => (
                      <MenuItem key={restaurante.id} value={restaurante.id}>
                        {restaurante.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <input type="file" onChange={SelecionarArquivo}></input>
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

export default FormularioPrato;
