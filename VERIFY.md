# Verification notes

## Implemented
- English Grade 1 anchors including `hello` and punctuation.
- Hindi consonant and vowel base mappings, including क and म anchors.
- Tamil basic vowel and consonant mappings.
- Unsupported characters become a visible `?` Braille cell and are reported in `skipped`.

## Needs official-standard review
- Devanagari matras, halant, conjuncts, and dependent vowel signs are intentionally not mapped because they need review against the official Bharati Braille standard.
- Tamil uyirmei combinations and punctuation beyond the basic set are intentionally unsupported.
- Hindi/Tamil speech voices, vibration timing, and multi-touch chording need a real Android phone check.

## Honest limitation
A phone exposes one vibration motor. The app demonstrates the software encoding and interaction layer for a future six-motor wearable; it is not a wearable substitute and has not yet been validated with DeafBlind users.
