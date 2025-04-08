package tn.esprit.services;

import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tn.esprit.entities.Plat;
import tn.esprit.repositories.IPlatRepository;
import tn.esprit.Interfaces.IPlatService;
import java.util.List;

@Service
@Slf4j
public class PlatService implements IPlatService {

    @Autowired
    IPlatRepository iPlatRepository;

    public Plat createPlat(Plat plat) {
        return iPlatRepository.save(plat);
    }

    @Override
    public List<Plat> getAllPlats() {
        return (List<Plat>)iPlatRepository.findAll();
    }
    @Override
    public Plat getPlatById(Long id) {
        return iPlatRepository.findById(id).get();
    }
    @Override
    public Plat updatePlat(Long id, Plat updatedPlat) {
        Plat plat = iPlatRepository.findById(id).get();
        plat.setTypePlat(updatedPlat.getTypePlat());
        plat.setNomMenu(updatedPlat.getNomMenu());
        plat.setImagePlat(updatedPlat.getImagePlat());
        plat.setSpecificationMenu(updatedPlat.getSpecificationMenu());
        plat.setMenus(updatedPlat.getMenus());
        return iPlatRepository.save(plat);
    }
    @Override
    public void deletePlat(Long id) {
        Plat plat = iPlatRepository.findById(id).get();
        iPlatRepository.delete(plat);
    }
    private RestTemplate restTemplate = new RestTemplate();


    public Plat getPlatNutritionInformation(String nom) {
        Plat plat = iPlatRepository.findPlatByNomMenu(nom);

        // Appel à l'API pour récupérer les informations nutritionnelles du plat
        String url = "https://trackapi.nutritionix.com/v2/natural/nutrients";
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-app-id", "662b797b");
        headers.set("x-app-key", "7fcff0fc73d30a69e5721efaa5586aa7");
        headers.set("Content-Type", "application/json");
        HttpEntity<String> request = new HttpEntity<>("{\"query\":\"" + plat.getNomMenu() + "\"}", headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Extraction des informations nutritionnelles de la réponse de l'API
        String responseBody = response.getBody();
        JSONObject jsonObject = new JSONObject(responseBody);
        JSONArray foods = jsonObject.getJSONArray("foods");
        JSONObject food = foods.getJSONObject(0);
        int calories = food.getInt("nf_calories");
        int protein = food.getInt("nf_protein");
        int fat = food.getInt("nf_total_fat");
        int carbohydrates = food.getInt("nf_total_carbohydrate");

        // Mise à jour du plat avec les informations nutritionnelles récupérées
        plat.setCalories(calories);
        plat.setProtein(protein);
        plat.setFat(fat);
        plat.setCarbohydrates(carbohydrates);
        iPlatRepository.save(plat);


        return plat;
    }



}


