// models/CharacterInventory.js
class CharacterInventory {
  constructor() {
    this.head = null; // Slot for helmet
    this.neck = null; // Slot for amulet
    this.body = null; // Slot for armor
    this.hands = [null, null]; // Two slots for weapons or shields (left hand, right hand)
    this.legs = null; // Slot for pants
    this.feet = null; // Slot for boots
    this.fingers = Array(10).fill(null); // Ten slots for rings (up to two can be active)
    this.items = []; // Slot for other items not equipped
  }
  // Metoda pro přidání předmětu do správného slotu
  equipItem(item) {
    switch (item.slot) {
      case "head":
        this.head = item;
        break;
      case "neck":
        this.neck = item;
        break;
      case "body":
        this.body = item;
        break;
      case "legs":
        this.legs = item;
        break;
      case "feet":
        this.feet = item;
        break;
      case "leftHand":
        this.hands[0] = item;
        break;
      case "rightHand":
        this.hands[1] = item;
        break;
      case "ring":
        const emptyFinger = this.fingers.indexOf(null);
        if (emptyFinger !== -1) {
          this.fingers[emptyFinger] = item;
        }
        break;
      default:
        console.log("Unknown slot or item type");
    }
  }
  // Metoda pro odstranění předmětu ze slotu
  unequipItem(slot, index = null) {
    if (index !== null) {
      this[slot][index] = null;
    } else {
      this[slot] = null;
    }
  }
  // Metoda pro inicializaci inventáře z existujícího objektu (např. z databáze)
  static fromObject(obj) {
    const inventory = new CharacterInventory();
    inventory.head = obj.head || null;
    inventory.neck = obj.neck || null;
    inventory.body = obj.body || null;
    inventory.hands = obj.hands || [null, null];
    inventory.legs = obj.legs || null;
    inventory.feet = obj.feet || null;
    inventory.fingers = obj.fingers || Array(10).fill(null);
    inventory.items = obj.items || [];
    return inventory;
  }
}
export default CharacterInventory;
