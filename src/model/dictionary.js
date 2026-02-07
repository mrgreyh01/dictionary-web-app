export class Dictionary {

  constructor(word, phonetic, audio, meanings, source) {
    this.word = word;
    this.phonetic = phonetic;
    this.audio = audio;
    this.meanings = meanings;
    this.source = source;
  }

  static fromJSON(apiData) {
    // Check if apiData is valid and is an array
    if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
      return null;
    }

    // The API returns an array, so we'll work with the first element
    const data = apiData[0];

    // --- 1. Get Word ---
    let word = data.word || "";

    // --- 2. Get Phonetic and Audio (as you requested) ---
    let phonetic = "";
    let audio = "";

    // Check if data.phonetics exists and is an array
    if (data.phonetics && Array.isArray(data.phonetics)) {
      // Find the *first* phonetic object that has BOTH text and audio
      const phoneticEntry = data.phonetics.find(p => p.text && p.audio);

      if (phoneticEntry) {
        // If we found one, assign its values
        phonetic = phoneticEntry.text;
        audio = phoneticEntry.audio;
      } else {
        // Fallback: try to find *any* text, even without audio
        const anyPhoneticText = data.phonetics.find(p => p.text);
        phonetic = anyPhoneticText ? anyPhoneticText.text : (apiData.phonetic || ""); // Use root phonetic as last resort
      }
      // If no entry is found, phonetic and audio will remain "" (empty string)
    }

    // --- 3. Get Meanings ---
    // This will assign the entire meanings array (or an empty one)
    let meanings = data.meanings || [];

    // --- 4. Get Source ---
    let source = data.sourceUrls || "";

    // --- 5. Create and return the new instance ---
    // Note: Corrected to return 'new Dictinory' instead of 'new User'
    return new Dictionary(word, phonetic, audio, meanings, source);
  }

  /**
   * Note: This toJSON method seems unrelated to the Dictionary class.
   * It looks like it was from a 'User' class.
   * You might want to update it to return this class's data, for example:
   *
   * toJSON() {
   * return {
   * word: this.word,
   * phonetic: this.phonetic,
   * audio: this.audio,
   * meanings: this.meanings
   * };
   * }
   */
  toJSON() {
    return {
      user_id: this.id,
      full_name_for_api: this.name,
      status: this.isActive ? 'active' : 'inactive',
    };
  }
}