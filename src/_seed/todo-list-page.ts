export const fillTodoListPage = async (strapi: Strapi.Strapi) => {
  console.log('filling todo list page...')

  let todoListPageObject = await strapi.entityService.findMany('api::todo-list-page.todo-list-page', {})

  if (!todoListPageObject) {
    todoListPageObject = await strapi.entityService.create('api::todo-list-page.todo-list-page', {
      data: {
        publishedAt: new Date().toISOString()
      }
    })
  }

  const todos = (await strapi.entityService.findMany('api::todo.todo', {
    limit: 5
  })).map(todo => todo.id)

  await strapi.entityService.update('api::todo-list-page.todo-list-page', todoListPageObject.id, {
    data: {
      title: 'The Todo List',
      todos,
      other_links: [{
        name: 'generate-dummy-data-in-strapi',
        url: 'https://strapi.io/video-library/generate-dummy-data-in-strapi',
      }],
    }
  })

  console.log('todo list page has been filled successfully!')
}

