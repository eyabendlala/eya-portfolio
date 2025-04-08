import React from "react";
import { Box, Button, Select, MenuItem, makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  wrapper: {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    position: "absolute",
    top: "53%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
  },
  select: {
    width: "100%",
    marginBottom: "8px",
  },
  button: {
    borderRadius:"12px",
    width: "100%",
    backgroundColor: "#2DAAE1", /* Set the background color of the button */
    color: "white", /* Set the text color to contrast with the background */
  },
});

export default (props) => {
  const classes = useStyles();
 // const handleSearch = () => {
    // Call the applyFiltering function with selectedType and selectedRegion
  //  props.applyFiltering(props.selectedType, props.selectedRegion);
 // };
 const handleSearch = () => {
  // Navigate to the specified URL when the button is clicked
  window.location.href = "/emplois";
};

  return (
    <div>
    <Box p={2} marginTop={-11} mb={3} className={classes.wrapper}>
      
      <Select disableUnderline 
      value={props.selectedType}  // Use the selected value from props
      onChange={(event) => props.setSelectedType(event.target.value)}  // Call the setter function
      defaultValue='Durable' 
      style={{ color: 'black' }}>
      <MenuItem value="Durable">Durable </MenuItem>
      <MenuItem value="Moyen">Moyen </MenuItem>
       
        <MenuItem value="Court">Court </MenuItem>
       
      </Select>
      <Select disableUnderline 
  value={props.selectedRegion}  // Use the selected value from props
  onChange={(event) => props.setSelectedRegion(event.target.value)}  // Call the setter function
  defaultValue='Tunis' 
  style={{ color: 'black' }}
  MenuProps={{
    PaperProps: {
      style: {
        maxHeight: 200, // Adjust the maxHeight to control the number of displayed items
      },
    },
  }}
  
  >
        <MenuItem value="Tunis">Tunis</MenuItem>
       
    <MenuItem value="Ariana">Ariana</MenuItem>
    <MenuItem value="Ben Arous">Ben Arous</MenuItem>,
    <MenuItem value="Manouba">Manouba</MenuItem>
    <MenuItem value="Nabeul">Nabeul</MenuItem>
    <MenuItem value="Zaghouan">Zaghouan</MenuItem>
    <MenuItem value="Bizerte">Bizerte</MenuItem>
    <MenuItem value="Béja">Béja</MenuItem>
    <MenuItem value="Jendouba">Jendouba</MenuItem>
    <MenuItem value="Kef">Kef</MenuItem>
   <MenuItem value="Siliana">Siliana</MenuItem>
    <MenuItem value="Kairouan">Kairouan</MenuItem>
    <MenuItem value="Sousse">Sousse</MenuItem>
    <MenuItem value="Monastir">Monastir</MenuItem>
    <MenuItem value="Mahdia">Mahdia</MenuItem>
    <MenuItem value="Sfax">Sfax</MenuItem>
    <MenuItem value="Kasserine">Kasserine</MenuItem>
    <MenuItem value="Sidi Bouzid">Sidi Bouzid</MenuItem>
    <MenuItem value="Gabès">Gabès</MenuItem>
    <MenuItem value="Medenine">Medenine</MenuItem>
    <MenuItem value="Tataouine">Tataouine</MenuItem>
    <MenuItem value="Gafsa">Gafsa</MenuItem>
    <MenuItem value="Tozeur">Tozeur</MenuItem>
    <MenuItem value="Kebili">Kebili</MenuItem>
       
      </Select>
     
      <Button
          className={classes.button}
          variant="contained"
          disabledElevation
          onClick={handleSearch} // Call handleSearch function on button click
        >
          Recherche
        </Button>
    </Box>
    
    </div>
  );
};
