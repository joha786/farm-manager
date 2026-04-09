import { useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import AnimalForm from '../components/forms/AnimalForm';
import CropForm from '../components/forms/CropForm';
import { useFarm } from '../context/FarmContext';
import { farmName } from '../utils/calculations';

export default function Records() {
  const { state, dispatch } = useFarm();
  const [tab, setTab] = useState('animals');
  const [query, setQuery] = useState('');

  const animals = useMemo(() => {
    const q = query.toLowerCase();
    return state.animals.filter((item) =>
      [item.name, item.type, item.breed, item.health, farmName(state.farms, item.farmId)].join(' ').toLowerCase().includes(q)
    );
  }, [state.animals, state.farms, query]);

  const crops = useMemo(() => {
    const q = query.toLowerCase();
    return state.crops.filter((item) =>
      [item.crop, item.variety, item.stage, farmName(state.farms, item.farmId)].join(' ').toLowerCase().includes(q)
    );
  }, [state.crops, state.farms, query]);

  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <span className="eyebrow">Records</span>
          <h1>Animals and crop cycles</h1>
        </div>
        <input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search records" />
      </header>

      <div className="segmented">
        <button className={tab === 'animals' ? 'active' : ''} onClick={() => setTab('animals')}>Animal records</button>
        <button className={tab === 'crops' ? 'active' : ''} onClick={() => setTab('crops')}>Crop cycles</button>
      </div>

      {tab === 'animals' ? (
        <>
          <section className="panel">
            <h2>Add animal record</h2>
            <AnimalForm farms={state.farms} onSubmit={(payload) => dispatch({ type: 'add-animal', payload })} />
          </section>
          <section className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>Farm</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Count</th>
                  <th>Health</th>
                  <th>Next Checkup</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {animals.map((item) => (
                  <tr key={item.id}>
                    <td>{farmName(state.farms, item.farmId)}</td>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>{item.count}</td>
                    <td>{item.health}</td>
                    <td>{item.nextCheckup || 'Not set'}</td>
                    <td><button className="danger-button" onClick={() => dispatch({ type: 'delete-animal', id: item.id })}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {animals.length === 0 && <EmptyState message="No animal records found." />}
          </section>
        </>
      ) : (
        <>
          <section className="panel">
            <h2>Add crop cycle</h2>
            <CropForm farms={state.farms} onSubmit={(payload) => dispatch({ type: 'add-crop', payload })} />
          </section>
          <section className="table-panel">
            <table>
              <thead>
                <tr>
                  <th>Farm</th>
                  <th>Crop</th>
                  <th>Variety</th>
                  <th>Area</th>
                  <th>Stage</th>
                  <th>Expected Harvest</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {crops.map((item) => (
                  <tr key={item.id}>
                    <td>{farmName(state.farms, item.farmId)}</td>
                    <td>{item.crop}</td>
                    <td>{item.variety || 'Not set'}</td>
                    <td>{item.area || 'Not set'}</td>
                    <td><span className="pill">{item.stage}</span></td>
                    <td>{item.expectedHarvest || 'Not set'}</td>
                    <td><button className="danger-button" onClick={() => dispatch({ type: 'delete-crop', id: item.id })}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {crops.length === 0 && <EmptyState message="No crop records found." />}
          </section>
        </>
      )}
    </div>
  );
}
