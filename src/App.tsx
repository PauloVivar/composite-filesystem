import { FileExplorer } from './components/FileExplorer';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import { ConfirmDialog } from 'primereact/confirmdialog';

function App() {
  return (
    <div className="App">
      <h1>Explorador de Archivos</h1>
      <FileExplorer />
      <ConfirmDialog />
    </div>
  );
}

export default App;
