package tn.esprit.services;

import com.itextpdf.text.*;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.pdf.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tn.esprit.Interfaces.ITransactionSNService;
import tn.esprit.entities.NGO;
import tn.esprit.entities.SurplusAlim;
import tn.esprit.entities.Transaction_Surplus_NGO;
import tn.esprit.repositories.NGORepositoy;
import tn.esprit.repositories.SurplusRepository;
import tn.esprit.repositories.TransactionSurplusNGORepository;

import java.io.*;
import java.util.Date;
import java.util.List;
import java.util.stream.Stream;
import com.itextpdf.text.pdf.PdfWriter;


@Service
@AllArgsConstructor
@Slf4j
public class TransactionSNServiceImpl implements ITransactionSNService {

    SurplusRepository surplusRepository;
    TransactionSurplusNGORepository transRepo;
    NGORepositoy ngoRepositoy;

    @Override
    public Transaction_Surplus_NGO ajouterTrans(Transaction_Surplus_NGO st) {

        return transRepo.save(st);
    }

    @Override
    public void assignSurplusToNGO(int surplusId, int ngoId, float qttSurplus) {
        SurplusAlim surplus = surplusRepository.findById(surplusId).orElse(null);
        NGO ngo = ngoRepositoy.findById(ngoId).orElse(null);
        Transaction_Surplus_NGO transaction = new Transaction_Surplus_NGO();
        transaction.setNgo(ngo);
        transaction.setQttDonated(qttSurplus);
        transaction.setDateDonation(new Date(System.currentTimeMillis()));
        transaction.setSurplusAlim(surplus);
        transRepo.save(transaction);
    }

    @Override
    public List<Transaction_Surplus_NGO> ListTrans(){
        return transRepo.findAll();
    }

    @Override
    public void supprimerTrans(Integer idTrans) {
        Transaction_Surplus_NGO r = transRepo.findById(idTrans).orElse(null);

        transRepo.delete(r);
    }

    @Override
    public void updateTrans(Transaction_Surplus_NGO ng, Integer idTrans) {

        Transaction_Surplus_NGO rec= transRepo.findById(idTrans).orElse(null);

        rec.setIdTransaction(ng.getIdTransaction());
        rec.setNgo(ng.getNgo());
        rec.setDateDonation(ng.getDateDonation());
        rec.setQttDonated(ng.getQttDonated());
        rec.setSurplusAlim(ng.getSurplusAlim());
        transRepo.save(rec);

    }

    @Override
    public Transaction_Surplus_NGO getTransById(Integer idTrans) {

        return transRepo.getById(idTrans);
    }

    public static ByteArrayInputStream donationsPDFReport(List<Transaction_Surplus_NGO> donation) {

        Document document = new Document();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // add text to pdf file
            com.itextpdf.text.Font font= FontFactory.getFont(FontFactory.TIMES_BOLDITALIC, 25, BaseColor.BLUE); //size, color
            Paragraph para = new Paragraph("Donations Summary - Campus Connect", font);
            para.setAlignment(Element.ALIGN_CENTER);
            document.add(para);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(4);

            // column titles
                Stream.of("ID","Quantity","Date","NGO")
                    .forEach(headerTitle -> {
                        PdfPCell x = new PdfPCell();
                        com.itextpdf.text.Font headfont= FontFactory.getFont(FontFactory.HELVETICA_BOLD);
                        x.setBackgroundColor(BaseColor.LIGHT_GRAY);
                        x.setHorizontalAlignment(Element.ALIGN_CENTER);
                        x.setBorderWidth(1);
                        x.setPhrase(new Phrase(headerTitle, headfont));
                        table.addCell(x);
            });

            for (Transaction_Surplus_NGO don: donation) {
                PdfPCell idDonation = new PdfPCell(new Phrase(String.valueOf(don.getIdTransaction())));
                idDonation.setPaddingLeft(1);
                idDonation.setVerticalAlignment(Element.ALIGN_MIDDLE);
                idDonation.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(idDonation);

                PdfPCell qtteDonation = new PdfPCell(new Phrase(String.valueOf(don.getQttDonated())));
                qtteDonation.setPaddingLeft(1);
                qtteDonation.setVerticalAlignment(Element.ALIGN_MIDDLE);
                qtteDonation.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(qtteDonation);

                PdfPCell dateDonation = new PdfPCell(new Phrase(String.valueOf(don.getDateDonation())));
                dateDonation.setPaddingLeft(1);
                dateDonation.setVerticalAlignment(Element.ALIGN_MIDDLE);
                dateDonation.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(dateDonation);

                PdfPCell ngoDonation = new PdfPCell(new Phrase(don.getNgo().getNomNGO()));
                ngoDonation.setPaddingLeft(1);
                ngoDonation.setVerticalAlignment(Element.ALIGN_MIDDLE);
                ngoDonation.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(ngoDonation);

                /*PdfPCell nomIngr = new PdfPCell(new Phrase(don.getSurplusAlim().getIngredient().getNomIngr()));
                nomIngr.setPaddingLeft(1);
                nomIngr.setVerticalAlignment(Element.ALIGN_MIDDLE);
                nomIngr.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(nomIngr);*/
            }
            document.add(table);
            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

}
