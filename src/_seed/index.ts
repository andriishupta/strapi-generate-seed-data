import {seedUserExists, createSeedUser } from './user'
import { clearData } from './helpers';
import { generateTodoData } from './todo';
import { fillTodoListPage } from './todo-list-page';

export const generateSeedData = async (strapi: Strapi.Strapi) => {
  const dataExists = await seedUserExists(strapi)
  const forceBootstrap = process.env.FORCE_APP_BOOTSTRAP_ONLY === 'true'

  const skipGeneration = dataExists && !forceBootstrap

  if (skipGeneration) {
    console.log('skipping seed data generation...')
    return
  }

  if (forceBootstrap) {
    console.log('forcing seed data re-creation...')
    await clearData(strapi)
    console.log('existing data has been cleaned!')
  }

  console.log('generating seed data...')

  await Promise.all([
    generateTodoData(strapi),
    createSeedUser(strapi),
  ]).catch(e => {
    console.error('error during generating seed data! Stopping the application...')
    throw new Error(e)
  })

  // Pages
  await Promise.all([
    fillTodoListPage(strapi),
  ]).catch(e => {
    console.error('error during generating page data! Stopping the application...')
    throw new Error(e)
  })

  console.log('generating seed data has been finished successfully!')
}
