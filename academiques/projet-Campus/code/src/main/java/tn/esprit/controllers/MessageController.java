package tn.esprit.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;
import tn.esprit.entities.WebSocket.HelloMessage;
import tn.esprit.entities.WebSocket.Message;

@Controller
public class MessageController {

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/application")
    @SendTo("/all/messages")
    public Message msg(HelloMessage message) throws InterruptedException {
        Thread.sleep(2000);
        return new Message("Hello, " + HtmlUtils.htmlEscape(message.getName()));

    }

    /*@MessageMapping("/private")
    public void sendToSpecificUser(@Payload Message message) {
        simpMessagingTemplate.convertAndSendToUser(message.getTo(), "/specific", message);
    }*/
}
