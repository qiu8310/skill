export abstract class Mobx {
  abstract serializableKeys: string[]

  fromJSON(json) {
    if (!json || typeof json !== 'object') return
    this.serializableKeys.forEach(k => {
      if (json.hasOwnProperty(k)) {
        let value = json[k]
        if (this[k] && typeof this[k].fromJSON === 'function') {
          this[k].fromJSON(value)
        } else {
          this[k] = value
        }
      }
    })
  }

  toJSON() {
    return this.serializableKeys.reduce((json, k) => {
      let value = this[k]
      if (value && typeof value.toJSON === 'function') value = value.toJSON()
      json[k] = value
      return json
    }, {})
  }
}
