const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};


getEmployeeNames = function(){
    return new Promise(function(resolve, reject){
        const mysql = require('mysql');
        mysql.createConnection(config).query(
          "SELECT * FROM people", 
          function(err, rows){                                                
              if(rows === undefined){
                  reject(new Error("Error rows s undefined"));
              }else{
                  resolve(rows);
              }
          }
      )}
  )}

getEmployeeNames()
.then(function(results){
  render(results)
})
.catch(function(err){
  console.log("Promise rejection error: "+err);
})


app.get("/", (req,resp)=>{
    
        resp.setHeader('Content-type', 'text/html');
    getEmployeeNames()
    .then(function(results){
      html = "<h1>Full Cycle Rocks!</h1>"
      html += "<h2>"+results.length+" pessoas cadastradas na bd</h2>"
      html += "<ul>"
      for (var i in results) html += "<li> <b>Id:</b>" + results[i].id + " <b>Name:</b>" +results[i].name + "</li>";
      html += "</ul>"
      resp.end(html);
    })
    .catch(function(err){
      console.log("Promise rejection error: "+err);
      resp.end("<h1>ERROR" + err + "</h1>")
    })

})


app.listen(port, ()=>{
    console.log("Rodando na porta " + port)
})