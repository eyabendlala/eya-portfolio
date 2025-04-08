package tn.esprit.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.Interfaces.IStockService;
import tn.esprit.entities.Fournisseur;
import tn.esprit.entities.Stock;
import tn.esprit.entities.SurplusAlim;
import tn.esprit.repositories.FournisseurRepository;
import tn.esprit.repositories.StockRepository;
import tn.esprit.repositories.SurplusRepository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class StockServiceImpl implements IStockService {
    SurplusRepository surplusRepository;
    StockRepository stockRepo;
    FournisseurRepository fournRepo;

    @Override
    public Stock ajouterStock(Stock st, int fournId) {
        Fournisseur fourn = fournRepo.findById(fournId).orElse(null);
        Date date = new Date(System.currentTimeMillis());
        st.setDateAjoutIngr(date);
        st.setFournisseur(fourn);
        st.setQttSurplus(7);
        return stockRepo.save(st);
    }



    @Override
    public List<Stock> ListStocks(){
        return stockRepo.findAll();
    }

    @Override
    public void supprimerStock(Integer idStock) {
        Stock r = stockRepo.findById(idStock).orElse(null);

        stockRepo.delete(r);
    }

    @Override
    public void updateStock(Stock ng, Integer idStock) {

        Stock rec= stockRepo.findById(idStock).orElse(null);

        rec.setIdIngr(ng.getIdIngr());
        rec.setCodeIngr(ng.getCodeIngr());
        rec.setDateAjoutIngr(ng.getDateAjoutIngr());
        rec.setDateExpiration(ng.getDateExpiration());
        rec.setNomIngr(ng.getNomIngr());
        rec.setPrixUnitaireIngr(ng.getPrixUnitaireIngr());
        rec.setQttIngr(ng.getQttIngr());
        rec.setUniteIngr(ng.getUniteIngr());
        stockRepo.save(rec);

    }


    @Override
    public void assignSurplusToStock(int surplusId, int stockId) {
        SurplusAlim surplus = surplusRepository.findById(surplusId).orElse(null);
        Stock stockk = stockRepo.findById(stockId).orElse(null);
        stockk.setSurplusIngr(surplus);
        stockRepo.save(stockk);
        //userRepository.save(developer);
    }

    @Override
    public Stock getStockById(Integer idStock) {
        return stockRepo.getById(idStock);
    }

    /*@Scheduled(fixedDelay = 86400000) // exécuté une fois par jour
    public void decrementExpiredStock() {
        LocalDate today = LocalDate.now();

        List<Stock> expiredStock = stockRepo.findByDateExpirationLessThan(today);

        expiredStock.forEach(stock -> stock.setQttIngr(stock.getQttIngr() - 1));

        stockRepo.saveAll(expiredStock);
    }*/


        /*@Transactional
        public void updateExpiredStock() {
            LocalDate currentDate = LocalDate.now();
            List<Stock> expiredItems = stockRepo.findByDateExpirationLessThan(currentDate);

            for (Stock item : expiredItems) {
                float currentQuantity = item.getQttIngr();
                float newQuantity = currentQuantity > 0 ? currentQuantity - 1 : 0;
                item.setQttIngr(newQuantity);
            }

            stockRepo.saveAll(expiredItems);
        }*/



    @Override
    public List<Stock> findStockWithSorting(String field) {
        return  stockRepo.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.ASC,field));

    }

    @Override
    public Page<Stock> findStockWithPagination(int offset, int pageSize) {
        Page<Stock> posts = stockRepo.findAll(PageRequest.of(offset, pageSize));
        return  posts;
    }

    @Override
    public Page<Stock> findStockWithPaginationAndSorting(int offset, int pageSize, String field) {
        Page<Stock> posts = stockRepo.findAll(PageRequest.of(offset, pageSize).withSort(org.springframework.data.domain.Sort.by(field)));
        return  posts;
    }



}
