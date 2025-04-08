package tn.esprit.controllers;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.APIResponse;
import tn.esprit.entities.NGO;
import tn.esprit.entities.Stock;
import tn.esprit.services.NGOServiceImpl;
import tn.esprit.services.StockServiceImpl;

import java.util.List;

@RestController
@AllArgsConstructor
public class StockController {
    @Autowired
    StockServiceImpl stockService;

    @PostMapping("/addStock/{idFourn}")
    @ResponseBody
    public Stock addStock(@RequestBody Stock r,@PathVariable("idFourn") Integer idFourn )
    {

        return  stockService.ajouterStock(r,idFourn);

    }

    @GetMapping("/listStock")
    @ResponseBody
    public List<Stock> listStocks(){

        return stockService.ListStocks();
    }

    @DeleteMapping("/deleteStock/{idStock}")
    @ResponseBody
    public void deleteNGO(@PathVariable("idStock") Integer idStock){

        stockService.supprimerStock(idStock);
    }

    @PutMapping("/modifierStock/{idStock}")
    @ResponseBody
    public void modifierStock(@RequestBody Stock r,@PathVariable("idStock") Integer idStock){
        stockService.updateStock(r,idStock);
    }

    @PostMapping("/assignSurplusToStock")
    public void assignSurplusToStock (int surplusId, int stockId) {
        stockService.assignSurplusToStock(surplusId,stockId);
    }

    @GetMapping("/getStock/{idStock}")
    @ResponseBody
    public Stock getStockByiD(@PathVariable("idStock") Integer idStock){

        return stockService.getStockById(idStock);
    }

    @GetMapping()
    @ResponseBody
    private APIResponse<List<Stock>> getStock() {
        List<Stock> allProducts = stockService.ListStocks();
        return new APIResponse<>(allProducts.size(), allProducts);
    }
    @GetMapping("/pagination/{offset}/{pageSize}")
    @ResponseBody
    private APIResponse<Page<Stock>> getStockWithPagination(@PathVariable int offset, @PathVariable int pageSize) {
        Page<Stock> stocks = stockService.findStockWithPagination(offset, pageSize);
        return new APIResponse<>(stocks.getSize(), stocks);
    }

    @GetMapping("/paginationAndSort/{offset}/{pageSize}/{field}")
    @ResponseBody
    private APIResponse<Page<Stock>> getProductsWithPaginationAndSort(@PathVariable int offset, @PathVariable int pageSize,@PathVariable String field) {
        Page<Stock> stocks = stockService.findStockWithPaginationAndSorting(offset, pageSize, field);
        return new APIResponse<>(stocks.getSize(), stocks);

    }

}