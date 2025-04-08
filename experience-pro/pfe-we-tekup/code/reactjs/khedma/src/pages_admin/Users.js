import AdminLayout from "../hocs/AdminLayout"
import React, {useState, useEffect} from 'react';
import DataTable from './DataTable'; 
import axios from 'axios';
import './Users.css';
import {Row,FormGroup,FormControl,Col, Card} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { load_user } from '../actions/auth';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCheck, faX} from '@fortawesome/free-solid-svg-icons'

const Users = (props) => {

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        props.load_user();
    }, []);

    const connectedUser = props.personne
    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await axios.get('/admin/users/');
            let users = []
            users.push(connectedUser.user)
            for(let user of response.data.users){
                if(user.id !== connectedUser.user.id){
                    users.push(user)
                }
            }
            setUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        };

        if(connectedUser !== null && connectedUser !== undefined){
            fetchUsers();
        }
    }, [connectedUser]);

    const updateUser = (data) =>{
        navigate('/admin/updateUser/'+data.id);
    }

    const deleteUser = async (data) =>{
        try{
            const response = await axios.delete('/admin/users/', { data: data })
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
    }
    
    const headers = ['email','adresse','identifiant','numero de Telephone','role','nationalite']; 

    const [isModalOpen, setIsModalOpen] = useState({'status':false,'action': null,'id':null});
    
    const [selectedUser, setSelectedUser] = useState(null);
    const handleRowClick = async (index,user) => {
        const rows = document.getElementsByClassName('selected-row');
        if (rows.length !== 0){
            rows[0].className = ''
        }

        const selectedRow = document.getElementById('row'+index)
        let response;
        try{
            if (user.role === 'societe'){
                response = await axios.get(`/admin/users/${user.id}/`);
               // console.log(response.data)
                const { nom, description, website, secteur, role, best, id } = response.data;
                const selectedAttributes = { nom, description, website, secteur, role, best, id };
                selectedAttributes.index = index;
                setSelectedUser(selectedAttributes)
                selectedRow.className = 'selected-row'
            }else{
                response = await axios.get(`/admin/users/${user.id}/`);
                const { nom, prenom, genre, date_naissance, role, titreduprofil } = response.data;
                const selectedAttributes = { nom, prenom, genre, date_naissance, role, titreduprofil };
                selectedAttributes.index = index;
                setSelectedUser(selectedAttributes)
                selectedRow.className = 'selected-row'
            }
        setIsModalOpen({'status':true})
        }catch (error){
            console.log('Error fetching user',error)
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen({'status':false});
      //  console.log(selectedUser)
        const selectedRow = document.getElementById('row'+selectedUser.index)
        selectedRow.className = ''
    };

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate the index of the first and last user for the current page
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const [currentUsers,setCurrentUsers] = useState(users);
    const displayedUser = currentUsers.slice(indexOfFirstUser, indexOfLastUser)

    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        const rows = document.getElementsByClassName('selected-row');
        if (rows.length !== 0){
            rows[0].className = ''
        }
    };

    const handleLinkClick = (role)=>{
        let tabOfUsers = []
        if(role === 'all'){
            setCurrentUsers(users)
            setCurrentPage(1)
        }else{
            for (let user of users){
                if(user.role === role){
                    tabOfUsers.push(user)
                }
            }
            setCurrentUsers(tabOfUsers)
            setCurrentPage(1)
        }
    }

    const filteredUsers = displayedUser.filter((user) =>
        Object.values(user).some((field) =>
            String(field).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleBest = async(user) =>{
      //  console.log(user)
        try{
            const response = await axios.put(`/societe-best/${user.id}/`)
            toast.success(response.data, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              window.location.reload()
        }catch(error){
            console.error('Error updating society',error)
        }
    }

    return(
        <>
            <AdminLayout> 
            <Row className='justify-content-md-center mt-4'>
                <FormGroup>
                    <FormControl type="text"
                                placeholder="Search"
                                style={{ width: "1150px" }}
                                onChange={handleSearchChange}
                    />
                </FormGroup>
            </Row>
            <Row className="mt-4">
                <Col md={12}>
                    <span style={{display:'flex', alignItems:'center'}}>
                        <button className="link-style" onClick={() => handleLinkClick('all')}> Tous</button> | 
                        <button className="link-style" onClick={() => handleLinkClick('admin')}> Admins</button> | 
                        <button className="link-style" onClick={() => handleLinkClick('candidat')}> Candidats</button> | 
                        <button className="link-style" onClick={() => handleLinkClick('societe')}> Societes</button> | 
                        <button className="link-style" onClick={() => handleLinkClick('employeur')}> Employeurs</button> 
                    </span>
                </Col>
            </Row>
            <Row classname='justify-content-md-center mt-1' style={{ minHeight: '512px' }}>
                <Col md={12}>
                {( (filteredUsers.length !== 0 || displayedUser.length !== 0) && connectedUser !== undefined && connectedUser !== null) && 
                (
                    <DataTable
                        headers={headers}
                        users={filteredUsers || displayedUser}
                        updateUser={updateUser}
                        deleteUser={deleteUser}
                        onRowClick={handleRowClick}
                        pagination
                        paginate={paginate} 
                        totalUsers={users.length} 
                        usersPerPage={usersPerPage} 
                        currentPage={currentPage} 
                        connectedId={connectedUser.user.id}
                    />
                )}
                </Col>
            </Row>

        </AdminLayout>
        <Modal
        isOpen={isModalOpen.status}
        onRequestClose={handleCloseModal}
        contentLabel="Delete Confirmation"
        className="modal-content" // Apply class for modal content
        overlayClassName="react-modal-overlay" // Apply class for modal overlay
        >
            {
                selectedUser && (
                    <div>
                            {selectedUser.role === 'societe' ? (
                                <Card>
                                    <Card.Body>
                                        <Card.Title><center><u>Societe Details</u></center></Card.Title>
                                        <Card.Text><b>Nom:</b> {selectedUser.nom}</Card.Text>
                                        <Card.Text><b>Description:</b> {selectedUser.description}</Card.Text>
                                        <Card.Text><b>Website:</b> {selectedUser.website}</Card.Text>
                                        <Card.Text><b>Secteur:</b> {selectedUser.secteur}</Card.Text>
                                        <Card.Text><b>Best:</b> {selectedUser.best ? (
                                            <button onClick={()=>handleBest(selectedUser)} 
                                                    style={{background:'transparent', height:'auto',width:'auto', border:'none'}}
                                            >
                                                <FontAwesomeIcon icon={faCheck} style={{color: "#57e389"}} />
                                            </button>
                                        ): (
                                            <button onClick={()=>handleBest(selectedUser)}
                                                    style={{background:'transparent', height:'auto',width:'auto', border:'none'}}
                                            >
                                                <FontAwesomeIcon icon={faX} style={{color: "#ed333b"}} />
                                            </button>
                                        )}</Card.Text>
                                    </Card.Body>
                                </Card>
                            ) : (
                                <Card>
                                    <Card.Body>
                                        <Card.Title><center><u>{selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)} Details</u></center></Card.Title>
                                        <Card.Text><b>Nom:</b> {selectedUser.nom}</Card.Text>
                                        <Card.Text><b>Prenom:</b> {selectedUser.prenom}</Card.Text>
                                        <Card.Text><b>Genre:</b> {selectedUser.genre}</Card.Text>
                                        <Card.Text><b>Date de Naissance:</b> {selectedUser.date_naissance}</Card.Text>
                                        <Card.Text><b>Titre du Profil:</b> {selectedUser.titreduprofil}</Card.Text>
                                    </Card.Body>
                                </Card>
                            )}
                        </div>
                )
            }
        
      </Modal>
    </>
    )
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    societe: state.auth.user && state.auth.user.societe,
    personne: state.auth.user && state.auth.user.personne,
    role: state.auth.user && state.auth.user.role,
});

export default connect(mapStateToProps, { load_user })(Users);;