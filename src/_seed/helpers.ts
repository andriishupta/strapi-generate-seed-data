import { statSync } from 'fs'

export const randomBoolean = () => Math.random() < 0.5

const ensureSQLite = (strapi: Strapi.Strapi) => {
  console.log('verifying db as local SQLite')
  const db:  { config: { connection: { client: string } } } = strapi.db as any // from debugging

  if (db.config.connection.client !== 'sqlite') {
    throw new Error('strapi is NOT using local SQLite! Please, verify usage of SQLite before clearing data')
  }
}

export const clearData = async (strapi: Strapi.Strapi) => {
  ensureSQLite(strapi)

  const collectionTypeUids = ['api::todo.todo', 'plugin::users-permissions.user']
  const bulkClears = []

  for (const collectionTypeUid of collectionTypeUids) {
    const collectionClear = strapi.query(collectionTypeUid).deleteMany({
      where: {
        id: {
          $notNull: true,
        },
      },
    });

    bulkClears.push(collectionClear)
  }

  await Promise.all(bulkClears)
}

type UploadFile = {
  data: UploadFileData,
  file: UploadFileFile,
}

type UploadFileData = {
  ref: string
  refId: string
  field: string
}

type UploadFileFile = {
  name: string
  path: string
  type: string
}

export const uploadFile = async (strapi: Strapi.Strapi, {
  data,
  file,
}: UploadFile) => {
  const { refId, ref, field } = data
  const { name, path, type } = file

  const fileStat = statSync(path);

  const [uploadedFile] = await strapi.plugins.upload.services.upload.upload({
    data: {
      refId,
      ref,
      field
    },
    files: {
      path,
      name,
      type,
      size: fileStat.size,
    },
  });

  return uploadedFile
}
