import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import { createTodo } from '../../businessLogic/todos'
import { todoBuilder } from '../../helpers/todos'
import { createTodo } from '../../helpers/todosAcess'
import { TodoItem } from '../../models/TodoItem'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const newTodo: CreateTodoRequest = JSON.parse(event.body)
        console.log(newTodo)
        // TODO: Implement creating a new TODO item
        const todo = todoBuilder(newTodo, event)
        const newItem: TodoItem = await createTodo(todo)
      
        return {
            statusCode: 201,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
              "item": newItem
            })
          }
    }
)

handler.use(
    cors({
        credentials: true
    })
)
