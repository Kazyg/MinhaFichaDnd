import { useNavigate } from 'react-router-dom';
import { useFicha } from '../api/fichaPersonagem/FichaContext';
import { useCampanhas } from '../features/areaMestre/useCampanhas';
import AreaMestreWorkspace from '../features/areaMestre/ui/AreaMestreWorkspace';
import './css/Areas.css';

export default function AreaMestre({ repositorio } = {}) {
  const estado = useCampanhas(repositorio);
  const navigate = useNavigate();
  const { salvarPendentes } = useFicha();
  return <AreaMestreWorkspace estado={estado} onSair={async () => {
    if (await estado.salvarAgora() && await salvarPendentes()) navigate('/');
  }} />;
}
