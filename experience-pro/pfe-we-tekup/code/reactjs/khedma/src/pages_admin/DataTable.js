import {React, useState} from 'react';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUserMinus, faUserPlus, faCircleChevronRight, faCircleChevronLeft, faSortUp, faSortDown, faCircle, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Users.css';

const DataTable = ({ headers, users, updateUser, deleteUser, onRowClick, pagination, paginate, totalUsers, usersPerPage, currentPage, connectedId}) => {
  const navigate = useNavigate();
  const handleAddUser = () =>{
    navigate('/admin/addUser/')
  }
  const [sorting, setSorting] = useState({
    column: null,
    direction: 'asc',
  });

  const handleSort = (column) => {
    if (sorting.column === column) {
      setSorting({
        column,
        direction: sorting.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSorting({
        column,
        direction: 'asc',
      });
    }
  };
  
const userConnected = users.filter((user) => {
    if (user.id === connectedId)
      return user
  });

users = users.filter((user) => {
    if(user.id !== connectedId)
      return user;
  });

  const sortedUsers = [...users];
  if (sorting.column) {
    sortedUsers.sort((a, b) => {
      const aValue = a[sorting.column];
      const bValue = b[sorting.column];
      if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const [isModalOpen, setIsModalOpen] = useState({'status':false,'action': null,'id':null});

  const handleActivation = (isActive, uid) => {
    setIsModalOpen({'status':true, 'action': isActive, 'id': uid});
  };

  const handleConfirmActivation = async() => {
    try{
        const response = await axios.put(`/admin/users/${isModalOpen.id}/`)
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        window.location.reload();
    }catch(error){
        console.error('Error deleting user',error)
    } 
    setIsModalOpen({'status':false,'action': null,'id':null});
  };

  const handleCloseModal = () => {
    setIsModalOpen({'status':false,'action': null,'id':null});
  };

  return (
    <div>
      <button id='addUser' onClick={handleAddUser} ><FontAwesomeIcon icon={faUserPlus}/></button>
      <Table className="mt-5" responsive>
        <thead>
            <tr>
                <th>#</th>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    onClick={() => handleSort(header)}
                    style={{ cursor: 'pointer' }}
                  >
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                    {sorting.column === header && (
                      <FontAwesomeIcon
                        icon={sorting.direction === 'asc' ? faSortUp : faSortDown}
                        className="ml-1"
                      />
                    )}
                  </th>
                ))}
                <th>Actions</th>
                <th className="table-header" 
                    title={`Vert: Actif\nRouge: Inactive\nCliquer pour changer le statut du compte`}
                    onClick={() => handleSort('is_active')}
                    style={{ cursor: 'pointer' }}
                >
                  Statut
                  <span className="info-icon"><FontAwesomeIcon icon={faCircleInfo} /></span>
                  {sorting.column === 'is_active' && (
                      <FontAwesomeIcon
                        icon={sorting.direction === 'asc' ? faSortUp : faSortDown}
                        className="ml-1"
                      />
                  )}
                </th>
            </tr>
        </thead>
        <tbody>
          {( userConnected.length !== 0 ) && (
              <tr id={'row0'} 
                  key={0} 
                  onClick={() => onRowClick(0,userConnected[0])} 
                  style={{backgroundColor:'gray',color:'white'}}
                  >
                <td>{1}</td>
                {Object.entries(userConnected[0]).map(([key, cellData], cellIndex) => (
                  (key !== 'id' && key !== 'is_active' && key!=='registration_date')  && <td key={cellIndex}>{cellData}</td>
                ))}
                <td style={{ width: '90px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={() => updateUser(userConnected[0])}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </td>
                <td>
                  <button className="button-in-row" onClick={(event)=> {
                                                                event.stopPropagation();
                                                                handleActivation(userConnected[0].is_active, userConnected[0].id);
                                                              }} style={{background:'transparent'}} disabled>
                    {userConnected[0].is_active ? (
                        <FontAwesomeIcon icon={faCircle} style={{color: "#00f531",}} />
                      ) : (
                        <FontAwesomeIcon icon={faCircle} style={{color: "#ff0000",}} />
                  )}</button>
                </td>
              </tr>
          )}
          {Object.keys(sortedUsers).length > 0 ? (
            Object.values(sortedUsers).map((rowData, rowIndex) => (
              <tr id={'row'+(rowIndex+1)} 
                  key={rowIndex+1} 
                  onClick={() => onRowClick(rowIndex+1,rowData)} 
                  >
                <td>{rowIndex + 2}</td>
                {Object.entries(rowData).map(([key, cellData], cellIndex) => (
                  (key !== 'id' && key !== 'is_active' && key!=='registration_date')  && <td key={cellIndex}>{cellData}</td>
                ))}
                <td style={{ width: '90px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={() => updateUser(rowData)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => deleteUser(rowData)}>
                    <FontAwesomeIcon icon={faUserMinus} />
                  </button>
                </td>
                <td>
                  <button className="button-in-row" onClick={(event)=> {
                                                                event.stopPropagation();
                                                                handleActivation(rowData.is_active, rowData.id);
                                                              }} style={{background:'transparent'}}>
                    {rowData.is_active ? (
                        <FontAwesomeIcon icon={faCircle} style={{color: "#00f531",}} />
                      ) : (
                        <FontAwesomeIcon icon={faCircle} style={{color: "#ff0000",}} />
                  )}</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length + 1}>No data available</td>
            </tr>
          )}
        </tbody>
      </Table>
      <hr></hr>
      {pagination && (
        <Row classname='justify-content-md-center mt-4'>
          <Col md={1}>
          <button onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className='pagination-buttons'
          >
            <FontAwesomeIcon icon={faCircleChevronLeft} />
          </button>
          </Col>
          <Col md={10}>
            <center><span>Page {currentPage}</span></center>
          </Col>
          <Col md={1}>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(totalUsers / usersPerPage)}
              className='pagination-buttons'
            >
              <FontAwesomeIcon icon={faCircleChevronRight} />
            </button>
          </Col>
        </Row>
      )}

      <Modal
        isOpen={isModalOpen.status}
        onRequestClose={handleCloseModal}
        contentLabel="Delete Confirmation"
        className="modal-content" // Apply class for modal content
        overlayClassName="react-modal-overlay" // Apply class for modal overlay
      >
        {isModalOpen.action ?(
          <p>Voulez vous vraiment desactiver ce compte?</p>
        ) : (
          <p>Voulez vous vraiment activer ce compte?</p>
        )}
        <div className="modal-buttons">
          <button className="modal-button" onClick={handleConfirmActivation}>Oui</button>
          <button className="modal-button" onClick={handleCloseModal}>Non</button>
        </div>
      </Modal>
    </div>
  );
};

export default DataTable;