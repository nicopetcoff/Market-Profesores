import { CartelCursos } from "../../componentes/Cursos/TituloCursos/CartelCursos";
import PrimarySearchAppBar from "../../componentes/NavNarGeneral/NavBar";
import CustomSeparator from "../../componentes/Breadcrumb/Breadcrumb";
export default function Cursos() {
  return (
    <>
    <PrimarySearchAppBar />
    <CustomSeparator> Cursos </CustomSeparator>  
    <CartelCursos />

    </>
  );
}