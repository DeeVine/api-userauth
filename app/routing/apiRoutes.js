// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var tableData = require("../data/tableData");
var waitListData = require("../data/waitinglistData");
var axios = require('axios');


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/tables", function(req, res) {
    res.json(tableData);
  });

  app.get("/api/waitlist", function(req, res) {
    res.json(waitListData);
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/tables", function(req, res) {
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table
    if (tableData.length < 5) {
      tableData.push(req.body);
      res.json(true);
    }
    else {
      waitListData.push(req.body);
      res.json(false);
    }
  });

  let getArticles = function (object) {
    axios({
	      url:'https://api.nytimes.com/svc/search/v2/articlesearch.json',
	      params:{ 'api-key': "7ca74794a0a64d579de04b287793ce32",
	            'q': object.topic,
	            'begin_date': object.startDate,
	            'end_date': object.endDate}
	    })
	      .then(function(response) {
	      // console.log(response);
	      console.log(response.data.response.docs);
        return response.data.response.docs;
	    });
  }

  app.post("/api/nyt", function(req, res) {
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table

    function getSome (object) {
      axios({
  	      url:'https://api.nytimes.com/svc/search/v2/articlesearch.json',
  	      params:{ 'api-key': "7ca74794a0a64d579de04b287793ce32",
  	            'q': object.topic,
  	            'begin_date': object.startDate,
  	            'end_date': object.endDate}
  	    })
  	      .then(function(response) {
  	      // console.log(response);
          // res.json(true);
  	      res.json(response.data.response.docs);
  	    });
    }

    getSome(req.body);


    // console.log(req.body);
    // console.log(getArticles(req.body));
    // getArticles(req.body);
    //
    // res.json(true);
    // if (tableData.length < 5) {
    //   tableData.push(req.body);
    //   res.json(true);
    // }
    // else {
    //   waitListData.push(req.body);
    //   res.json(false);
    // }
  });


  // ---------------------------------------------------------------------------
  // I added this below code so you could clear out the table while working with the functionality.
  // Don"t worry about it!

  app.post("/api/clear", function() {
    // Empty out the arrays of data
    tableData = [];
    waitListData = [];

    console.log(tableData);
  });
};
