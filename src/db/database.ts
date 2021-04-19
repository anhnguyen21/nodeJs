import { Connection, createConnection, ConnectionManager, getConnectionManager, ConnectionOptions } from 'typeorm'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as migration from '../db/migrations'
import * as typeOrmConfig from '../../ormconfig'

const opt = {
  ...typeOrmConfig
}

export class Database {
  private connectionManager: ConnectionManager

  constructor() {
    // Nhận được Trình quản lý kết nối tạo kết nối.
    this.connectionManager = getConnectionManager()
  }

  public async getConnection(connectionName = 'default'): Promise<Connection> {
    let connection: Connection
    if (this.connectionManager.has(connectionName)) {
      connection = this.connectionManager.get(connectionName)
      if (!connection.isConnected) {
        // Thực hiện kết nối với cơ sở dữ liệu.
        // Phương thức này nên được gọi một lần trên Application bootstrap.
        // Phương pháp này không nhất thiết phải tạo kết nối cơ sở dữ liệu (phụ thuộc vào loại cơ sở dữ liệu),
        // nhưng nó cũng có thể thiết lập một nhóm kết nối với cơ sở dữ liệu để sử dụng.
        connection = await connection.connect()
      }
    } else {
      //tạo mới connecttion
      connection = await createConnection(opt as ConnectionOptions)
    }

    return connection
  }
}
