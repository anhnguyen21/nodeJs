import SecretsManager from 'aws-sdk/clients/secretsmanager'
import { config } from '../../config'
const region = config.api.region
const client = new SecretsManager({ region })

export const getSecret = async <T>(secretName: string): Promise<T> =>
  new Promise((resolve, reject) => {
    client.getSecretValue({ SecretId: secretName }, function (err, data) {
      if (err) {
        console.error(err)
        reject('Unable to fetch config')
      } else {
        let decodedBinarySecret: T
        if (data.SecretString != null) {
          decodedBinarySecret = JSON.parse(data.SecretString)
        } else {
          const buff = new Buffer(data.SecretBinary as string, 'base64')
          decodedBinarySecret = (buff.toString('ascii') as unknown) as T
        }
        resolve(decodedBinarySecret)
      }
    })
  })
