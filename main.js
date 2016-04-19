

var operations = {



    stockSearchClick : function () {
        $(".stockSearch").click(function () {
            $("#searchList").empty();
            var searchCriteria = $("#searchStock").val();
            $.getJSON(`http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=${searchCriteria}&callback=?`)
                .done(function (data) {
                    searchResults = data;
                    operations.dataToLis(data);
                })
                .fail(function (error) {
                    console.log("Error: ", error)
                });

        })
    },

    dataToLis : function (data) {
            var toAppend = data.map(function (item) {
                var $li = $("<li>").text(`${item.Name} - ${item.Symbol}`).addClass("searchResult").attr("id", item.Symbol);
                return $li;
            });
            $("#searchList").append(toAppend);

    },

    clickSearchResult : function () {

        $("#searchResultsDiv").on("click", "li", function () {
            var stockSymbol = $(this).attr("id");
            console.log(stockSymbol)
            var data = operations.stockQuoteLookUp(stockSymbol);
        })

    },

    saveSearchResult : function () {
        $("#searchResultsDiv").on("dblclick", "li", function () {
            var symbol = $(this).attr("id");
            var currentlyStoredSymbols = operations.getStoredStocks();
            if (currentlyStoredSymbols.includes(symbol) !== true) {
                currentlyStoredSymbols.push(symbol);
                operations.writeStocksLocal(currentlyStoredSymbols);
            }
        })

    },

   /* toLocalStorage : function (itemToStorage) {
        var stockSymbol = $(itemToStorage).attr("id");
        var dataToStore = operations.stockQuoteLookUp(stockSymbol);
        var storedStocksArray = operations.getStoredStocks();
        console.log(dataToStore);

    },*/

    stockQuoteLookUp : function (stockSymbol) {
        $.getJSON(`http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${stockSymbol}&callback=?`)
            .done(function (data) {
                operations.populateStockInfo(data);
            })
            .fail(function (error) {
                console.log("Error: ", error)
            });
    },

    populateStockInfo : function (data) {
        $("#stockName").text(data.Name);
        $("#stockSymbol").text(data.Symbol);
        $("#lastPrice").text(data.LastPrice);
        $("#stockChange").text(data.Change);
        $("#stockHigh").text(data.High);
        $("#stockLow").text(data.Low);
        $("#stockOpen").text(data.Open);
    },

    getStoredStocks : function () {
        try {
            var stocks = JSON.parse(localStorage.storedStocks);
        } catch (error) {
            var stocks = [];
        }
        return stocks;
    },

    writeStocksLocal : function (arrayOfObjects) {
        localStorage.storedStocks = JSON.stringify(arrayOfObjects);
    },

    renderStoredList : function () {
        var stockSymbolsArray = operations.getStoredStocks();
        var toAppend = stockSymbolsArray.map(function (item) {
            $.getJSON(`http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${item}&callback=?`)
        })

    }



};

function initialize () {

    operations.stockSearchClick();
    operations.clickSearchResult();
    operations.saveSearchResult();
    operations.renderStoredList();

};

$(document).ready(initialize);