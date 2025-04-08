package tn.esprit.Interfaces;

import tn.esprit.entities.Events;
import tn.esprit.entities.User;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IServiceEvents {
    List<Events> getAllEvents();

    Optional<Events> getEventById(Long id);
    public String testPlacesEvent(Long idEvents);
    Events addOrUpdateEvent(Events event);
    Events saveEvent(Events event);
    void deleteEventById(Long id);

    Events registerUserForEvent(Long eventId, Long userId);
    List<User> getUsersRegisteredForEvent(Long eventId);
   // List<String> getRegisteredUsersEmailsForEvent(Long eventId);
   // void sendReminderEmail(Long eventId);
   // void sendSimpleMessage(String to, String subject, String text);
   void sendSmsToRegisteredUsers(Long eventId, String message);

    List<String> getRegisteredUsersPhoneNumbersForEvent(Events event);
    Map<String, Integer> getStatistics();
}
