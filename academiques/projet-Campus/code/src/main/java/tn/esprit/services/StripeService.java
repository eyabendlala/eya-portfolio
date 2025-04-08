package tn.esprit.services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Token;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
    public class StripeService {

        public ResponseEntity chargeCard(double amount, long userID) {

            try {
                try {
                    Map<String, Object> params = new HashMap<>();
                    Map<String, Object> tokenParams = new HashMap<>();
                    Map<String, Object> cardParams = new HashMap<>();

                    cardParams.put("number", "4242424242424242");
                    cardParams.put("exp_month", 12);
                    cardParams.put("exp_year", 2025);
                    cardParams.put("cvc", "123");

                    tokenParams.put("card", cardParams);
                    Token token = Token.create(tokenParams);

                    if (token.getId()!=null){
                        params.put("amount",(int)amount);
                        params.put("description", "payement ");
                        params.put("currency", "eur");
                        params.put("source", token.getId());
                        Charge.create(params);


                    }

                    return ResponseEntity.ok("Payment successful");

                } catch (StripeException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing payment: " + e.getMessage());

                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing payment: " + e.getMessage());
            }

        }
    }




