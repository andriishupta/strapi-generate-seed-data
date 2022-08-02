import { faker } from '@faker-js/faker'
import { randomBoolean, uploadFile } from './helpers'
import { join } from 'path'

export const generateTodoData = async (strapi: Strapi.Strapi) => {
  console.log('generating todos')

  const { DEV_SEED_DATA_TODOS } = process.env
  const todosSize = DEV_SEED_DATA_TODOS ? parseInt(DEV_SEED_DATA_TODOS) : 5

  const uploadedTodoMedia = await uploadFile(strapi, {
    data: {
      refId: Date.now().toString(),
      ref: 'api::todo.todo',
      field: 'image',
    },
    file: {
      path: join(__dirname, '../../../public/todo.jpeg'),
      name: 'todo.jpeg',
      type: 'image/jpeg'
    },
  })

  const bulkTodoPromises = []
  const randomTodosData = new Array(todosSize).fill(null).map(_randomTodo)

  for (const randomTodoData of randomTodosData) {
    const randomTodoPromise = strapi.entityService.create('api::todo.todo', {
      data: {
        ...randomTodoData,
        image: uploadedTodoMedia.id
      }
    })
    bulkTodoPromises.push(randomTodoPromise)
  }

  await Promise.all(bulkTodoPromises)
}

const _randomTodo = () => {
  return {
    title: faker.company.bsBuzz(),
    description: faker.lorem.paragraph(5),
    finished: randomBoolean(),
    publishedAt: randomBoolean() ? new Date().toISOString() : null
  }
}
