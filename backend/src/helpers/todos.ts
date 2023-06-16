// import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
// import { TodoItem } from '../models/TodoItem'
import { getUserId } from '../lambda/utils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { TodoItem } from '../models/TodoItem'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
export function todoBuilder(todoRequest: CreateTodoRequest, event: APIGatewayProxyEvent): TodoItem {
    const todoId = uuid.v4()
    const todo = {
        todoId: todoId,
        userId: getUserId(event),
        createdAt: new Date().toISOString(),
        name: todoRequest.name,
        dueDate: todoRequest.dueDate,
        done: false,
        attachmentUrl: ''
    }
    return todo as TodoItem
}
