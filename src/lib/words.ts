// Mocked PAO vocabulary: 100 Persons, 100 Actions, 100 Objects (00–99)

export const PERSONS = [
  'James Bond', 'Tesla', 'Cleopatra', 'Mozart', 'Einstein', 'Frida Kahlo', 'Napoleon', 'Elvis', 'Beyoncé', 'Bruce Lee',
  'Oprah', 'Gandhi', 'Picasso', 'Shakespeare', 'Darwin', 'Marie Curie', 'Chaplin', 'Hitchcock', 'Monroe', 'Ali',
  'Messi', 'Serena', 'Bolt', 'Jordan', 'Pelé', 'Federer', 'Tyson', 'Hawking', 'Newton', 'Warren G. Harding',
  'Da Vinci', 'Van Gogh', 'Dalí', 'Warhol', 'Bowie', 'Prince', 'Hendrix', 'Richard Nixon', 'Dylan', 'Madonna',
  'Bach', 'Beethoven', 'Sinatra', 'Mercury', 'Barack Obama', 'Marley', 'M. Jackson', 'Armstrong', 'Gagarin', 'Joe Montana',
  'Columbus', 'Michel Mayor', 'Amundsen', 'Hillary', 'Lincoln', 'Churchill', 'Mandela', 'M.L. King', 'Joan of Arc', 'Caesar',
  'Alexander', 'A.J. Foyt', 'Al Unser', 'Billy Crystal', 'Shigeru Miyamoto', 'Bobby Unser', 'Nat King Cole', 'Tom Sneva', 'Rick Mears', 'Buzz Aldrin',
  'Bobby Rahal', 'Whoopi Goldberg', 'Josh Groban', 'Steve Martin', 'Jimmy Fallon', 'Indiana Jones', 'Ariana DeBose', 'Chris Rock', 'Zorro', 'Ellen DeGeneres',
  'Jon Stewart', 'Buster Keaton', 'Dolly Parton', 'Ada Lovelace', 'Juan Pablo Montoya', 'Jobs', 'Gates', 'Neil Patrick Harris', 'Hemingway', 'Tolkien',
  'Sam Hornish Jr.', 'Dario Franchitti', 'Orwell', 'Hélio Castroneves', 'Wanda Sykes', 'Ramsay', 'Rory McIlroy', 'Tony Kanaan', 'Ryan Hunter-Reay', 'Socrates',
]

export const ACTIONS = [
  'sprinting', 'juggling', 'whispering', 'kicking', 'hugging', 'dancing', 'climbing', 'diving', 'painting', 'singing',
  'throwing', 'spinning', 'balancing', 'flying', 'digging', 'smashing', 'stirring', 'swinging', 'tickling', 'launching',
  'sailing', 'sketching', 'carving', 'skating', 'surfing', 'pouring', 'crushing', 'hiding', 'chasing', 'building',
  'unwrapping', 'shaking', 'sweeping', 'stretching', 'licking', 'bouncing', 'blowing', 'knitting', 'drumming', 'melting',
  'splashing', 'pushing', 'pulling', 'winking', 'rowing', 'shooting', 'lifting', 'weaving', 'tossing', 'passing',
  'freezing', 'discovering', 'sewing', 'slicing', 'dropping', 'catching', 'hammering', 'sniffing', 'bowing', 'yawning',
  'waving', 'pinching', 'stomping', 'stacking', 'zipping', 'folding', 'driving', 'marching', 'racing', 'landing',
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
    'tossing', 'passing', 'freezing', 'discovering', 'sewing', 'slicing', 'dropping', 'catching', 'sniffing',
    'pinching', 'stacking', 'zipping', 'folding', 'sliding', 'flipping', 'inflating', 'planting',
    'slapping', 'squeezing', 'trapping', 'scrubbing', 'tangling', 'peeling', 'hurling', 'polishing', 'bending',
    'wrestling', 'steering', 'plucking', 'mixing', 'racing',
  ],
  past: ['sprinting', 'flying', 'sailing', 'surfing', 'rowing', 'marching', 'tiptoeing', 'gliding', 'floating'],
  to: ['whispering', 'singing', 'bowing'],
  at: ['waving', 'pointing', 'winking', 'whistling', 'shooting', 'swinging', 'blowing'],
  with: ['dancing'],
  into: ['diving'],
  behind: ['hiding'],
  beside: [
    'digging', 'sweeping', 'stretching', 'knitting', 'yawning', 'raking', 'sprinkling', 'clapping',
    'gargling', 'hatching', 'exploding',
  ],
  around: ['skating', 'weaving', 'hopping'],
  on: ['drumming', 'hammering', 'stomping', 'driving', 'landing'],
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
  'oar', 'piano', 'compass', 'radio', 'skateboard', 'telescope', 'trophy', 'unicycle', 'vase', 'football',
  'crown', 'planet', 'clock', 'drum', 'eraser', 'fan', 'gramophone', 'helmet', 'iron', 'jukebox',
  'kettle', 'lamp', 'map', 'notebook', 'orb', 'pizza', 'highway', 'ring', 'car', 'moon',
  'tent', 'trunk', 'vinyl', 'watch', 'axe', 'bucket', 'camera', 'domino', 'elevator', 'fork',
  'glove', 'hat', 'island', 'joystick', 'knot', 'lighthouse', 'megaphone', 'nest', 'oven', 'parachute',
  'radar', 'scissors', 'toaster', 'urn', 'vault', 'windmill', 'yacht', 'zipper', 'cassette', 'spaceship',
]
