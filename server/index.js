const { send, createError } = require('micro')
const { router, get } = require('microrouter')
const fs = require('fs')
const util = require('util')
const path = require('path')
const logging = require('./src/lib/logging.js')
const handler = require('serve-handler')
const cors = require('micro-cors')()

const readDirP = util.promisify(fs.readdir)
const lstatP = util.promisify(fs.lstat)

const indexRoute = get(
  '/',
  cors((req, res) => {
    return send(res, 200, '/')
  }),
)

const getImageFolders = get(
  '/images',
  cors(async (req, res) => {
    logging.debug('Starting request!')

    // Not sure if the || [] is ugly?
    // Maybe concider adding check instead
    const imageFolders = await readDirP('./images').catch(error => {
      logging.error(error)
      return createError(500, 'Internal Server Error')
    })

    const imageFolderNames = await imageFolders.reduce(async (accP, curr) => {
      const acc = await accP
      const fileStat = await lstatP(path.join(__dirname + `/images/${curr}`))
      if (fileStat.isDirectory()) {
        return [...acc, curr]
      } else {
        logging.warning(
          `Found path that was not a folder, consider moving this. File > ${curr}`,
        )
        return acc
      }
    }, Promise.resolve([]))

    // Cannot chain on reduce since its async
    const payload = imageFolderNames.map(folderName => ({
      path: `/images/${folderName}`,
      name: folderName,
    }))
    return send(res, 200, { body: payload })
  }),
)

const getImage = get(
  '/images/:folderName/:image',
  cors(async (req, res) => {
    const { folderName = '', image = '' } = req.params
    if (!folderName || !image) {
      logging.error('foldername or image was not specified.')
      return send(res, 400, {
        body: 'Must include `foldername` and `image` in request.',
      })
    }

    const folderStat = await lstatP(
      path.join(__dirname + `/images/${folderName}`),
    ).catch(error => {
      logging.warning(`${folderName} was not a folder`)
      return false
    })

    if (!folderStat || !folderStat.isDirectory()) {
      return send(res, 400, { body: `${folderName} was not a folder` })
    }

    const imageStat = await lstatP(
      path.join(__dirname + `/images/${folderName}/${image}`),
    ).catch(error => {
      logging.warning(`No such file ${image}`)
      return false
    })

    if (!imageStat) {
      return send(res, 400, { body: `No such file ${image}` })
    }

    // If everything went ok, serve image
    return handler(req, res)
  }),
)

const getImages = get(
  '/images/:folderName',
  cors(async (req, res) => {
    const { folderName } = req.params
    const folderReadResult = await readDirP(
      path.join(__dirname + `/images/${folderName}`),
    ).catch(error => {
      logging.error(error)
      return {
        ok: false,
        message: 'Error while trying to read folder',
        raw: error,
      }
    })

    if (
      folderReadResult.hasOwnProperty('ok') &&
      folderReadResult.ok === false
    ) {
      logging.warning(
        `Could not read folder > ${folderName} <, maybe it does not exists inside the images folder?`,
      )
      return send(res, 400, { body: folderReadResult.message })
    }

    const payload = folderReadResult.map(
      image => encodeURI(`/images/${folderName}/${image}`),
    )
    return send(res, 200, { body: payload })
  }),
)

module.exports = router(indexRoute, getImageFolders, getImage, getImages)
