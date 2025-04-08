package tn.esprit.controllers;


import com.google.zxing.WriterException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.entities.QRCodeGenerator;
import tn.esprit.entities.User;
import tn.esprit.repositories.FactureRRepository;
import tn.esprit.services.EmailSenderService;


import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.MessagingException;
import javax.mail.internet.MimeBodyPart;
import javax.activation.DataSource;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;

@CrossOrigin
@RestController
public class QRCodeController {
	@Autowired
	private EmailSenderService emailService;
	@Autowired
	FactureRRepository factureRepository;
	@Autowired
	 JavaMailSender javaMailSender;
	private static final String QR_CODE_IMAGE_PATH = "./src/main/resources/QRCode.png";



	@GetMapping(value = "/genrateQRCode/{id}")
	public String getQRCode(Model model, @PathVariable("id") Long id) throws IOException, WriterException, MessagingException {
		Date qrCodeContent = factureRepository.findDateFinByFacture(id);
		//User useremailTo = factureRepository.findUserFacture(id);


		String dateFinStr = "";
		if (qrCodeContent != null) {
			dateFinStr = new SimpleDateFormat("yyyy-MM-dd").format(qrCodeContent);
		}

		String qrCodeText = "FactureR ID: " + id + "\nDate fin: " + dateFinStr;

		byte[] image = new byte[0];
		try {

			// Generate and Return Qr Code in Byte Array
			image = QRCodeGenerator.getQRCodeImage(qrCodeText, 250, 250);

			// Generate and Save Qr Code Image in static/image folder
			QRCodeGenerator.generateQRCodeImage(qrCodeText, 250, 250, QR_CODE_IMAGE_PATH);

		} catch (WriterException | IOException e) {
			e.printStackTrace();
		}
		// Convert Byte Array into Base64 Encode String
		String qrcode = Base64.getEncoder().encodeToString(image);

		model.addAttribute("medium", qrCodeText);
		model.addAttribute("github", qrCodeText);
		model.addAttribute("qrcode", qrcode);
		sendQRCodeEmail(image,id);
		return "Generate";
	}
	 public void sendQRCodeEmail(byte[] image,long id) throws MessagingException {

      //  SimpleMailMessage mailMessage = new SimpleMailMessage();

        String useremailTo = factureRepository.findUseremailFacture(id);
		String username =factureRepository.findUsernomFacture(id);
		 ByteArrayResource imageResource = new ByteArrayResource(image);
		 MimeMessage mimeMessage = javaMailSender.createMimeMessage();
		 MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
		 messageHelper.setFrom("campusconnect.nextek@gmail.com");
		 messageHelper.setTo(useremailTo);
		 messageHelper.setSubject("FactureR Payment Confirmation");
		 messageHelper.setText("Dear " + username + ",\n\nThank you for your payment for FactureR with ID " + id +
				 ". Your payment has been confirmed.\n\nHere is the QR code containing the dateFin of the FactureR:\n\n " +
				 "\n Best regards,\n CampusConnect");

		 // Attach the QR code image to the email
		 messageHelper.addAttachment("QRCode.png", imageResource);

        javaMailSender.send( mimeMessage);
    }

}