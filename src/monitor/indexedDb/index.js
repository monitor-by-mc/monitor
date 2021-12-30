export function initIndexedDb() {
  if (!window.indexedDB) {
    this._config.offLine = false
    return console.info(
      'your browser is not support indexedDb, offlineLog is not work'
    )
  }
  let that = this
  const monitorVersion = 1
  const indexedDbRequest = window.indexedDB.open('monitor', monitorVersion)
  this.indexedDbRequest = indexedDbRequest
  indexedDbRequest.onerror = function (error) {
    that._config.offLine = false
    return console.error(`open indexedDb fail, error: ${JSON.stringify(error)}`)
  }

  indexedDbRequest.onsuccess = function (event) {
    that.db = event.target.result
    that.db.onerror = function (dbError) {
      console.error(
        `Generic error handler for all errors targeted at this database‘s requests; error: ${JSON.stringify(
          dbError
        )}`
      )
    }
  }

  //当打开的db版本号高于之前的就会触发该函数
  indexedDbRequest.onupgradeneeded = function (event) {
    const db = event.target.result
    if (!db.objectStoreNames.contains('monitor-logs')) {
      db.createObjectStore('monitor-logs', { autoIncrement: true })
    }
  }

  // 下面对数据库的操作
  this.insertToDb = function (log) {
    const transaction = this.db.transaction('monitor-logs', 'readwrite')
    const store = transaction.objectStore('monitor-logs')
    store.add(log)
  }

  this.addLog = function (log) {
    if (!this.db) return
    this.insertToDb(log)
  }

  this.addLogs = function (logs) {
    if (!this.db) {
      return
    }
    for (var i = 0; i < logs.length; i++) {
      this.addLog(logs[i])
    }
  }

  this.getLogs = function (opt) {
    if (!this.db) return
    const transaction = this.db.transaction('monitor-logs', 'readwrite')
    const store = transaction.objectStore('monitor-logs')
    const request = store.openCursor()
    const result = []
    request.onsuccess = function (event) {
      const cursor = event.target.result
      if (cursor) {
        if (cursor.value.time > opt.start) {
          result.push(cursor.value)
        }
        //# cursor.continue
        cursor['continue']()
      }
      return result
    }

    request.onerror = function (error) {
      console.error(`getlogs error: ${JSON.stringify(error)}`)
    }
  }

  this.clearDb = function (daysToMaintain) {
    if (!daysToMaintain) {
      const transaction = this.db.transaction('monitor-logs', 'readwrite')
      const store = transaction.objectStore('monitor-logs')
      return store.clear()
    }
    const range = Date.now() - (daysToMaintain || 2) * 24 * 3600 * 1000
    const request = store.openCursor()
    request.onsuccess = function (event) {
      const cursor = event.target.result
      if (cursor && (cursor.value.time < range || !cursor.value.time)) {
        store['delete'](cursor.primaryKey)
        cursor['continue']()
      }
    }
  }
}
