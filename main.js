

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
                var $li = $("<li>").text(`${item.Name} - ${item.Symbol}`).addClass("searchResult").attr("id", `${item.Symbol}-${item.Name}`);
                return $li;
            });
            $("#searchList").append(toAppend);

    },

    clickSearchResult : function () {

        $("#searchResultsDiv").on("click", "li", function () {
            var stockSymbol = $(this).attr("id").split("-")[0];
            var data = operations.stockQuoteLookUp(stockSymbol);
        })

    },

    saveSearchResult : function () {
        $("#searchResultsDiv").on("dblclick", "li", function () {
            var stockName = $(this).attr("id");
            var currentlyStoredStocks = operations.getStoredStocks();
            if (currentlyStoredStocks.includes(stockName) !== true) {
                currentlyStoredStocks.push(stockName);
                operations.writeStocksLocal(currentlyStoredStocks);
                $("#storedStocks").empty();
                operations.renderStoredList();

            }
        })

    },

   /* toLocalStorage : function (itemToStorage) {
        var stockSymbol = $(itemToStorage).attr("id");
        var dataToStore = operations.stockQuoteLookUp(stockSymbol);
        var storedStocksArray = operations.getStoredStocks();
        console.log(dataToStore);

    },*/

    stockQuoteLookUp : function (stockName) {
        var stockSymbol = stockName.split("-")[0];
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
        $("#storedStocks").empty();
        var stockSymbolsArray = operations.getStoredStocks();
        var toAppend = stockSymbolsArray.map(function (item) {
           var $li = $("<li>").text(item);
            return $li;
        });
        $("#storedStocks").append(toAppend);

    },

    clickSavedStock : function () {

        $("#storedStocks").on("click", "li", function () {
            var stockSymbol = $(this).text().split("-")[0];
            operations.stockQuoteLookUp(stockSymbol);
        });
    },

    deleteSavedStock : function () {
        $("#storedStocks").on("dblclick", "li", function () {
            $("#removeContactModal").modal("show");
            $("#deleteContactName").text($(this).text());

        })
    },

    confirmDeleteStock : function () {
        $("#deleteContact").click(function () {
            var stockName = $("#deleteContactName").text();
            var stocksInLocal = operations.getStoredStocks();
            var toUpdate = stocksInLocal.map(function (item) {
                if (stockName !== item) {
                    return item;
                }
            }).filter(function(item) {
                return (item);
            });
            operations.writeStocksLocal(toUpdate);
            $("#removeContactModal").modal("hide");
            $("#storedStocks").empty();
            var toAppend = toUpdate.map(function (item) {
                var $li = $("<li>").text(item);
                return $li;
            });
            $("#storedStocks").append(toAppend);
        });
    }
};

function initialize () {

    operations.stockSearchClick();
    operations.clickSearchResult();
    operations.saveSearchResult();
    operations.renderStoredList();
    operations.clickSavedStock();
    operations.deleteSavedStock();
    operations.confirmDeleteStock();

};

$(document).ready(initialize);