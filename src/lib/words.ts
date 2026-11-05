// Mocked PAO vocabulary: 100 Persons, 100 Actions, 100 Objects (00–99)

export const PERSONS = [
  'James Bond', 'Tesla', 'Cleopatra', 'Mozart', 'Einstein', 'Frida Kahlo', 'Napoleon', 'Elvis', 'Beyoncé', 'Bruce Lee',
  'Oprah', 'Gandhi', 'Picasso', 'Shakespeare', 'Darwin', 'Marie Curie', 'Chaplin', 'Hitchcock', 'Monroe', 'Ali',
  'Messi', 'Serena', 'Bolt', 'Jordan', 'Pelé', 'Federer', 'Tyson', 'Hawking', 'Newton', 'Galileo',
  'Da Vinci', 'Van Gogh', 'Dalí', 'Warhol', 'Bowie', 'Prince', 'Hendrix', 'Lennon', 'Dylan', 'Madonna',
  'Bach', 'Beethoven', 'Sinatra', 'Mercury', 'Cobain', 'Marley', 'M. Jackson', 'Armstrong', 'Gagarin', 'Earhart',
  'Columbus', 'Magellan', 'Amundsen', 'Hillary', 'Lincoln', 'Churchill', 'Mandela', 'M.L. King', 'Joan of Arc', 'Caesar',
  'Alexander', 'Genghis', 'Zeus', 'Thor', 'Merlin', 'Sherlock', 'Dracula', 'Batman', 'Yoda', 'Gandalf',
  'Spock', 'Hermione', 'Mario', 'Pikachu', 'Lara Croft', 'Indiana Jones', 'Neo', 'Ripley', 'Zorro', 'Robin Hood',
  'Houdini', 'Buster Keaton', 'Dolly Parton', 'Ada Lovelace', 'Turing', 'Jobs', 'Gates', 'Musk', 'Hemingway', 'Tolkien',
  'Poe', 'Austen', 'Orwell', 'Kafka', 'Julia Child', 'Ramsay', 'Bob Ross', 'Buddha', 'Confucius', 'Socrates',
]

export const ACTIONS = [
  'sprinting', 'juggling', 'whispering', 'kicking', 'hugging', 'dancing', 'climbing', 'diving', 'painting', 'singing',
  'throwing', 'spinning', 'balancing', 'flying', 'digging', 'smashing', 'stirring', 'swinging', 'tickling', 'launching',
  'sailing', 'sketching', 'carving', 'skating', 'surfing', 'pouring', 'crushing', 'hiding', 'chasing', 'building',
  'unwrapping', 'shaking', 'sweeping', 'stretching', 'licking', 'bouncing', 'blowing', 'knitting', 'drumming', 'melting',
  'splashing', 'pushing', 'pulling', 'winking', 'rowing', 'shooting', 'lifting', 'weaving', 'tossing', 'rolling',
  'freezing', 'burning', 'sewing', 'slicing', 'dropping', 'catching', 'hammering', 'sniffing', 'bowing', 'yawning',
  'waving', 'pinching', 'stomping', 'stacking', 'zipping', 'folding', 'twisting', 'marching', 'racing', 'snoring',
  'pointing', 'sliding', 'flipping', 'raking', 'inflating', 'hopping', 'planting', 'sprinkling', 'slapping', 'squeezing',
  'trapping', 'vaulting', 'whistling', 'gliding', 'scrubbing', 'tangling', 'peeling', 'clapping', 'tiptoeing', 'hurling',
  'polishing', 'bending', 'wrestling', 'gargling', 'steering', 'plucking', 'mixing', 'hatching', 'floating', 'exploding',
]

/**
 * How each action meets its object in a reading caption. `direct` means the
 * verb takes the object as-is ("pushing a jukebox"); every other value is the
 * preposition that makes the phrase grammatical ("dancing with a jukebox").
 * Grouped by link so the whole vocabulary can be audited at a glance.
 */
const ACTION_GROUPS: Record<string, string[]> = {
  direct: [
    'juggling', 'kicking', 'hugging', 'climbing', 'painting', 'throwing', 'spinning', 'balancing', 'smashing',
    'stirring', 'tickling', 'launching', 'sketching', 'carving', 'pouring', 'crushing', 'chasing', 'building',
    'unwrapping', 'shaking', 'licking', 'bouncing', 'melting', 'splashing', 'pushing', 'pulling', 'lifting',
    'tossing', 'rolling', 'freezing', 'burning', 'sewing', 'slicing', 'dropping', 'catching', 'sniffing',
    'pinching', 'stacking', 'zipping', 'folding', 'twisting', 'sliding', 'flipping', 'inflating', 'planting',
    'slapping', 'squeezing', 'trapping', 'scrubbing', 'tangling', 'peeling', 'hurling', 'polishing', 'bending',
    'wrestling', 'steering', 'plucking', 'mixing',
  ],
  past: ['sprinting', 'flying', 'sailing', 'surfing', 'rowing', 'marching', 'racing', 'tiptoeing', 'gliding', 'floating'],
  to: ['whispering', 'singing', 'bowing'],
  at: ['waving', 'pointing', 'winking', 'whistling', 'shooting', 'swinging', 'blowing'],
  with: ['dancing'],
  into: ['diving'],
  behind: ['hiding'],
  beside: [
    'digging', 'sweeping', 'stretching', 'knitting', 'yawning', 'snoring', 'raking', 'sprinkling', 'clapping',
    'gargling', 'hatching', 'exploding',
  ],
  around: ['skating', 'weaving', 'hopping'],
  on: ['drumming', 'hammering', 'stomping'],
  over: ['vaulting'],
}

export const ACTION_LINK: Record<string, string> = Object.fromEntries(
  Object.entries(ACTION_GROUPS).flatMap(([link, actions]) => actions.map((action) => [action, link])),
)

export const OBJECTS = [
  'anchor', 'balloon', 'candle', 'donut', 'envelope', 'feather', 'globe', 'hourglass', 'igloo', 'jar',
  'kite', 'lantern', 'mirror', 'net', 'olive', 'pencil', 'quill', 'rocket', 'saxophone', 'teapot',
  'umbrella', 'violin', 'whistle', 'xylophone', 'yo-yo', 'zeppelin', 'acorn', 'bell', 'cactus', 'dice',
  'egg', 'flute', 'guitar', 'hammer', 'ice cream', 'jellyfish', 'key', 'ladder', 'magnet', 'needle',
  'oar', 'piano', 'compass', 'radio', 'skateboard', 'telescope', 'trophy', 'unicycle', 'vase', 'wheel',
  'crown', 'boot', 'clock', 'drum', 'eraser', 'fan', 'gramophone', 'helmet', 'iron', 'jukebox',
  'kettle', 'lamp', 'map', 'notebook', 'orb', 'pizza', 'quiver', 'ring', 'sword', 'trumpet',
  'tent', 'trunk', 'vinyl', 'watch', 'axe', 'bucket', 'camera', 'domino', 'elevator', 'fork',
  'glove', 'hat', 'island', 'joystick', 'knot', 'lighthouse', 'megaphone', 'nest', 'oven', 'parachute',
  'radar', 'scissors', 'toaster', 'urn', 'vault', 'windmill', 'yacht', 'zipper', 'cassette', 'spaceship',
]
