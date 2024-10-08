import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Return</Text>
      <Text style={styles.paragraph}>
        Welcome to Return! Our system for character creation and attribute
        management is inspired by Dungeons & Dragons (D&D), but with some key
        differences and simplifications.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.subtitle}>Attributes:</Text>
        {"\n"}D&D uses six main attributes (Strength, Dexterity, Constitution,
        Intelligence, Wisdom, Charisma) that influence various aspects of a
        character, such as combat abilities, skills, magic, and resilience.
        {"\n"}Our system uses similar attributes but they are reduced in number
        and have simpler applications. For example, our attributes include
        Strength, Defense, Attack, Speed, Luck, Courage, which is a mix of
        physical and mental characteristics.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.subtitle}>Races and Classes:</Text>
        {"\n"}In D&D, a character's race and class have complex interactions
        where the race provides specific bonuses to attributes, and the class
        determines skills, abilities, spells, and hit points (HP). Each
        race-class combination can lead to very different characters with
        various strengths and weaknesses.
        {"\n"}In our system, race and class also provide bonuses to attributes,
        but our classes do not directly affect base attributes (e.g., magic,
        speed). Instead, the class defines the basic role and can influence
        skills and special abilities of the character in a simpler and less
        modular way than in D&D.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.subtitle}>Generating Attributes:</Text>
        {"\n"}In D&D, attributes are usually generated by rolling dice (e.g.,
        4d6 and keeping the highest three values), adding an element of
        randomness and imbalance between characters.
        {"\n"}Our system has predefined attribute values based on race and class
        choices. This ensures greater balance and predictability but also limits
        diversity.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.subtitle}>Leveling Up:</Text>
        {"\n"}In D&D, as a character levels up, they can increase their
        attributes and gain new abilities, spells, and skills. This process is
        highly detailed, allowing players to customize their characters to suit
        their play style.
        {"\n"}In our system, leveling up would also allow attributes to be
        increased and new abilities to be gained, but likely with less emphasis
        on skills and more on core attributes and simple abilities.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.subtitle}>Complexity and Flexibility:</Text>
        {"\n"}D&D is very flexible and complex, allowing players to create and
        customize their characters in various styles and stories. This
        complexity, however, can be challenging for new players.
        {"\n"}Our system is simplified to be more accessible and easier to
        implement. It offers fewer customization options but is also less
        complicated and easier to understand and manage.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.subtitle}>Equipment and Spells:</Text>
        {"\n"}In D&D, different types of equipment and spells have very specific
        and varying effects, often with complex rules on how they interact with
        each other.
        {"\n"}Our system likely simplifies equipment and spells, making their
        effects easier to manage and understand.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.subtitle}>Conclusion:</Text>
        {"\n"}Our system is simplified and tailored for quick implementation and
        easy use, while D&D is complex and offers much greater depth for
        advanced players who want to customize every aspect of their character.
        The simplifications we have made ensure that the game remains accessible
        and fun without being burdened by too much complexity.
      </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 15,
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
