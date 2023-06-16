import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
// import { TodoItem } from '../models/TodoItem'
// // import { TodoUpdate } from '../models/TodoUpdate';

import { TodoItem } from "../models/TodoItem"
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')
const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = createDynamoDBClient()


// // TODO: Implement the dataLayer logic
export async function createTodo(todo: TodoItem): Promise<TodoItem> {
  await docClient.put({
    TableName: todosTable,
    Item: todo
  }).promise()

  return todo
}

export async function getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
  const result = await docClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()
  console.log("Cuong log " + JSON.stringify(result.Items))
  return result.Items as TodoItem[]

}

export async function getTodoById(todoId: string): Promise<TodoItem> {
  const result = await docClient.query({
    TableName: todosTable,
    IndexName: index,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
      ':todoId': todoId
    }
  }).promise()
  console.log("taolog " + JSON.stringify(result.Items))
  if (result.Items.length !== 0) return result.Items[0] as TodoItem
  return null
}

export async function updateAttachmentTodo(todoId: string, userId: string, attachmentUrl: string ): Promise<TodoItem> {
  const result = await docClient.update({
    TableName: todosTable,
    Key: {
      todoId: todoId,
      userId: userId
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl
    }
  }).promise()
  return result.Attributes as TodoItem
}

export async function updateTodo(todoId: string, userId: string, model: TodoUpdate): Promise<TodoItem> {
  console.log('Update todo');

  const params = {
    TableName: this.todosTable,
    Key: {
      todoId: todoId,
      userId: userId
    },
    UpdateExpression: "set #todoName = :todoName, dueDate = :dueDate, done = :done",
    ExpressionAttributeNames: { '#todoName': "name" },
    ExpressionAttributeValues: {
      ":todoName": model.name,
      ":dueDate": model.dueDate,
      ":done": model.done
    },
    ReturnValues: "ALL_NEW"
  };

  const result = await docClient.update(params).promise();

  return result.Attributes as TodoItem;
}

export async function deleteTodo(todoId: string, userId: string): Promise<any> {
  console.log("Cuong delete");
  const params = {
    TableName: todosTable,
    Key: {
      todoId: todoId,
      userId: userId
    },
  }
  return await docClient.delete(params).promise();
}


function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}