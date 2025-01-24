import React, { useState, useEffect } from 'react';
    import { boxvereine, orteMitKoordinaten } from './data';
    import { calculateDistance } from './utils';

    export default function App() {
      const [keyword, setKeyword] = useState('');
      const [ort, setOrt] = useState('');
      const [umkreis, setUmkreis] = useState(25);
      const [selectedVereine, setSelectedVereine] = useState([]);
      const [searchResults, setSearchResults] = useState([]);

      useEffect(() => {
        const shuffled = [...boxvereine].sort(() => 0.5 - Math.random());
        setSelectedVereine(shuffled.slice(0, 3));
      }, []);

      const handleSearch = (e) => {
        e.preventDefault();
        
        const suchOrtKoordinaten = orteMitKoordinaten[ort];
        if (!suchOrtKoordinaten) {
          alert('Ort nicht gefunden. Bitte geben Sie einen bekannten Ort ein.');
          return;
        }

        const results = boxvereine.filter(verein => {
          // Schlüsselwortsuche
          const matchesKeyword = keyword === '' || 
            verein.name.toLowerCase().includes(keyword.toLowerCase()) ||
            verein.kategorie.toLowerCase().includes(keyword.toLowerCase()) ||
            verein.beschreibung.toLowerCase().includes(keyword.toLowerCase());
          
          // Umkreissuche
          const distance = calculateDistance(
            suchOrtKoordinaten.lat,
            suchOrtKoordinaten.lng,
            verein.coordinates.lat,
            verein.coordinates.lng
          );
          const matchesUmkreis = distance <= umkreis;

          return matchesKeyword && matchesUmkreis;
        });

        setSearchResults(results);
      };

      const displayedVereine = searchResults.length > 0 ? searchResults : selectedVereine;

      return (
        <div className="container">
          <div className="search-box">
            <h1>Boxverein Verzeichnis Deutschland</h1>
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Schlüsselbegriff (Name, Kategorie, ...)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <input
                type="text"
                placeholder="Ort (z.B. Berlin, Potsdam)"
                value={ort}
                onChange={(e) => setOrt(e.target.value)}
              />
              <select
                value={umkreis}
                onChange={(e) => setUmkreis(Number(e.target.value))}
              >
                {[25, 50, 75, 100, 125, 150, 175, 200].map(km => (
                  <option key={km} value={km}>
                    {km} km
                  </option>
                ))}
              </select>
              <button type="submit">Suchen</button>
            </form>
          </div>

          <div className="vereine-grid">
            {displayedVereine.map((verein) => (
              <div key={verein.name} className="verein-karte">
                <div className="verein-kategorie">{verein.kategorie}</div>
                <h2>{verein.name}</h2>
                <div className="verein-info">
                  <span role="img" aria-label="Telefon">📞</span>
                  {verein.telefon}
                </div>
                <div className="verein-info">
                  <span role="img" aria-label="Adresse">📍</span>
                  {verein.adresse}
                </div>
                <div className="verein-info">
                  <span role="img" aria-label="Öffnungszeiten">⏰</span>
                  {verein.oeffnungszeiten}
                </div>
                <p>{verein.beschreibung}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
