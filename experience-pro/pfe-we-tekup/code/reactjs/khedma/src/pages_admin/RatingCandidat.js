import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminLayout from "../hocs/AdminLayout";
import {
  faSortUp,
  faSortDown,
  faCheck,
  faFileArchive,
  faTimes,
  faShare,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { ratingcandidat } from "../actions/auth";

const RatingCandidat = () => {
  const [ratings, setRatings] = useState([]);
  const [sorting, setSorting] = useState({
    column: null,
    direction: "asc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get("/donnerratingcandidat/");
        setRatings(response.data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };
    fetchRatings();
  }, []);

  const handleSort = (column) => {
    if (sorting.column === column) {
      setSorting({
        column,
        direction: sorting.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSorting({
        column,
        direction: "asc",
      });
    }
  };

  let sortedRatings = [...ratings];
  if (sorting.column) {
    sortedRatings.sort((a, b) => {
      const aValue = a[sorting.column];
      const bValue = b[sorting.column];
      if (aValue < bValue) return sorting.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sorting.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditStatus = async (rating, newStatus) => {
    try {
      // Créez un objet de données pour la requête PUT avec le nouveau statut
      const requestData = {
        statut: newStatus,
      };
  
      // Envoyez la requête PUT pour modifier le statut
      const response = await axios.put(`/modifier-statut-rating/${rating.id}/`, requestData);
  
      // Mettez à jour le statut dans la liste locale si la requête réussit
      if (response.status === 200) {
        // Clonez la liste des ratings pour éviter de modifier l'état directement
        const updatedRatings = [...ratings];
        
        // Trouvez le rating correspondant par ID et mettez à jour son statut
        const index = updatedRatings.findIndex((r) => r.id === rating.id);
        if (index !== -1) {
          updatedRatings[index].statut = newStatus;
          setRatings(updatedRatings);
        }
      }
    } catch (error) {
      console.error("Error updating rating status:", error);
      // Gérez les erreurs de la requête ici
    }
  };
  
  

  return (
    <AdminLayout>
      <div>
        <br />
        <br />
        <br />
        <Form inline>
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            onChange={handleSearchChange}
          />
        </Form>
      </div>

      <Table className="mt-4 centered-table" responsive>
        <thead>
          <tr>
            <th>#</th>
            <th onClick={() => handleSort("societe_id")}>Societe ID</th>
            <th onClick={() => handleSort("societe_nom")}>Nom de la Societe</th>
            <th onClick={() => handleSort("candidat_id")}>Candidat ID</th>
            <th onClick={() => handleSort("candidat_nom")}>Nom du Candidat</th>
            <th onClick={() => handleSort("candidat_prenom")}>Prénom du Candidat</th>
            <th onClick={() => handleSort("moyenne_rating")}>Moyenne Rating</th>
            <th onClick={() => handleSort("statut")}>Statut</th>
            <th onClick={() => handleSort("statut")}>Date de notation</th>
            <th>Modifier Statut</th>
          </tr>
        </thead>
        <tbody>
          {sortedRatings
            .filter((rating) =>
              Object.values(rating).some((field) =>
                String(field)
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
            )
            .map((rating, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{rating.societe_id}</td>
                <td>{rating.societe_nom}</td>
                <td>{rating.candidat_id}</td>
                <td>{rating.candidat_nom}</td>
                <td>{rating.candidat_prenom}</td>
                <td>{rating.moyenne_rating}</td>
                <td>{rating.statut}</td>
                <td>{rating.date}</td>
                <td>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                        onClick={() => handleEditStatus(rating, "vérifié")}
                        title="Modifier Statut"
                        >
                        <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                        onClick={() => handleEditStatus(rating, "pas vérifié")}
                        title="Modifier Statut"
                        >
                        <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    </td>

              </tr>
            ))}
        </tbody>
      </Table>
    </AdminLayout>
  );
};

export default RatingCandidat;
