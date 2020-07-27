// AULA 4 NLW

/*
    Informações sobre node:
     node -v --> versão do node baixado
     npm -v --> versão do npm baixado
     node --> ent rar no node (pode executar funções javascript)
     sair do node --> .exit
     npm -> node pack manager (gerenciador de dependencias do node)
     npm init -y -> transforme a pasta em um projeto realizado em node (cria o package.json)
     npm install express -> cria a pasta node_modules(dependencias do express) e cria o package-lock.json(mapeamento das dependencias do projeto que estão no package.json)
*/
/*
    Estruturando as pastas:
     Criar uma pasta src(sources -> recebe o que tem a ver com servidor  
                         dentro de sources --> cria a pasta views e coloca os arquivos html, cria um arquivo server.js)
     Criar uma pasta public(acesso para todos os usuários) --> colocar os assets(imagens), os scripts(javascript), styles (css)   
*/

// abrir e fechar o terminal -> control + '
/*
    ao colocar o projeto no git: 
     não envia node_modules
     coloco npm install na minha pasta
*/

const express = require("express")
const server = express()

// pegar o banco de dados
const db = require("./database/db")

// configurar pasta publica
server.use(express.static("public"))

// habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true}))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views",{
    express: server,
    noCache: true // nao usa cache -> bom para sites em desenvolvimento
})
// configurar caminhos da minha aplicação
// render só é utilizado depois do nunjucks configurado
// get -> verbo http -> faz um pedido(req) e retorna com uma resposta(res)
// página inicial(home)
server.get("/", (req,res) => {
    return res.render("index.html", { title: "Um titulo"})
})





// página create-point
server.get("/create-point", (req,res) => {

    // req.query: Query Strings da nossa url
    // console.log(req.query)





    return res.render("create-point.html")
})
// post é utilizado pelo backend no formulário
server.post("/savepoint", (req,res) => {

    // req.body: o corpo do nosso formulário
    // console.log(req.body)

    // inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            adress,
            adress2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.adress,
        req.body.adress2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err){
        if (err){
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)
    
    
})






// página search-results
server.get("/search", (req,res) => {

    const search = req.query.search

    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html", { total: 0})
    }




    // pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if (err){
            return console.log(err)
        }

        console.log("Aqui estão seus registros")
        console.log(rows)
        // quantidade de tabelas
        const total = rows.length
        // mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total: total})
    })   



})

/* ligar o servidor 
    função que ouve a porta 3000
*/
server.listen(3000)
// node src/server.js 
// para testar localhost:3000
/* 
    na pasta package.json:
        alterar test para start
        criando um atalho para usar com npm -> "start": "node src/server.js"
*/
// npm start
/* npm install nodemon -D
    monitoramento de alterações no projeto e reinicia o server sozinho
    facilita para que não seja necessário reiniciar o servidor para cada mudança realizada nesse arquivo
*/
// "start": "node src/server.js" --> "start": "nodemon src/server.js"
/* npm start
    se eu digito rs ele reinicia
*/

/*  template engine -> html de uma maneira inteligente(transforma html com funções, estruturas de repetições, if-else) 
     ex: nunjucks --> n-blocks, n-set, n-extend
*/
//npm install nunjucks

