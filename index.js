const express = require('express') /*para importar a biblioteca para ter acesso ao express dentro da aplicação */
const uuid = require('uuid') /*tem que importar a biblioteca uuid para gerar ids unicos para cada usuario criado */
const bodyParser = require('body-parser')
const port = 3000 /*Variavel criada para identificar o número da porta no app.listen */

const app = express() /*para facilitar coloca o app ou server, toda vida que querer usar express coloca app. ou server. */
/*para criar uma rota app.get para enviar as informações para a tela do navegador, o primeiro parametro '/users' e o segundo é uma função
request, response padrões do express e tem que retornar o send para poder retronar por exemplo um texto*/
app.use(bodyParser.json())

const users = []  /*nunca use uma variavel para guardar dados, tem que ser guardado em um banco de dados
 */

const checkUserId = (request, response, next) => {   //no caso essa função vai checar o id do usuario, é um medleware , ela precisa de request,ponse e o next
    const { id } = request.params

    const index = users. findIndex(user => user.id === id) //fui la na rota e peguei os parametros

    if (index < 0) {
        return response.status(404).json({ Error: "User not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}


app.get('/users', (request, response) => {
    return response.json(users)     //rota para mostrar os usuarios salvos
})

/*rota do tipo post serve para add informações */
app.post('/users', (request, response) => {
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(user)

})


app.put('/users/:id', checkUserId, (request, response) => {
    // const { id } = request.params  //*recortado para o checUserId - para atualizar um usuario precisamos pegar o id,   manda o id no insominia depois do users e coloca / 
    const { name, age } = request.body    // as informações do body que eu quero atualizar
    const index = request.userIndex
    const id = request.userId
    const updatedUser = { id, name, age }

    // const index = users.findIndex(user => user.id === id)// usando o midleware   //recortado para o checUserId      //find.index retorna a posição no array

    //  if (index < 0) {
    //     return response.status(404).json({ messsage: "User not found" })  //recortado para o checUserId
    // } 

    users[index] = updatedUser

    return response.json(updatedUser)     //rota para mostrar os usuarios salvos
})

app.delete('/users/:id', checkUserId, (request, response) => {   //para saber quem eu quero deletar, pegamos o id do usuario

    const index = request.userIndex // se usar o midlewares
    // const { id } = request.params  //no caso usando midlewares não precisa    // pegamos o id do request.params

    // const index = users.findIndex(user => user.id === id)   //para saber qual usuario quero deletar pego o findIndex, caso não ache o usuario faz o if abaixo

    // if (index < 0) {
    //     return response.status(404).json({ messsage: "User not found" })  // caso não encontre responde com satatus 404   não achou
    // }
    users.splice(index, 1)  //para deletar apenas um usuario no array, use o splice pegando o array: users e coloca o splice antes da virgulaé onde eu quero que delete e depois da virgula quantos usuarios deleta

    return response.status(204).json({ message: "usuario deletado" })   //para retornar um status de sucesso
})





app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})





