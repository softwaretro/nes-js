/**
 * Generic 8bit-word Memory.
 * TODO: consider to make parameter simpler.
 */
function GenericMemory(param) {
  if(param instanceof ArrayBuffer) {
    this.buffer = param;
    this.uint8 = new Uint8Array(this.buffer);
    this.capacity = this.uint8.byteLength;
  } else {
    this.capacity = param;
    this.buffer = new ArrayBuffer(this.capacity);
    this.uint8 = new Uint8Array(this.buffer);
  }
  this._init();
}

Object.assign(GenericMemory.prototype, {
  isGenericMemory: true,

  _WORD_SIZE: 1, // 1 byte

  /**
   *
   */
  _init: function() {
    for(var i = 0; i < this.capacity; i++)
      this.store(i, 0);
  },

  /**
   *
   */
  getCapacity: function() {
    return this.capacity;
  },

  /**
   *
   */
  load: function(address) {
    return this.uint8[address];
  },

  /**
   *
   */
  loadWithoutMapping: function(address) {
    return this.uint8[address];
  },

  /**
   *
   */
  store: function(address, value) {
    this.uint8[address] = value;
  },

  /**
   *
   */
  storeWithoutMapping: function(address, value) {
    this.uint8[address] = value;
  },

  /**
   *
   */
  dump: function() {
    var buffer = '';
    var previousIsZeroLine = false;
    var offset = this._getStartDumpAddress();
    var end = this._getEndDumpAddress();
    for(var i = offset; i < end; i++) {
      if(i % 0x10 === 0) {
        if(previousIsZeroLine) {
          var skipZero = false;
          while(this._checkNext16BytesIsZero(i+0x10)) {
            i += 0x10;
            skipZero = true;
          }
          if(skipZero)
            buffer += '...\n';
        }
        buffer += __10to16(i-offset, 4) + ' ';
        previousIsZeroLine = true;
      }

      var value = this._loadForDump(i);
      buffer += __10to16(value, 2, true) + ' ';
      if(value != 0)
        previousIsZeroLine = false;

      if(i % 0x10 === 0xf)
        buffer += '\n';
    }
    return buffer;
  },

  /**
   *
   */
  _loadForDump: function(address) {
    return this.loadWithoutMapping(address);
  },

  /**
   *
   */
  _getStartDumpAddress: function() {
    return 0;
  },

  /**
   *
   */
  _getEndDumpAddress: function() {
    return this.capacity;
  },

  /**
   *
   */
  _checkNext16BytesIsZero: function(offset) {
    if(offset + 0x10 >= this._getEndDumpAddress())
      return false;

    var sum = 0;
    for(var i = offset; i < offset + 0x10; i++) {
      sum += this._loadForDump(i);
    }
    return sum === 0;
  }
});