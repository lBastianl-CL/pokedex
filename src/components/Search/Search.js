import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import CancelIcon from '@mui/icons-material/Cancel';

import "./styles.css";

const Search = ({ history, query }) => {
  const [searchQuery, setSeachQuery] = useState(query || "");

  useEffect(() => {
    history.push(`/${searchQuery}`);
  }, [searchQuery]);

  return (

    <div className="container-search mb-4">
      <div className="center">
        <Form.Label>Nombre o número del pokemon:</Form.Label>
      </div>
      <div className="container-input-btn">
        <input
          onChange={(e) => setSeachQuery(e.currentTarget.value)}
          value={searchQuery}
          placeholder="Ejemplo: Bulbasaur o 1"
        />
        {searchQuery != "" && (
          <button onClick={() => setSeachQuery("")} className="btn-clear">
            <CancelIcon sx={{ fontSize: 40 }} />
          </button>
        )}
      </div>
    </div>

  );
};

export default Search;
