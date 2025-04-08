package tn.esprit.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.Events;
import tn.esprit.entities.User;
import tn.esprit.Interfaces.IUserService;
import tn.esprit.repositories.UserRepository;
import tn.esprit.services.UserServiceImpl;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import java.util.List;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    IUserService userService;
     UserRepository userRepository;

    @PostMapping("/addUser")


    public User add(@RequestBody User user) {
        return userService.saveUser(user);
    }

  /*  public ResponseEntity<Void> saveUser(@RequestBody User user) {
        userService.saveUser(user);
        return ResponseEntity.noContent().build();
    }
*/



    @PostMapping("updateUser/{userID}")
    @ResponseBody
    User updateUser(@RequestBody User user,@PathVariable Long userID){
        return userService.updateUser(user, userID);
    }

    @GetMapping("/getRole")
    @ResponseBody
    public List<User> findAll() {
        return userService.getAllUsers();
    }


    @DeleteMapping("/delete/{userID}")
    public void deleteUserById(@PathVariable Long userID) {
        userService.deleteUser(userID);

    }
    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, User user) {
        // get error status
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (status != null) {
            int statusCode = Integer.parseInt(status.toString());

            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                return "error-404";
            } else if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                return "error-500";
            }
        }

        return "error";
    }
    @GetMapping("/{userId}/events")
    public List<Events> getEventsForUser(@PathVariable Long userId) {
        return userRepository.findEventsByUserId(userId);
    }
    @PostMapping("/assign/{userId}/{ChambreId}")
    ResponseEntity<String> assignChambreForUser(@PathVariable Long  userId,@PathVariable Long  ChambreId)
    {
        return ResponseEntity.ok().body("User with ID " + userId + " has been registered for chambre with ID " + ChambreId);
    }
}

