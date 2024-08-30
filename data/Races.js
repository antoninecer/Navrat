class Race {
  constructor(name, traits, attributeModifiers) {
    this.name = name;
    this.traits = traits; // Pole vlastností, např. Darkvision
    this.attributeModifiers = attributeModifiers; // Objekt obsahující modifikátory atributů
  }
}

// Definice ras v souladu s tvými požadavky
export const Races = {
  Human: new Race("Human", ["Versatile"], {
    strength: 9, // Base Attack = 9
    attack: 2,
    defense: 4, // Base Defense = 4
    speed: 8, // Base Speed = 8
    luck: 2, // Mírný bonus k štěstí
    courage: 5, // Mírný bonus ke kuráži
    magic: 1, // Základní magie
  }),
  Orc: new Race("Orc", ["Savage Attacks", "Menacing"], {
    strength: 14, // Velká síla
    defense: 10, // Vysoká obrana
    attack: 5,
    speed: 6, // Pomalejší pohyb
    luck: 1,
    courage: 8, // Velká kuráž
    magic: 0, // Žádná magie
  }),
  Elf: new Race("Elf", ["Darkvision", "Keen Senses"], {
    strength: 8, // Nižší síla než u lidí
    defense: 5, // Vyšší obrana než u lidí
    attack: 2,
    speed: 10, // Rychlejší než lidé a trpaslíci
    luck: 3, // Vyšší štěstí
    courage: 6, // Odvážní, ale méně než orci
    magic: 10, // Silná magie
  }),
  Dwarf: new Race("Dwarf", ["Darkvision", "Resilience"], {
    strength: 12, // Silnější než lidé, ale slabší než orci
    defense: 12, // Vysoká obrana
    attack: 3,
    speed: 7, // Pomalejší než elfové
    luck: 2, // Základní štěstí
    courage: 7, // Odvážní a houževnatí
    magic: 2, // Základní znalosti magie
  }),
};

export default Race;
