package tn.esprit.Interfaces;

import tn.esprit.entities.FactureR;
import tn.esprit.entities.TypeAbonnementR;
import tn.esprit.entities.TypeModalite;

import javax.mail.MessagingException;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Date;

public interface IFactureRService {
    void updatePaymentStatus(long idFactureR);

    FactureR getFactureRById(long idFactureR);
}