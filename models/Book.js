// models/Book.js
class Book {
  constructor() {
    this.entries = [];
  }
  addEntry(entry) {
    this.entries.push(entry);
  }
  getEntries() {
    return this.entries;
  }
}
export default Book;
