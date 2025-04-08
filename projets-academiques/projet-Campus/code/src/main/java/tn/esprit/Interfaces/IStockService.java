package tn.esprit.Interfaces;

import org.springframework.data.domain.Page;
import tn.esprit.entities.Stock;

import java.util.List;

public interface IStockService {
    Stock ajouterStock(Stock st, int fournId);

    List<Stock> ListStocks();

    void supprimerStock(Integer idStock);

    void updateStock(Stock ng, Integer idStock);

    void assignSurplusToStock(int surplusId, int stockId);

    Stock getStockById(Integer idStock);

    List<Stock> findStockWithSorting(String field);

    Page<Stock> findStockWithPagination(int offset, int pageSize);

    Page<Stock> findStockWithPaginationAndSorting(int offset, int pageSize, String field);

    //Stock ajouterStock(Stock stock);
}
