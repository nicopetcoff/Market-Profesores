import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/system";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import TablePagination from "@mui/material/TablePagination";
import "../TableStyles.css";
import SpacerTop from "../../../componentes/Spacer/SpacerTop";
import EditCursoForm from "../../../componentes/Forms/EditCursoForm";
import {
  misCursos,
  eliminarCurso,
  actualizarCurso,
} from "../../../controller/miApp.controller";

import Refresher from "../../../componentes/Refresher/Refresher";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import PopupCambiarImagenCurso from "../../../componentes/Popup/PopupCambiarImagenCurso";

const CourseList = styled(TableContainer)`
  margin-top: ${({ theme }) => theme.spacing(2)};
  overflow-x: auto;
  max-width: 100%;
`;

const ResponsiveTable = styled(Table)`
  background-color: #fff;
  @media (max-width: 600px) {
    font-size: 12px;
    table {
      width: 100%;
    }

    th,
    td {
      display: flex;
      flex-direction: column;
      text-align: center;
      margin-bottom: 10px;
    }

    td:last-child {
      border-bottom: 1px solid #ddd;
      margin-bottom: 1rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid grey;
    }
  }
`;

const ButtonContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0px;
  align-items: center; // Centramos los botones
`;

const MisCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formClosed, setFormClosed] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refresher, setRefresher] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      const response = await misCursos();
      if (response && response.rdo === 0) {
        setCursos(response.cursos || []);
      } else {
        console.error(
          response ? response.mensaje : "Error al obtener los cursos"
        );
      }
    };

    fetchCursos();
  }, [refresher]);

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormClosed(true);
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage > 0 ? newRowsPerPage : 10);
    setPage(0);
  };

  const handlePublish = async (curso) => {
    if (curso && "published" in curso) {
      const updatedCursoData = { published: !curso.published };
      const response = await actualizarCurso(curso._id, updatedCursoData);
      if (response && response.rdo === 0) {
        const message = curso.published
          ? "Curso despublicado correctamente."
          : "Curso publicado correctamente.";
        openSnackbar(message);
        setRefresher((prev) => !prev);
      } else {
        console.error(
          response ? response.mensaje : "Error al publicar/despublicar el curso"
        );
      }
    } else {
      console.log("Curso es undefined o no tiene una propiedad published");
    }
  };

  const handleDelete = async (curso) => {
    if (curso) {
      const response = await eliminarCurso(curso._id);
      if (response && response.rdo === 0) {
        openSnackbar("Curso eliminado correctamente.");
        setRefresher((prev) => !prev);
      } else {
        console.error(
          response ? response.mensaje : "Error al eliminar el curso"
        );
      }
    } else {
      console.log("Curso es undefined");
    }
  };

  useEffect(() => {
    if (formClosed) {
      const fetchCursos = async () => {
        const response = await misCursos();
        if (response && response.rdo === 0) {
          setCursos(response.cursos || []);
        } else {
          console.error(
            response ? response.mensaje : "Error al obtener los cursos"
          );
        }
      };

      fetchCursos();

      setFormClosed(false);
    }
  }, [formClosed, refresher]);

  return (
    <>
      <Refresher>
        {({ refrescar }) => (
          <Container>
            <SpacerTop>
              <Typography variant="h4" component="h1" gutterBottom>
                Mis Cursos
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setEditingCourse();
                  openForm();
                }}
              >
                Crear Nuevo Curso
              </Button>
            </SpacerTop>
            <CourseList component={TableContainer}>
              <ResponsiveTable className="responsive-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Curso</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cursos
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((curso) => (
                      <TableRow key={curso.id}>
                        <TableCell>{curso.title}</TableCell>
                        <TableCell>{curso.description}</TableCell>
                        <TableCell>
                          {curso.published ? "Publicado" : "No Publicado"}
                        </TableCell>
                        <TableCell>
                          <ButtonContainer>
                            <IconButton
                              className="boton-tabla"
                              onClick={() => {
                                setEditingCourse(curso);
                                openForm();
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </ButtonContainer>
                          <ButtonContainer>
                            <IconButton
                              className="boton-tabla"
                              onClick={() => {
                                setSelectedCurso(curso);
                                setIsPopupOpen(true);
                              }}
                            >
                              <ImageIcon />
                            </IconButton>
                          </ButtonContainer>
                          <ButtonContainer>
                            <IconButton
                              className="boton-tabla"
                              onClick={() => handlePublish(curso)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </ButtonContainer>
                          <ButtonContainer>
                            <IconButton
                              className="boton-tabla"
                              onClick={() => handleDelete(curso)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ButtonContainer>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </ResponsiveTable>
            </CourseList>
            <TablePagination
              component="div"
              count={cursos.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Container>
        )}
      </Refresher>
      {isFormOpen && (
        <EditCursoForm
          open={isFormOpen}
          handleClose={closeForm}
          cursoToEdit={editingCourse}
          title={editingCourse ? "Editar Curso" : "Crear Nuevo Curso"}
        />
      )}
      {isPopupOpen && (
        <PopupCambiarImagenCurso
          open={isPopupOpen}
          handleClose={() => {
            setIsPopupOpen(false);
            setSelectedCurso(null);
          }}
          cursoToEdit={selectedCurso}
          title={"Editar imagen del curso"}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          severity="success"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default MisCursos;
