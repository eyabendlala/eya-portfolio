package tn.esprit.controllers;

import com.itextpdf.awt.DefaultFontMapper;
import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.*;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.Events;
import tn.esprit.entities.ResourceNotFoundException;
import tn.esprit.entities.User;
import tn.esprit.repositories.EventsRepository;
import tn.esprit.repositories.UserRepository;
import tn.esprit.services.EventReminderScheduler;
import tn.esprit.services.EventsService;

import javax.persistence.EntityNotFoundException;
import java.awt.*;
import java.awt.geom.Rectangle2D;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;

@RestController
@RequestMapping("/")
public class EventsController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventsService eventsService;

    @Autowired
    private EventsRepository eventsRepository;
   /* @Autowired
    private JavaMailSender emailSender;*/
    @GetMapping("/events")
    public List<Events> getAllEvents() {
        return eventsService.getAllEvents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Events> getEventById(@PathVariable("id") Long eventId) {
        Optional<Events> event = eventsService.getEventById(eventId);
        if (event.isPresent()) {
            return ResponseEntity.ok(event.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/Post")
    public ResponseEntity<Void> saveEvent(@RequestBody Events event) {
        eventsService.saveEvent(event);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEventById(@PathVariable("id") Long eventId) {
        eventsService.deleteEventById(eventId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/popular")
    public List<Events> getPopularEvents() {
        List<Events> popularEvents = eventsRepository.findTop10ByOrderByNbrParticipantDesc();
        return popularEvents;
    }
    @GetMapping("/most-popular-events")
    public ResponseEntity<List<Events>> getMostPopularEvents() {
        List<Events> events = eventsRepository.findTop10ByOrderByNbrParticipantDesc();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
    @GetMapping("/barGraph")
    public Map<String, Integer> getEventPerMonth() {
        List<Events> events = eventsRepository.findAll();
        Map<String, Integer> eventsPerMonth = new LinkedHashMap<>();
        for (Events event : events) {
            String month = new SimpleDateFormat("MMMM").format(event.getStartDate());
            eventsPerMonth.put(month, eventsPerMonth.getOrDefault(month, 0) + 1);
        }
        return eventsPerMonth;
    }
  @PostMapping("/events/{eventId}/register/{userId}")
   public ResponseEntity<String> registerUserForEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        Events event = eventsRepository.findById(eventId).orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<User> users = event.getUsers();
        users.add(user);
        event.setUsers(users);
        eventsRepository.save(event);

        return ResponseEntity.ok().body("User with ID " + userId + " has been registered for event with ID " + eventId);
    }
   /* @PostMapping("/events/{eventId}/register/{userId}")
    public ResponseEntity<String> registerUserForEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        Events event = eventsRepository.findById(eventId).orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Set<User> users = event.getUsers();
        users.add(user);
        event.setUsers(users);
        eventsRepository.save(event);

        Set<Events> events = user.getEvents();
        events.add(event);
        user.setEvents(events);
        userRepository.save(user);

        return ResponseEntity.ok().body("User with ID " + userId + " has been registered for event with ID " + eventId);
    }
*/

/*
    @GetMapping("/user/{userId}/events")
    public ResponseEntity<List<Events>> getEventsForUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Set<Events> events = user.getEvents();

        return ResponseEntity.ok().body(new ArrayList<>(events));
    }
*/
    @GetMapping("/{id}/users")
    public ResponseEntity<List<User>> getUsersRegisteredForEvent(@PathVariable(value = "id") Long eventId) {
        List<User> users = eventsService.getUsersRegisteredForEvent(eventId);
        if (users.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(users);
    }

   @PostMapping("/events/{eventId}/users/{userId}")
    public void registerUserToEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        eventsService.registerUserForEvent(eventId, userId);
    }



    @GetMapping("/{eventId}/userrs")
    public List<User> getAllRegisteredUsers(@PathVariable Long eventId) {
        return eventsService.getAllRegisteredUsers(eventId);
    }
    @GetMapping("/{eventId}/registered-users-emails")
    public List<String> getRegisteredUsersEmailsForEvent(@PathVariable Long eventId) {
        Events event = eventsRepository.findById(eventId).orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        List<User> users = event.getUsers();
        List<String> emails = new ArrayList<>();
        for (User user : users) {
            emails.add(user.getEmail());
        }
        return emails;
    }/*
    @GetMapping("/{eventId}/send-reminder-emails")
    public void sendReminderEmailsForEvent(@PathVariable Long eventId) {
        Events event = eventsRepository.findById(eventId).orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        List<String> emails = getRegisteredUsersEmailsForEvent(eventId);
        Date eventStartDate = event.getStartDate();

        // Calculate the difference between current time and event start time
        long diffInMillis = eventStartDate.getTime() - System.currentTimeMillis();
        int hoursBeforeEvent = (int) TimeUnit.MILLISECONDS.toHours(diffInMillis);

        if (hoursBeforeEvent <= 4) {
            for (String email : emails) {
                // Send reminder email to the registered user
                // You can use any email API or library here to send the email
                // For example, using Spring's JavaMailSender:
                emailSender.sendSimpleMessage(email, "Reminder: Event " + event.getName() + " starts in 4 hours",
                        "This is a reminder that the event " + event.getName() + " starts in 4 hours.");
            }
        }
    }*/
   /* @GetMapping("/{eventId}/registered-users-phone-numbers")
    public List<String> getRegisteredUsersPhoneNumbersForEvent(@PathVariable Long eventId) {
        Events event = eventsRepository.findById(eventId).orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));
        List<User> users = event.getUsers();
        List<String> phoneNumbers = new ArrayList<>();
        for (User user : users) {
            phoneNumbers.add(user.getPhone());
        }
        return phoneNumbers;
    }*/
    @GetMapping("/{eventId}/registered-users-phone-numbers")
    public ResponseEntity<List<String>> getRegisteredUsersPhoneNumbersForEvent(@PathVariable Long eventId) {
        Events event = eventsRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        List<String> phoneNumbers = eventsService.getRegisteredUsersPhoneNumbersForEvent(event);

        return ResponseEntity.ok(phoneNumbers);
    }/*
    @GetMapping("/{eventId}/send-sms")
    public void sendSmsToRegisteredUsers(@PathVariable Long eventId) {
        String message = "ya rabi";
        eventsService.sendSmsToRegisteredUsers(eventId, message);
    }
*/
    @PostMapping("/events/{eventId}/start-reminder-scheduler")
    public ResponseEntity<Void> startEventReminderScheduler(@PathVariable Long eventId) {
        Optional<Events> optionalEvent = eventsService.getEventById(eventId);
        if (!optionalEvent.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Events event = optionalEvent.get();
        EventReminderScheduler scheduler = new EventReminderScheduler(event);
        scheduler.start();

        return ResponseEntity.noContent().build();
    }
  /*  @GetMapping("/{eventId}/test-send-sms-reminder")
    public void testSendSmsReminder(@PathVariable Long eventId) {
        Optional<Events> event = eventsService.getEventById(eventId);
        if (!event.isPresent()) {
            throw new EntityNotFoundException("Event with ID " + eventId + " not found");
        }

        EventReminderScheduler scheduler = new EventReminderScheduler(event.get());
        scheduler.start();
    }
*/




// ...

    @GetMapping("/{eventId}/test-send-sms-reminder")
    public void testSendSmsReminder(@PathVariable Long eventId) {
        Logger logger = LoggerFactory.getLogger(this.getClass());

        logger.info("Starting testSendSmsReminder method");

        Optional<Events> event = eventsService.getEventById(eventId);
        if (!event.isPresent()) {
            throw new EntityNotFoundException("Event with ID " + eventId + " not found");
        }

        logger.info("Event found: {}", event.get());

        EventReminderScheduler scheduler = new EventReminderScheduler(event.get());
        scheduler.start();

        if (scheduler.getCountdownTask().isSmsSent()) {
            logger.info("SMS reminder sent successfully.");
        } else {
            logger.info("Failed to send SMS reminder.");
        }

        logger.info("Exiting testSendSmsReminder method");
    }
    @GetMapping("/{eventId}/send-sms")
    public void sendSmsToRegisteredUsers(@PathVariable Long eventId) {
        Optional<Events> optionalEvent = eventsService.getEventById(eventId);
        if (optionalEvent.isPresent()) {
            Events event = optionalEvent.get();
            Date startDate = event.getStartDate();
            // Calculate the time left before the event start date
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime startDateTime = new Timestamp(startDate.getTime()).toLocalDateTime();
            Duration duration = Duration.between(now, startDateTime);
            long hoursLeft = duration.toHours();
            long minutesLeft = duration.toMinutes() % 60;
            String message = String.format("Reminder: The event %s will start in %d hours and %d minutes", event.getName(), hoursLeft, minutesLeft);
            eventsService.sendSmsToRegisteredUsers(eventId, message);
        } else {
            throw new EntityNotFoundException("Event with ID " + eventId + " not found");
        }
    } /*
    @GetMapping("/statistics")
    public ResponseEntity<byte[]> getStatisticsAsPdf() throws IOException, DocumentException {
        // Get the statistics data
        Map<String, Integer> statistics = eventsService.getStatistics();

        // Create a new PDF document
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);
        document.open();

        // Add the statistics to the document
        Paragraph heading = new Paragraph("Event Statistics");
        heading.setAlignment(Element.ALIGN_CENTER);
        document.add(heading);
        document.add(Chunk.NEWLINE);
        PdfPTable table = new PdfPTable(2);
        table.addCell("Month");
        table.addCell("Number of Events");
        for (Map.Entry<String, Integer> entry : statistics.entrySet()) {
            table.addCell(entry.getKey());
            table.addCell(String.valueOf(entry.getValue()));
        }
        document.add(table);

        // Close the document
        document.close();

        // Return the PDF as a byte array for download
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "event_statistics.pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        ResponseEntity<byte[]> response = new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
        return response;
    }
*/

    @GetMapping("/statistics")
    //@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<byte[]> getStatisticsAsPdf() throws IOException, DocumentException {
// Get the statistics data
        Map<String, Integer> statistics = eventsService.getStatistics();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter writer = PdfWriter.getInstance(document, baos);
        document.open();
// Add the CampusConnect logo to the top left corner of the page
        Font logoFont = new Font(Font.FontFamily.HELVETICA, 16, Font.NORMAL, new BaseColor(42, 120, 178));
        Paragraph logoParagraph = new Paragraph("CampusConnect", logoFont);
        logoParagraph.setAlignment(Element.ALIGN_LEFT);
        logoParagraph.setSpacingBefore(20);
        document.add(logoParagraph);
// Get the direct content of the PDF document under the existing content
        PdfContentByte contentByte = writer.getDirectContentUnder();

// Create the chart as an image and add it to the PDF document
        JFreeChart chart = createChart(statistics);
        int chartWidth = 500;
        int chartHeight = 300;
        PdfTemplate chartTemplate = contentByte.createTemplate(chartWidth, chartHeight);
        Graphics2D chartGraphics = chartTemplate.createGraphics(chartWidth, chartHeight, new DefaultFontMapper());
        Rectangle2D chartArea = new Rectangle2D.Double(0, 0, chartWidth, chartHeight);
        chart.draw(chartGraphics, chartArea);
        chartGraphics.dispose();
        contentByte.addTemplate(chartTemplate, (PageSize.A4.getWidth() - chartWidth) / 2, (PageSize.A4.getHeight() - chartHeight) / 2);

// Add the statistics table to the document
        Paragraph heading = new Paragraph("Event Statistics");
        heading.setAlignment(Element.ALIGN_CENTER);
        document.add(heading);
        document.add(Chunk.NEWLINE);
        PdfPTable table = new PdfPTable(2);
        table.addCell("Month");
        table.addCell("Number of Events");
        for (Map.Entry<String, Integer> entry : statistics.entrySet()) {
            table.addCell(entry.getKey());
            table.addCell(String.valueOf(entry.getValue()));
        }
        document.add(table);

// Close the document
        document.close();

// Return the PDF as a byte array for download
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "event_statistics.pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        ResponseEntity<byte[]> response = new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
        return response;
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
