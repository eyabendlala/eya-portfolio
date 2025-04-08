package tn.esprit.services;


import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
public class TwilioExample {
    private static final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    private static final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");

    public static void main(String[] args) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        Message message = Message.creator(
                        new PhoneNumber("+21695018151"), // Replace with recipient's phone number
                        new PhoneNumber("+15673716374"), // Replace with your Twilio phone number
                        "Hello, World!")
                .create();

        System.out.println(message.getSid());
    }
}

