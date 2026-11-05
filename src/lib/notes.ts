import type { Role } from './ascii'

export type Note = {
  role: Role
  text: string
  source: string
}

/**
 * Why a number got its word. Only specific, checkable hooks live here; numbers
 * without one are absent rather than filled with a guess. Letter/character-count
 * notes are wordplay and say so explicitly.
 */
export const PAO_NOTES: Record<number, Note> = {
  0: {
    role: 'P',
    text: "bond's 007 puts him in mi6's double-o section",
    source: 'https://en.wikipedia.org/wiki/00_Agent',
  },
  2: {
    role: 'P',
    text: 'cleopatra ruled with two brother-husbands',
    source: 'https://www.britannica.com/summary/Cleopatra-queen-of-Egypt',
  },
  3: {
    role: 'P',
    text: 'mozart wrote three operas with librettist da ponte',
    source: 'https://www.britannica.com/topic/Cosi-fan-tutte-opera-by-Mozart',
  },
  4: {
    role: 'P',
    text: 'einstein published four papers in his 1905 annus mirabilis',
    source: 'https://guides.loc.gov/einstein-annus-mirabilis/1905-papers',
  },
  5: {
    role: 'P',
    text: 'five letters in frida',
    source: 'https://www.britannica.com/biography/Frida-Kahlo',
  },
  6: {
    role: 'P',
    text: "the sixth coalition forced napoleon's 1814 abdication",
    source: 'https://www.worldhistory.org/War_of_the_Sixth_Coalition/',
  },
  7: {
    role: 'P',
    text: 'seven letters in presley',
    source: 'https://www.britannica.com/biography/Elvis-Presley',
  },
  8: {
    role: 'P',
    text: "cowboy carter is beyoncé's eighth studio album",
    source: 'https://www.sonymusic.ca/press_release/beyonce-releases-cowboy-carter',
  },
  9: {
    role: 'P',
    text: 'nine characters in "bruce lee", space included',
    source: 'https://www.britannica.com/biography/Bruce-Lee',
  },
  11: {
    role: 'P',
    text: "gandhi's ashram required eleven vows",
    source:
      'https://www.gandhi-manibhavan.org/educational-resources/the-eleven-vows-of-gandhiji.html',
  },
  12: {
    role: 'P',
    text: 'twelve letters in pablo picasso',
    source: 'https://www.britannica.com/biography/Pablo-Picasso',
  },
  13: {
    role: 'P',
    text: "shakespeare's globe theatre burned down in 1613",
    source: 'https://www.britannica.com/topic/Globe-Theatre',
  },
  14: {
    role: 'P',
    text: 'the first edition of origin of species has 14 chapters',
    source:
      'https://darwin-online.org.uk/converted/published/1859_Origin_F373/1859_Origin_F373.html',
  },
  15: {
    role: 'P',
    text: 'fifteen letters in maria skłodowska',
    source: 'https://www.britannica.com/biography/Marie-Curie',
  },
  16: {
    role: 'P',
    text: 'chaplin was born on 16 april 1889',
    source: 'https://www.britannica.com/biography/Charlie-Chaplin',
  },
  17: {
    role: 'P',
    text: 'hitchcock directed the 1932 film number seventeen',
    source: 'https://en.wikipedia.org/wiki/Number_Seventeen_(film)',
  },
  19: {
    role: 'P',
    text: 'ali made 19 successful heavyweight title defenses',
    source: 'https://boxrec.com/wiki/index.php/Muhammad_Ali',
  },
  23: {
    role: 'P',
    text: 'jordan wore 23 for the chicago bulls',
    source: 'https://global.nba.com/news/michael-jordan-by-the-jersey-numbers',
  },
  24: {
    role: 'P',
    text: 'twenty-four letters in edson arantes do nascimento',
    source: 'https://www.britannica.com/biography/Pele-Brazilian-athlete',
  },
  26: {
    role: 'P',
    text: "iron's atomic number is 26; tyson's nickname was iron mike",
    source: 'https://pubchem.ncbi.nlm.nih.gov/element/Iron',
  },
  30: {
    role: 'P',
    text: 'leonardo moved to milan in 1482, aged 30',
    source: 'https://www.unesco.org/en/articles/leonardo-and-strife-ridden-renaissance-0',
  },
  32: {
    role: 'P',
    text: "dali was 32 on time's 14 december 1936 cover",
    source: 'https://content.time.com/time/covers/0,16641,19361214,00.html',
  },
  33: {
    role: 'P',
    text: "warhol's factory was at 33 union square west in 1968",
    source: 'https://www.archives.nyc/blog/2019/1/4/andy-warhol-in-the-city',
  },
  34: {
    role: 'P',
    text: 'bowie was 34 when under pressure was released in 1981',
    source: 'https://www.thejournal.ie/david-bowie-2536881-Jan2016/',
  },
  35: {
    role: 'P',
    text: 'prince changed his name on his 35th birthday in 1993',
    source: 'https://variety.com/1993/music/news/prince-axes-his-band-and-name-107652/',
  },
  39: {
    role: 'P',
    text: 'madonna was 39 when she released ray of light in 1998',
    source: 'https://pitchfork.com/reviews/albums/madonna-ray-of-light/',
  },
  40: {
    role: 'P',
    text: "bach's cantata bwv 40 premiered on 26 december 1723",
    source: 'https://bach.org/education/cantata-bwv-40/',
  },
  42: {
    role: 'P',
    text: 'sinatra was 42 when come fly with me topped the us chart',
    source:
      'https://www.udiscovermusic.com/stories/frank-sinatra-monte-carlo-june-1958/',
  },
  45: {
    role: 'P',
    text: 'bob marley was born on 6 february 1945',
    source: 'https://kids.britannica.com/students/article/Bob-Marley/329203',
  },
  47: {
    role: 'P',
    text: 'apollo 11 returned 47 pounds of lunar samples',
    source: 'https://science.nasa.gov/resource/sample-return-firsts',
  },
  48: {
    role: 'P',
    text: "gagarin's vostok 1 flight lasted 1 hour 48 minutes",
    source: 'https://www.fai.org/news/60th-anniversary-gagarin-space-flight',
  },
  52: {
    role: 'O',
    text: 'a year has 52 weeks, plus one day (two in a leap year)',
    source: 'https://en.wikipedia.org/wiki/Week',
  },
  53: {
    role: 'P',
    text: 'hillary and tenzing reached the everest summit in 1953',
    source:
      'https://nzhistory.govt.nz/edmund-hillary-and-tensing-norgay-reach-summit-of-everest',
  },
  54: {
    role: 'P',
    text: "lincoln's peoria speech against the kansas-nebraska act, 1854",
    source: 'https://www.nps.gov/liho/learn/historyculture/peoriaspeech.htm',
  },
  55: {
    role: 'P',
    text: 'churchill resigned as prime minister in 1955',
    source:
      'https://www.gov.uk/government/history/past-prime-ministers/winston-churchill',
  },
  56: {
    role: 'P',
    text: 'mandela was one of 156 arrested in the 1956 treason trial',
    source: 'https://archive.nelsonmandela.org/index.php/treason-trial-1961',
  },
  57: {
    role: 'P',
    text: 'king co-founded the sclc in 1957',
    source: 'https://www.nps.gov/subjects/civilrights/sclc.htm',
  },
  59: {
    role: 'P',
    text: 'caesar was elected consul for 59 bc',
    source:
      'https://www.britannica.com/biography/Julius-Caesar-Roman-ruler/The-first-triumvirate-and-the-conquest-of-Gaul',
  },
  64: {
    role: 'O',
    text: 'the nintendo 64 console',
    source: 'https://en.wikipedia.org/wiki/Nintendo_64',
  },
  75: {
    role: 'P',
    text: 'seven letters in indiana, five in jones',
    source: 'https://en.wikipedia.org/wiki/Indiana_Jones',
  },
  78: {
    role: 'P',
    text: "disney's zorro ran 78 episodes, 1957–59",
    source: 'https://d23.com/a-to-z/zorro-television/',
  },
  81: {
    role: 'P',
    text: "afi's 100 laughs ranked the navigator #81",
    source: 'https://busterkeaton.org/about-buster/',
  },
  82: {
    role: 'P',
    text: 'starred in the 1982 film the best little whorehouse in texas',
    source: 'https://www.dollyparton.com/news/the-best-little-whorehouse-in-texas',
  },
  83: {
    role: 'P',
    text: 'ada 83: 1983 ansi standard named for lovelace',
    source: 'https://www.adaic.org/advantages/ada-overview/',
  },
  85: {
    role: 'P',
    text: 'stripped of duties and resigned from apple in 1985',
    source:
      'https://www.nytimes.com/1985/09/19/business/apple-computer-entrepreneur-s-rise-and-fall.html',
  },
  86: {
    role: 'P',
    text: 'microsoft went public on march 13, 1986',
    source: 'https://learn.microsoft.com/en-us/shows/history/history-of-microsoft-1986',
  },
  88: {
    role: 'P',
    text: '88 poems, his posthumous collection, published 1979',
    source: 'https://www.jfklibrary.org/hemingway/works/books',
  },
  95: {
    role: 'P',
    text: 'the "95 inspired creations" ramsay tribute cookbook',
    source:
      'https://www.amazon.com/Garnishing-Greatness-Inspired-Creations-Gordon-ebook/dp/B0CQ7DQZF4',
  },
  99: {
    role: 'O',
    text: 'challenger was nasa orbiter ov-099',
    source:
      'https://www.nasa.gov/wp-content/uploads/2023/04/flights-challenger.pdf',
  },
}

export const noteFor = (n: number): Note | undefined => PAO_NOTES[n]
