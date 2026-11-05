import type { Role } from './ascii'

export type Note = {
  text: string
  source: string
}

export type NoteSet = Partial<Record<Role, Note>>

/**
 * Why a number got each of its words. A number can carry up to three notes, one
 * per role. Only specific, checkable hooks live here; roles without one are
 * absent rather than filled with a guess. Letter/character-count notes are
 * wordplay and say so explicitly.
 *
 * Researched against the full 00–99 assignment table: 81 notes across 65
 * numbers (63 Person, 9 Action, 9 Object). The remaining 186 role/number
 * combinations were searched and recorded as having no verified hook in
 * docs/pao-facts-v3.md.
 */
export const PAO_NOTES: Record<number, NoteSet> = {
  0: {
    P: {
      text: "bond's 007 puts him in mi6's double-o section",
      source: 'https://en.wikipedia.org/wiki/00_Agent',
    },
  },
  1: {
    P: {
      text: 'one tesla is the si unit of magnetic flux density',
      source: 'https://en.wikipedia.org/wiki/Tesla_(unit)',
    },
  },
  2: {
    P: {
      text: 'cleopatra ruled with two brother-husbands',
      source: 'https://en.wikipedia.org/wiki/Cleopatra',
    },
  },
  3: {
    P: {
      text: 'mozart wrote three operas with librettist da ponte',
      source: 'https://en.wikipedia.org/wiki/Lorenzo_Da_Ponte',
    },
  },
  4: {
    P: {
      text: 'einstein published four papers in his 1905 annus mirabilis',
      source: 'https://guides.loc.gov/einstein-annus-mirabilis/1905-papers',
    },
    O: {
      text: 'iso 269 defines the c4 envelope to hold an unfolded a4 sheet',
      source: 'https://en.wikipedia.org/wiki/ISO_269',
    },
  },
  5: {
    P: {
      text: 'wordplay: frida has 5 letters',
      source: 'https://en.wikipedia.org/wiki/Frida_Kahlo',
    },
    A: {
      text: 'classical ballet is founded on five basic foot positions',
      source: 'https://en.wikipedia.org/wiki/Positions_of_the_feet_in_ballet',
    },
  },
  6: {
    P: {
      text: "the sixth coalition forced napoleon's 1814 abdication",
      source: 'https://en.wikipedia.org/wiki/War_of_the_Sixth_Coalition',
    },
    A: {
      text: 'nccs grade vi indicates a multi-day big wall rock climb',
      source: 'https://en.wikipedia.org/wiki/Grade_(climbing)',
    },
  },
  7: {
    P: {
      text: 'wordplay: presley has 7 letters',
      source: 'https://en.wikipedia.org/wiki/Elvis_Presley',
    },
  },
  8: {
    P: {
      text: "cowboy carter is beyoncé's eighth studio album",
      source: 'https://en.wikipedia.org/wiki/Cowboy_Carter',
    },
    A: {
      text: 'the eight, a group of american painters, exhibited together in 1908',
      source: 'https://en.wikipedia.org/wiki/Ashcan_School',
    },
  },
  9: {
    P: {
      text: 'wordplay: "bruce lee" has 9 characters with space',
      source: 'https://en.wikipedia.org/wiki/Bruce_Lee',
    },
  },
  10: {
    P: {
      text: "oprah appeared on time's annual 100 list ten times",
      source: 'https://en.wikipedia.org/wiki/Time_100',
    },
  },
  11: {
    P: {
      text: "gandhi's ashram required eleven vows",
      source: 'https://www.gandhi-manibhavan.org/educational-resources/the-eleven-vows-of-gandhiji.html',
    },
  },
  12: {
    P: {
      text: 'wordplay: pablo picasso has 12 letters',
      source: 'https://en.wikipedia.org/wiki/Pablo_Picasso',
    },
  },
  13: {
    P: {
      text: "shakespeare's globe theatre burned down in 1613",
      source: 'https://en.wikipedia.org/wiki/Globe_Theatre',
    },
  },
  14: {
    P: {
      text: 'the first edition of origin of species has 14 chapters',
      source: 'https://en.wikipedia.org/wiki/On_the_Origin_of_Species',
    },
  },
  15: {
    P: {
      text: 'wordplay: maria skłodowska has 15 letters',
      source: 'https://en.wikipedia.org/wiki/Marie_Curie',
    },
  },
  16: {
    P: {
      text: 'chaplin was born on 16 april 1889',
      source: 'https://en.wikipedia.org/wiki/Charlie_Chaplin',
    },
  },
  17: {
    P: {
      text: 'hitchcock directed the 1932 film number seventeen',
      source: 'https://en.wikipedia.org/wiki/Number_Seventeen',
    },
    O: {
      text: 'apollo 17 was the final crewed lunar landing mission of the apollo program',
      source: 'https://en.wikipedia.org/wiki/Apollo_17',
    },
  },
  18: {
    P: {
      text: 'monroe was 18 when photographed at radioplane in 1944',
      source: 'https://en.wikipedia.org/wiki/Marilyn_Monroe',
    },
  },
  19: {
    P: {
      text: 'ali made 19 successful heavyweight title defenses',
      source: 'https://en.wikipedia.org/wiki/Muhammad_Ali',
    },
    A: {
      text: 'launch complex 19 at cape canaveral launched all ten crewed gemini missions',
      source: 'https://en.wikipedia.org/wiki/Launch_Complex_19',
    },
  },
  20: {
    P: {
      text: 'messi scored 20+ la liga goals in 13 straight seasons',
      source: 'https://www.fcbarcelona.com/en/news/2069411/messi-reaches-20-league-goals-for-the-13th-season-in-a-row',
    },
  },
  21: {
    P: {
      text: 'serena won her 21st grand slam singles title at wimbledon 2015',
      source: 'https://www.espn.com/tennis/wimbledon15/story/_/id/13238504/serena-williams-wins-wimbledon-claims-fourth-consecutive-major-title',
    },
  },
  22: {
    P: {
      text: 'bolt turned 22 during the 2008 beijing olympics',
      source: 'https://en.wikipedia.org/wiki/Usain_Bolt',
    },
  },
  23: {
    P: {
      text: 'jordan wore 23 for the chicago bulls',
      source: 'https://global.nba.com/news/michael-jordan-by-the-jersey-numbers',
    },
  },
  24: {
    P: {
      text: 'wordplay: edson arantes do nascimento has 24 letters',
      source: 'https://en.wikipedia.org/wiki/Pel%C3%A9',
    },
  },
  25: {
    P: {
      text: "federer's 25th masters 1000 title came at indian wells in 2017",
      source: 'https://www.atptour.com/en/news/federer-wawrinka-indian-wells-2017-final',
    },
    A: {
      text: 'uk single measures of gin, rum, vodka or whisky are 25 or 35 ml',
      source: 'https://www.gov.uk/weights-measures-and-packaging-the-law/specified-quantities',
    },
    O: {
      text: 'lz 25 was the 25th airship built by count zeppelin',
      source: 'https://en.wikipedia.org/wiki/Zeppelin_LZ_25',
    },
  },
  26: {
    P: {
      text: "iron's atomic number is 26; tyson's nickname was iron mike",
      source: 'https://pubchem.ncbi.nlm.nih.gov/element/Iron',
    },
  },
  27: {
    P: {
      text: 'hawking took a caius fellowship at 27 in 1969',
      source: 'https://www.iop.org/physics-community/obituaries/stephen-hawking',
    },
  },
  28: {
    P: {
      text: 'as warden of the mint, newton prosecuted 28 counterfeiters',
      source: 'https://www.numismaticnews.net/world-coins/genius-newton-chased-counterfeiters',
    },
  },
  30: {
    P: {
      text: 'leonardo moved to milan in 1482, aged 30',
      source: 'https://en.wikipedia.org/wiki/Leonardo_da_Vinci',
    },
    O: {
      text: 'a 5x6 paper pulp egg flat holds 30 eggs',
      source: 'https://en.wikipedia.org/wiki/Egg_carton',
    },
  },
  31: {
    P: {
      text: 'van gogh painted the nuenen weavers in 1884, the year he turned 31',
      source: 'https://www.vincentvangogh.org/weaver.jsp',
    },
  },
  32: {
    P: {
      text: "dali was 32 on time's 14 december 1936 cover",
      source: 'https://content.time.com/time/covers/0,16641,19361214,00.html',
    },
  },
  33: {
    P: {
      text: "warhol's factory was at 33 union square west from 1967 to 1968",
      source: 'https://www.archives.nyc/blog/2019/1/4/andy-warhol-in-the-city',
    },
  },
  34: {
    P: {
      text: 'bowie was 34 when he released under pressure with queen',
      source: 'https://en.wikipedia.org/wiki/Under_Pressure',
    },
  },
  35: {
    P: {
      text: 'prince changed his name on his 35th birthday in 1993',
      source: 'https://variety.com/1993/music/news/prince-axes-his-band-and-name-107652/',
    },
  },
  36: {
    O: {
      text: 'a standard 88-key piano has 36 black keys',
      source: 'https://en.wikipedia.org/wiki/Piano',
    },
  },
  38: {
    P: {
      text: 'dylan was 38 when slow train coming was released in 1979',
      source: 'https://en.wikipedia.org/wiki/Slow_Train_Coming',
    },
    O: {
      text: 'n38 grade neodymium magnets have a maximum energy product of 38 mgoe',
      source: 'https://en.wikipedia.org/wiki/Neodymium_magnet',
    },
  },
  39: {
    P: {
      text: 'madonna was 39 when she released ray of light in 1998',
      source: 'https://pitchfork.com/reviews/albums/madonna-ray-of-light/',
    },
  },
  40: {
    P: {
      text: "bach's cantata bwv 40 premiered on 26 december 1723",
      source: 'https://bach.org/education/cantata-bwv-40/',
    },
  },
  41: {
    P: {
      text: "beethoven approved kleinheinz's 1803 arrangement of the op. 25 serenade as op. 41",
      source: 'https://www.henle.de/en/Serenade-op.-41-for-Piano-and-Flute-Violin/HN-934',
    },
  },
  42: {
    P: {
      text: 'sinatra was 42 when come fly with me topped the us chart',
      source: 'https://www.udiscovermusic.com/stories/frank-sinatra-monte-carlo-june-1958/',
    },
  },
  43: {
    P: {
      text: "queen's a night at the opera runs 43 minutes 8 seconds",
      source: 'https://en.wikipedia.org/wiki/A_Night_at_the_Opera_(Queen_album)',
    },
  },
  45: {
    P: {
      text: 'bob marley was born on 6 february 1945',
      source: 'https://kids.britannica.com/students/article/Bob-Marley/329203',
    },
    A: {
      text: '.45 acp is a widely used firearm cartridge designed for military sidearms',
      source: 'https://en.wikipedia.org/wiki/.45_ACP',
    },
    O: {
      text: 'galileo first observed messier 45, the pleiades, through a telescope',
      source: 'https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-45/',
    },
  },
  46: {
    P: {
      text: 'jackson was 46 when acquitted of all charges in june 2005',
      source: 'https://www.latimes.com/la-me-jacksontimeline-verdict-story.html',
    },
  },
  47: {
    P: {
      text: 'apollo 11 returned 47 pounds of lunar samples',
      source: 'https://science.nasa.gov/resource/sample-return-firsts',
    },
  },
  48: {
    P: {
      text: "gagarin's vostok 1 flight lasted 1 hour 48 minutes",
      source: 'https://www.fai.org/news/60th-anniversary-gagarin-space-flight',
    },
  },
  52: {
    P: {
      text: "amundsen's south pole party set out with 52 dogs in october 1911",
      source: 'https://nettarkiv.npolar.no/sorpolen2011.npolar.no/en/diary/south-pole/2011-10-19-the-day-we-should-have-set-off.html',
    },
    O: {
      text: 'a year has 52 weeks, plus one day (two in a leap year)',
      source: 'https://en.wikipedia.org/wiki/Week',
    },
  },
  53: {
    P: {
      text: 'hillary and tenzing reached the everest summit in 1953',
      source: 'https://nzhistory.govt.nz/edmund-hillary-and-tensing-norgay-reach-summit-of-everest',
    },
  },
  54: {
    P: {
      text: "lincoln's peoria speech against the kansas-nebraska act, 1854",
      source: 'https://www.nps.gov/liho/learn/historyculture/peoriaspeech.htm',
    },
  },
  55: {
    P: {
      text: 'churchill resigned as prime minister in 1955',
      source: 'https://www.gov.uk/government/history/past-prime-ministers/winston-churchill',
    },
  },
  56: {
    P: {
      text: 'mandela was one of 156 arrested in the 1956 treason trial',
      source: 'https://archive.nelsonmandela.org/index.php/treason-trial-1961',
    },
  },
  57: {
    P: {
      text: 'king co-founded the sclc in 1957',
      source: 'https://www.nps.gov/subjects/civilrights/sclc.htm',
    },
  },
  59: {
    P: {
      text: 'caesar was elected consul for 59 bc',
      source: 'https://www.britannica.com/biography/Julius-Caesar-Roman-ruler/The-first-triumvirate-and-the-conquest-of-Gaul',
    },
  },
  60: {
    P: {
      text: "arrian: alexander's march from oria to pura took sixty days",
      source: 'https://www.livius.org/sources/content/arrian/anabasis/alexander-in-the-gedrosian-desert/',
    },
  },
  75: {
    P: {
      text: 'wordplay: indiana has 7 letters, jones has 5, giving 75',
      source: 'https://en.wikipedia.org/wiki/Indiana_Jones',
    },
  },
  78: {
    P: {
      text: "disney's zorro ran 78 episodes, 1957-59",
      source: 'https://en.wikipedia.org/wiki/Zorro_(1957_TV_series)',
    },
  },
  81: {
    P: {
      text: "afi's 100 laughs ranked the navigator #81",
      source: 'https://www.afi.com/afis-100-years-100-laughs/',
    },
  },
  82: {
    P: {
      text: 'starred in the 1982 film the best little whorehouse in texas',
      source: 'https://en.wikipedia.org/wiki/The_Best_Little_Whorehouse_in_Texas_(film)',
    },
  },
  83: {
    P: {
      text: 'ansi/mil-std-1815a-1983 is the ada 83 standard',
      source: 'https://www.nist.gov/publications/reference-manual-ada-programming-language',
    },
    A: {
      text: 'air canada flight 143 famously glided to safety in 1983 as the gimli glider',
      source: 'https://en.wikipedia.org/wiki/Gimli_Glider',
    },
  },
  85: {
    P: {
      text: 'stripped of duties and resigned from apple in 1985',
      source: 'https://en.wikipedia.org/wiki/Steve_Jobs',
    },
  },
  86: {
    P: {
      text: 'microsoft ipo 13 march 1986',
      source: 'https://learn.microsoft.com/en-us/shows/history/history-of-microsoft-1986',
    },
  },
  88: {
    P: {
      text: '88 poems published 1979',
      source: 'https://www.jfklibrary.org/hemingway/works/books',
    },
  },
  92: {
    A: {
      text: "united world wrestling sanctions 92 kg as an official men's freestyle division",
      source: 'https://en.wikipedia.org/wiki/List_of_World_Championships_medalists_in_freestyle_wrestling#92_kg',
    },
  },
  95: {
    P: {
      text: 'the "95 inspired creations" ramsay tribute cookbook',
      source: 'https://www.amazon.com/Garnishing-Greatness-Inspired-Creations-Gordon-ebook/dp/B0CQ7DQZF4',
    },
  },
  99: {
    P: {
      text: 'socrates was executed in 399 bce',
      source: 'https://plato.stanford.edu/entries/socrates/',
    },
    A: {
      text: 'challenger (ov-099) broke apart 73 seconds after launch',
      source: 'https://www.nasa.gov/wp-content/uploads/2023/04/flights-challenger.pdf',
    },
    O: {
      text: 'challenger was nasa orbiter ov-099',
      source: 'https://www.nasa.gov/wp-content/uploads/2023/04/flights-challenger.pdf',
    },
  },
}

export const notesFor = (n: number): NoteSet | undefined => PAO_NOTES[n]
