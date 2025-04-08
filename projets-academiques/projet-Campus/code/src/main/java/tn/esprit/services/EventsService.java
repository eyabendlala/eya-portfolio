package tn.esprit.services;


import com.twilio.http.TwilioRestClient;
import com.twilio.rest.api.v2010.account.MessageCreator;
import lombok.Value;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import tn.esprit.entities.Events;
import tn.esprit.entities.Places;
import tn.esprit.entities.ResourceNotFoundException;
import tn.esprit.entities.User;
import tn.esprit.repositories.EventsRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import java.awt.*;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import tn.esprit.Interfaces.IServiceEvents;
import tn.esprit.repositories.UserRepository;

import javax.mail.internet.MimeMessage;

@Slf4j
    @Service
@Component
    public class EventsService implements IServiceEvents  {

        @Autowired
        EventsRepository eventsRepository;

    @Autowired
    private UserRepository userRepository;

private static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
private static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");
private static final String FROM_NUMBER = System.getenv("TWILIO_FROM_NUMBER");

    private static final long REMINDER_INTERVAL = 5 * 60 * 1000;


    static {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }
    @Override
        public List<Events> getAllEvents() {
            return eventsRepository.findAll();
        }
    @Override
        public Optional<Events> getEventById(Long eventId) {
            return eventsRepository.findById(eventId);
        }
@Override
        public Events saveEvent(Events event) {
    return eventsRepository.save(event);
      }
    @Override
        public void deleteEventById(Long eventId) {
            eventsRepository.deleteById(eventId);
        }
    @Override
    public Events addOrUpdateEvent(Events event) {
        return eventsRepository.save(event);
    }
    @Override
    public String testPlacesEvent(Long idEvents) {
        // TODO Auto-generated method stub
        Events e = eventsRepository.findById(idEvents).orElse(null);

        int NP = e.getNbrParticipant() ;
        int NPMax = e.getMaxNbrParticipant() ;
        float rate = 0 ;

        if (e.getMaxNbrParticipant() - e.getNbrParticipant() == 0){
            rate = 100 ;
            e.setPlaces(Places.full);

        }else{
            rate = NP * 100 / NPMax ;
            e.setPlaces(Places.available);
        }

        e.setRatiing(rate);

        eventsRepository.save(e);

        return ("Rating for this event is " + rate + " % ");

    }
    public List<User> getUsersRegisteredForEvent(Long eventId) {
        return eventsRepository.getUsersRegisteredForEvent(eventId);

    }
    @Override
    public Events registerUserForEvent(Long eventId, Long userId) {
        Events event = eventsRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        event.getUsers().add(user);
        return eventsRepository.save(event);
    }

    public List<User> getAllRegisteredUsers(Long eventId) {
        Events event = eventsRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        return new ArrayList<>(event.getUsers());
    }
    public List<String> getRegisteredUsersEmailsForEvent(Long eventId) {
        Events event = eventsRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        List<User> registeredUsers = event.getUsers();

        return registeredUsers.stream()
                .map(User::getEmail)
                .collect(Collectors.toList());
    }/*
    public void sendReminderEmail(Long eventId) {
        Events event = eventsRepository.findById(eventId).orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        List<User> users = event.getUsers();
        Date startDate = event.getStartDate();
        Date reminderDate = new Date(startDate.getTime() - 4 * 3600 * 1000); // 4 hours before start date
        for (User user : users) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Reminder for event " + event.getName());
            message.setText("Dear " + user.getUserName() + ",\n\nThis is a reminder that you are registered to attend the event " + event.getName() + " on " + startDate + ".\n\nPlease arrive at the venue on time.\n\nBest regards,\nThe event team");
            message.setSentDate(reminderDate);
            try {
                emailSender.send(message);
            } catch (MailException e) {
                // Handle the exception
            }
        }
    }

/*
    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

*//*

    public void sendSimpleMessage(String to, String subject, String text) throws Exception {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text, true);
        emailSender.send(message);
    }
    */

    @Override
    public void sendSmsToRegisteredUsers(Long eventId, String message) {
        Events event = eventsRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        List<String> phoneNumbers = getRegisteredUsersPhoneNumbersForEvent(event);

        for (String phoneNumber : phoneNumbers) {
            Message smsMessage = Message.creator(
                            new PhoneNumber(phoneNumber),
                            new PhoneNumber(FROM_NUMBER),
                            message)
                    .create();

            // Log the SMS SID for debugging purposes
            log.debug("SMS SID: {}", smsMessage.getSid());
        }
    }

    /*
@Override
public void sendSmsToRegisteredUsers(Long eventId) {
    Events event = eventsRepository.findById(eventId)
            .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

    // Calculate the date and time 10 hours before the event start date
    LocalDateTime reminderDateTime = LocalDateTime.ofInstant(event.getStartDate().toInstant(), ZoneId.systemDefault())
            .minusHours(10);

    String reminderMessage = "Reminder: Your event \"" + event.getName() + "\" will start in 10 hours.";

    List<String> phoneNumbers = getRegisteredUsersPhoneNumbersForEvent(event);

    TwilioRestClient client = new TwilioRestClient.Builder(ACCOUNT_SID, AUTH_TOKEN).build();

    for (String phoneNumber : phoneNumbers) {
        Message smsMessage = Message.creator(
                        new PhoneNumber(phoneNumber),
                        new PhoneNumber(FROM_NUMBER),
                        reminderMessage)
                .setSendDateTime(Date.from(reminderDateTime.atZone(ZoneId.systemDefault()).toInstant()))
                .create(client);

        log.debug("SMS SID: {}", smsMessage.getSid());
    }
    }
}
*/
    public List<String> getRegisteredUsersPhoneNumbersForEvent(Events event) {
        List<User> users = event.getUsers();
        List<String> phoneNumbers = new ArrayList<>();
        for (User user : users) {
            phoneNumbers.add(user.getPhone());
        }
        return phoneNumbers;
    }



    @Override
    public Map<String, Integer> getStatistics() {
        List<Events> events = eventsRepository.findAll();
        Map<String, Integer> eventsPerMonth = new LinkedHashMap<>();
        for (Events event : events) {
            String month = new SimpleDateFormat("MMMM").format(event.getStartDate());
            eventsPerMonth.put(month, eventsPerMonth.getOrDefault(month, 0) + 1);
        }
        return eventsPerMonth;
    }
    private JFreeChart createChart(Map<String, Integer> eventsPerMonth) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        for (Map.Entry<String, Integer> entry : eventsPerMonth.entrySet()) {
            String month = entry.getKey();
            Integer count = entry.getValue();
            dataset.addValue(count, "Events", month);
        }
        JFreeChart chart = ChartFactory.createBarChart(
                "Event Statistics",
                "Month",
                "Number of Events",
                dataset,
                PlotOrientation.VERTICAL,
                false,
                true,
                false
        );
        chart.setBackgroundPaint(Color.white);
        CategoryPlot plot = (CategoryPlot) chart.getPlot();
        plot.setBackgroundPaint(Color.lightGray);
        plot.setRangeGridlinePaint(Color.white);
        return chart;
    }






}





