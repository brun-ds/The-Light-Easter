/* ==========================================================================
   THE LIGHT EATERS WIKI: CONTENT
   All wiki content lives in this file. The code is in app.js.
   Never invent lore: leave unknown fields as "Unknown".
   Do NOT put RESTRICTED or private development material in this repository:
   anyone with the link (or access to a public repo) can read these files.
   ========================================================================== */
window.WIKI = {
  categories: [
    { slug: 'world', name: 'The World', roman: 'I', description: 'Geography, regions and special locations' },
    { slug: 'bestiary', name: 'Bestiary', roman: 'II', description: 'Natural animals and beasts' },
    { slug: 'voidarium', name: 'Voidarium', roman: 'III', description: 'Void creatures and their materials' },
    { slug: 'flora', name: 'Flora', roman: 'IV', description: 'Plants and vegetation' },
    { slug: 'light', name: 'The Light', roman: 'V', description: 'The fundamental energy system' },
    { slug: 'kingdoms', name: 'Kingdoms', roman: 'VI', description: 'The five human kingdoms' },
    { slug: 'characters', name: 'Characters', roman: 'VII', description: 'Important individuals' },
    { slug: 'ancient-civilization', name: 'Ancient Civilization', roman: 'VIII', description: 'The civilization before the kingdoms' },
    { slug: 'materials', name: 'Materials & Resources', roman: 'IX', description: 'Resources from creatures, plants and places' },
    { slug: 'lore', name: 'Lore & Archives', roman: 'X', description: 'History, events and mysteries' }
  ],

  // Section list of the World Bible (structure only, no entries yet).
  worldBible: ['Universe Overview', 'Fundamental Rules', 'The Light System', 'Void Rules', 'Humans & Classifications', 'Animals', 'Flora', 'The Forgotten', 'The Five Kingdoms', 'Geography', 'Ancient Civilization', 'Characters', 'Main Story', 'Timeline', 'Unresolved Questions'],

  /* ARTICLE FORMAT
     id:         "<category-slug>/<article-slug>"  (unique, never change it once used in links)
     template:   creature | flora | region | kingdom | character | material | lore | historical
     status:     canon | in-development | theory | unknown
     visibility: normal | spoiler        ("restricted" content must NOT be in this repo)
     placeholder: true = layout example only (hidden from counts and search)
     infobox:    [["Label", "Value"], ...]
     sections:   [{ title, sources, items: ["text", { text: "text", status: "theory" }] }]
     Text markup: [[category/slug|link text]] = link to another article, **bold**, *italic*
     related:    ["category/slug", ...]   sources: ["World Bible entry", ...]   tags: ["Basic Void"] */
  articles: [
    {
      id: 'voidarium/example-creature',
      title: '[Creature Name]',
      template: 'creature',
      category: 'voidarium',
      summary: '[One-line summary of the article.]',
      status: 'unknown',
      visibility: 'normal',
      placeholder: true,
      image: '',
      imageCaption: '',
      infobox: [['Class', 'Unknown'], ['Habitat', '[Region]'], ['Kingdoms', 'Unknown'], ['Danger', 'Unknown'], ['Materials', '[Material]'], ['Sources', '[World Bible entry]'], ['First seen', 'Unknown']],
      sections: [
        { title: 'Description', sources: '[World Bible entry]', items: ['Unknown. No information recorded yet.'] },
        { title: 'Physical Characteristics', items: ['Unknown. No information recorded yet.'] },
        { title: 'Behaviour', items: [{ text: '[Statement about behaviour.]', status: 'theory' }, 'Unknown.'] },
        { title: 'Capabilities', items: ['Unknown. No information recorded yet.'] },
        { title: 'Combat Information', items: ['Unknown. No information recorded yet.'] },
        { title: 'Core & Materials', items: ['Unknown. No information recorded yet.'] },
        { title: 'History', items: ['Unknown. No information recorded yet.'] }
      ],
      related: [],
      sources: [],
      tags: ['Basic Void']
    }
  ]
};
