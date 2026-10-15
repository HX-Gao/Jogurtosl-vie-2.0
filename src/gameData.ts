import { TerrainInfo, TerrainType, RegionData, TurnEvent, RandomEvent, Card, PersonProfile, GlossaryTerm, GameState, HistoricalDilemma } from './types';

export const TERRAINS: Record<TerrainType, TerrainInfo> = {
  plains: {
    label: 'Rovina',
    icon: '🌾',
    pM: -1,
    gM: +2,
    desc: 'Panonská nížina – otevřený terén pro německé tanky a motorizované kolony. Partyzáni -1 k hodu, Němci +2.'
  },
  mountains: {
    label: 'Hory',
    icon: '⛰️',
    pM: +2,
    gM: -2,
    desc: 'Dinárské Alpy a Kopaonik – ráj partyzánské guerilly. Partyzáni +2 k hodu, Wehrmacht -2.'
  },
  mixed: {
    label: 'Kopce a lesy',
    icon: '🌲',
    pM: 0,
    gM: 0,
    desc: 'Šumadijské pahorkatiny – střídavý terén lesů a polí bez plošných modifikátorů.'
  },
  city: {
    label: 'Pevnostní město',
    icon: '🏙️',
    pM: -2,
    gM: +2,
    desc: 'Bělehrad – masivně opevněná nacistická bašta. Bez dělostřelectva a tanků Rudé armády (tah 11) téměř nedobytné.'
  }
};

export const REGIONS_DATA: RegionData[] = [
  {
    id: 'banat',
    name: 'Banát',
    ter: 'plains',
    sc: -3,
    sg: 3,
    sb: 0,
    isCapital: false,
    city: 'V. Bečkerek',
    cx: 265,
    cy: 68,
    lx: 292,
    ly: 84,
    sp: '⚠️ Tankový koridor: Němci +1 k útoku. Zvláštní autonomní statut spravovaný folksdojčery.',
    historicalNote: 'Banát měl zvláštní správní režim německé etnické menšiny (Volksdeutsche). Působily zde divize SS „Prinz Eugen“, rekrutované právě ze zdejších Němců.',
    path: 'M 200,22 L 305,16 L 385,36 L 410,88 L 396,134 L 340,150 L 272,153 L 217,143 L 200,112 L 190,58 Z'
  },
  {
    id: 'belehrad',
    name: 'Bělehrad',
    ter: 'city',
    sc: -5,
    sg: 6,
    sb: 0,
    isCapital: true,
    city: 'Bělehrad (Beograd)',
    cx: 200,
    cy: 160,
    lx: 200,
    ly: 165,
    sp: '🎯 HLAVNÍ CÍL VÁLKY – nutno osvobodit (kontrola ≥ +3). Pevné opevnění (🔒). Bez Rudé armády postih -4.',
    historicalNote: 'Soutok Dunaje a Sávy. Centrum německé vojenské správy pro jihovýchodní Evropu. Těžce bombardován Luftwaffe v dubnu 1941.',
    path: 'M 182,143 L 217,143 L 232,160 L 217,177 L 182,177 L 166,160 Z'
  },
  {
    id: 'zap',
    name: 'Záp. Srbsko',
    ter: 'mountains',
    sc: 0,
    sg: 2,
    sb: 1,
    isCapital: false,
    city: 'Čačak / Užice',
    cx: 140,
    cy: 270,
    lx: 93,
    ly: 248,
    sp: '⛰️ Kolébka odboje: Základny dávají +2 k obraně. Užická republika – první osvobozené území v okupované Evropě.',
    historicalNote: 'V pohoří Zlatibor a Tara vznikla na podzim 1941 Užická republika s vlastní výrobou zbraní a střeliva.',
    path: 'M 28,152 L 120,132 L 182,143 L 166,160 L 182,177 L 174,206 L 160,282 L 122,354 L 66,372 L 14,323 L 6,257 L 22,198 Z'
  },
  {
    id: 'stred',
    name: 'Střed. Srbsko',
    ter: 'mixed',
    sc: -2,
    sg: 2,
    sb: 0,
    isCapital: false,
    city: 'Kragujevac',
    cx: 265,
    cy: 245,
    lx: 272,
    ly: 237,
    sp: '🏭 Průmyslové centrum: Sabotáž přináší +2 zásoby navíc. Zbrojní závody Zastava a železniční uzel.',
    historicalNote: 'Místo tragického masakru v Kragujevaci v říjnu 1941, kde Wehrmacht postřílel téměř 2 800 civilistů včetně školáků.',
    path: 'M 217,143 L 272,153 L 340,150 L 358,180 L 348,272 L 310,328 L 244,337 L 182,296 L 174,222 L 182,177 L 217,177 Z'
  },
  {
    id: 'vych',
    name: 'Vých. Srbsko',
    ter: 'mixed',
    sc: -2,
    sg: 1,
    sb: 0,
    isCapital: false,
    city: 'Niš',
    cx: 370,
    cy: 314,
    lx: 406,
    ly: 248,
    sp: '🔄 Hraniční koridor: +1 zásoby/tah při vaší kontrole. Trasa pro příchod Rudé armády z Rumunska.',
    historicalNote: 'Strategická železnice Bělehrad–Soluň procházela Nišem. Odtud vedla přímá cesta k rumunským a bulharským hranicím.',
    path: 'M 340,150 L 396,134 L 443,148 L 478,201 L 462,293 L 422,354 L 363,373 L 318,344 L 310,328 L 348,272 L 358,180 Z'
  },
  {
    id: 'jiz',
    name: 'Již. Srbsko',
    ter: 'mountains',
    sc: -1,
    sg: 1,
    sb: 0,
    isCapital: false,
    city: 'Kosovska Mitrovica',
    cx: 256,
    cy: 426,
    lx: 226,
    ly: 412,
    sp: '🏔️ Kopaonik a Kosovo: 1 partyzánská základna je vždy nezničitelná. Po italské kapitulaci (tah 8) slábne nepřítel.',
    historicalNote: 'Hornatý masiv Kopaonik chránil partyzánské oddíly před vyhlazovacími ofenzívami Wehrmachtu a italských jednotek.',
    path: 'M 122,354 L 182,296 L 244,337 L 310,328 L 318,344 L 363,373 L 350,436 L 288,483 L 218,485 L 152,457 L 88,404 Z'
  }
];

export const HISTORICAL_TURNS: TurnEvent[] = [
  {
    n: 1,
    date: '6. dubna 1941',
    short: 'Útok na Jugoslávii (Operace Strafgericht)',
    hist: true,
    fLog: '💣 6. 4. 1941: Luftwaffe bombarduje Bělehrad (Operace Odplata). Jugoslávie kapituluje 17. 4. Morálka klesá.',
    fApply: g => ({ ...g, morale: Math.max(0, g.morale - 10) }),
    hTitle: 'Dubnová válka a invaze Osy (6.–17. dubna 1941)',
    hText: 'Bez vyhlášení války zahájilo nacistické Německo společně s Itálií a Maďarskem útok na Království Jugoslávie. Polní maršál Alexander Löhr řídil operaci „Strafgericht" (Trestný soud / Odplata) – kobercové bombardování Bělehradu, které zničilo infrastrukturu i Národní knihovnu s tisíci středověkými rukopisy. Během 11 dnů královská armáda podepsala bezpodmínečnou kapitulaci. Král Petr II. s vládou uprchl do Londýna. Jugoslávie byla rozparcelována: vznikl ustašovský Nezávislý stát Chorvatsko (NDH), Banát byl svěřen folksdojčerům a v Srbsku dosadili Němci loutkovou vojenskou správu generála Milana Nediće.',
    quote: {
      text: '„Bělehrad musí být zničen v nočních a denních náletech tak, aby byl vyřazen jako mocenské centrum.“',
      author: 'Adolf Hitler, Vůdcova směrnice č. 25'
    }
  },
  {
    n: 2,
    date: 'Červenec 1941',
    short: 'Výzva k povstání a vznik partyzánů',
    hist: true,
    fLog: '✊ 4. 7. 1941: KPJ v čele s Titem vyhlašuje všeobecné ozbrojené povstání! Přicházejí první bojovníci (+3 bojovníci, +5 morálka).',
    fApply: g => ({ ...g, fighters: g.fighters + 3, morale: Math.min(100, g.morale + 5) }),
    hTitle: 'Počátek odboje – Partyzáni a Četníci (léto 1941)',
    hText: 'Po napadení Sovětského svazu Třetí říší (22. 6. 1941) se komunistické ústředí v Bělehradě rozhodlo k okamžitému ozbrojenému odporu. 4. července 1941 vydal Josip Broz Tito proklamaci: „Národy Jugoslávie – Srbové, Chorvati, Slovinci, Černohorci, Bosňáci a Makedonci... do boje proti fašistickým okupantům!" Zároveň na hoře Ravna Gora shromažďoval plukovník Dragoljub Draža Mihailović zbytky královské armády – četniky. V létě 1941 obě skupiny často koordinovaly přepady německých stanovišť.',
    quote: {
      text: '„Smrt fašismu, svobodu lidu!“',
      author: 'Partyzánský pozdrav (Smrt fašizmu, sloboda narodu!)'
    }
  },
  {
    n: 3,
    date: 'Říjen 1941',
    short: 'Německý teror: Masakr v Kragujevaci',
    hist: true,
    fLog: '💀 21. 10. 1941: Nacisté popravují 2 794 civilistů v Kragujevaci podle kvóty 100 Srbů za 1 zabitého Němce. Morálka -12, hněv přivádí +4 bojovníky.',
    fApply: g => {
      const r = { ...g.regions };
      if (r.stred) r.stred = { ...r.stred, garrison: Math.min(6, r.stred.garrison + 1) };
      return { ...g, regions: r, morale: Math.max(0, g.morale - 12), fighters: g.fighters + 4 };
    },
    hTitle: 'Krvavý podzim – Masakr v Kragujevaci a Kraljevu',
    hText: 'V reakci na partyzánské a četnické úspěchy vydal polní maršál Wilhelm Keitel drakonický rozkaz: za každého padlého německého vojáka bude popraveno 100 rukojmích z řad srbského obyvatelstva, za každého zraněného 50. Vrcholem byl 21. říjen 1941 v Kragujevaci. Wehrmacht za asistence Nedićových četníků a fašistického hnutí ZBOR obklíčil město a postřílel bezmála 2 800 mužů a chlapců, včetně celých tříd gymnázia i s jejich profesory. Ředitel gymnázia Miloje Pavlović odmítl nabídku na omilostnění se slovy: „Střílejte! Já stále vyučuji!" Tento teror však odpor nezlomil – vhnal tisíce mladých lidí do lesů.',
    quote: {
      text: '„Pucajte, ja i sada držim čas!“ (Střílejte, já stále vyučuji!)',
      author: 'Profesor Miloje Pavlović před popravčí četou'
    }
  },
  {
    n: 4,
    date: 'Prosinec 1941',
    short: 'Pád Užické republiky (První nepřátelská ofenzíva)',
    hist: true,
    fLog: '📉 Prosinec 1941: Německá ofenzíva drtí Užickou republiku. Partyzáni ustupují do Bosny. Těžké ztráty.',
    fApply: g => {
      const r = { ...g.regions };
      if (r.zap) r.zap = { ...r.zap, control: Math.max(-3, r.zap.control - 2), garrison: Math.min(5, r.zap.garrison + 2), bases: Math.max(0, r.zap.bases - 1) };
      return { ...g, regions: r, fighters: Math.max(3, g.fighters - 4), morale: Math.max(0, g.morale - 8) };
    },
    hTitle: 'Pád Užické republiky a rozkol s Četníky',
    hText: 'Na podzim 1941 partyzáni ovládali pás území v západním Srbsku o rozloze 20 000 km² s centrem v Užici. Zde fungovala tiskárna, zbrojovka produkující 400 pušek denně i partyzánská banka. V listopadu 1941 však německá 342. pěší divize zahájila operaci Užice. Současně se prohloubil rozkol mezi Titem a Mihailovićem – četníci se obávali německých represálií vůči civilistům a začali uzavírat tajné dohody s Nedićem i Italy. Tito musel Užici opustit a ustoupit se svými oddíly do nehostinných hor Bosny a Černé Hory.',
    quote: {
      text: '„Užická republika byla prvním ostrovem svobody v hitlerovské pevnosti Evropa.“',
      author: 'Historická bilance podzimu 1941'
    }
  },
  {
    n: 5,
    date: 'Jaro 1942',
    short: 'Rok temna – partyzánský pochod Bosnou',
    hist: false,
    fLog: '🌲 Jaro 1942: Partyzánské jádro se reorganizuje v Bosně. Mihailović jmenován exilovou vládou ministrem války.',
    fApply: g => ({ ...g, resources: Math.min(20, g.resources + 1) }),
    hTitle: 'Rok 1942 – Reorganizace odboje a četnická kolaborace',
    hText: 'Rok 1942 byl obdobím nejtěžších zkoušek. Titovy elitní Proletářské brigády provedly legendární pochod mrazem přes pohoří Igman k bosenské Foči. Mihailović byl v lednu 1942 londýnskou exilovou vládou jmenován ministrem války, ačkoliv jeho velitelé v Černé Hoře a Bosně otevřeně spolupracovali s italskou 2. armádou v boji proti komunistickým partyzánům. Britové zatím posílali zásoby pouze četníkům, aniž plně chápali komplexitu občanské války pod okupací.',
    quote: {
      text: '„Bojujeme nejen proti okupantům, ale o samotnou budoucí podobu naší země.“',
      author: 'Z deníku Vladimira Dedijera, 1942'
    }
  },
  {
    n: 6,
    date: 'Listopad 1942',
    short: 'AVNOJ – zrození nové federální vlády',
    hist: true,
    fLog: '🏛️ 26. 11. 1942: Tito v Bihaći ustavuje AVNOJ! Politický základ nové Jugoslávie. Morálka +12, +3 bojovníci.',
    fApply: g => ({ ...g, morale: Math.min(100, g.morale + 12), fighters: g.fighters + 3 }),
    hTitle: 'První zasedání AVNOJ v Bihaći (26.–27. listopadu 1942)',
    hText: 'V osvobozeném městě Bihać svolalo partyzánské vedení Antifašistickou radu národního osvobození Jugoslávie (AVNOJ). 78 delegátů ze všech národů položilo základy pro poválečnou republiku založenou na federativním principu a rovnoprávnosti všech národů (Srbů, Chorvatů, Slovinců, Makedonců i Černohorců). Tento krok posílil legitimitu partyzánů jako reálné státotvorné alternativy k diskreditované monarchii krále Petra.',
    quote: {
      text: '„Braterství a jednota (Bratstvo i jedinstvo) je náš základní štít.“',
      author: 'Rezoluce AVNOJ v Bihaći'
    }
  },
  {
    n: 7,
    date: 'Červen 1943',
    short: 'Bitvy na Neretvě a Sutjesce',
    hist: true,
    fLog: '⚔️ Léto 1943: Operace Weiss a Schwarz. Třetina partyzánů padla, ranění zachráněni, Tito zraněn, ale obklíčení prolomeno.',
    fApply: g => ({
      ...g,
      fighters: Math.max(4, g.fighters - 5),
      morale: Math.max(20, g.morale - 5),
      resources: Math.max(0, g.resources - 2)
    }),
    hTitle: 'Bitvy na Neretvě a Sutjesce – hrdinství za cenu krve',
    hText: 'V operaci Weiss (únor–březen 1943 na Neretvě) partyzáni oklamali nepřítele odstřelem mostu a následným bleskovým přechodem přes řeku, čímž uštědřili rozhodující porážku četnickým sborům. V květnu 1943 v operaci Schwarz (Sutjeska) obklíčilo 127 000 vojáků Osy s letectvem 22 000 partyzánů se 4 000 raněnými. Za nepředstavitelných ztrát (padlo přes 7 500 partyzánů) hlavní síly prorazily německý kruh u Tjentiště. Tito byl raněn střepinou do paže. Přítomný britský styčný důstojník William Deakin podal do Londýna zprávu: Partyzáni bojují s neuvěřitelnou statečností, zatímco četníci kolaborují.',
    quote: {
      text: '„Bojujte do posledního dechu. Každý krok zpět je zradou našich raněných bratří.“',
      author: 'Sava Kovačević, velitel 3. úderné divize na Sutjesce'
    }
  },
  {
    n: 8,
    date: '8. září 1943',
    short: '⚡ Italská kapitulace!',
    hist: true,
    fLog: '🏳️ 8. 9. 1943: ITÁLIE KAPITULOVALA! Partyzáni zabavují sklady italských zbraní a dělostřelectva. +6 zásoby, +5 bojovníků, morálka +15!',
    fApply: g => {
      const r = { ...g.regions };
      if (r.jiz) r.jiz = { ...r.jiz, control: Math.min(5, r.jiz.control + 2), garrison: Math.max(0, r.jiz.garrison - 1) };
      return {
        ...g,
        regions: r,
        resources: Math.min(20, g.resources + 6),
        fighters: g.fighters + 5,
        morale: Math.min(100, g.morale + 15)
      };
    },
    hTitle: 'Kapitulace Itálie – strategický zvrat na Balkáně',
    hText: 'Po pádu Mussoliniho podepsala Itálie v Cassibile příměří se Spojenci. Pro jugoslávský odboj to znamenalo obrovský obrat. Šest italských divizí bylo partyzány odzbrojeno dříve, než stačil zareagovat Wehrmacht. Do rukou odbojářů padly desítky tisíc pušek, stovky děl, tanky i muniční sklady. Celé oblasti Dalmácie, Černé Hory a jižního Srbska byly osvobozeny. Partyzánská armáda během několika týdnů zdvojnásobila své početní stavy.',
    quote: {
      text: '„Italská kapitulace proměnila partyzánské oddíly v regulérní polní armádu s vlastním dělostřelectvem.“',
      author: 'Winston Churchill v britském válečném kabinetu'
    }
  },
  {
    n: 9,
    date: 'Prosinec 1943',
    short: 'Teheránská konference – Spojenci uznávají Tita',
    hist: true,
    fLog: '✈️ Prosinec 1943: Velká trojka v Teheránu oficiálně uznává Tita jako jediného spojence. Zahájeny masivní shozy RAF.',
    fApply: g => ({
      ...g,
      british: true,
      resources: Math.min(20, g.resources + 5),
      morale: Math.min(100, g.morale + 8)
    }),
    hTitle: 'Teheránská konference a britská mise Fitzroye Macleana',
    hText: 'V listopadu 1943 se v Teheránu setkali Churchill, Roosevelt a Stalin. Na základě zpráv britské mise Fitzroye Macleana Spojenci formálně ukončili veškeré dodávky četníkům Draži Mihailoviće a zavázali se maximálně materiálně podporovat výhradně partyzány maršála Tita. Britská RAF a jihoafrické letectvo začaly ze základen v osvobozené jižní Itálii shazovat stovky tun zbraní, léků, uniforem a spojovacích přístrojů. Tito byl v Jajci jmenován maršálem Jugoslávie.',
    quote: {
      text: '„Zásobujeme ty, kteří bojují proti Němcům a zabíjejí jich nejvíce.“',
      author: 'Winston Churchill vysvětluje změnu britské politiky'
    }
  },
  {
    n: 10,
    date: 'Květen 1944',
    short: 'Operace Rösselsprung (Výsadek na Drvar)',
    hist: true,
    fLog: '🪂 25. 5. 1944: 500 parašutistů SS přepadá Titovo velitelství v Drvaru. Tito uniká jeskynním tunelem a je evakuován na ostrov Vis.',
    fApply: g => ({
      ...g,
      fighters: g.fighters + 4,
      morale: Math.min(100, g.morale + 6)
    }),
    hTitle: 'Operace Rösselsprung – Zoufalý pokus zlikvidovat Tita',
    hText: 'V den Titových 52. narozenin (25. května 1944) provedl 500. paradesantní prapor SS překvapivý kluzákový a padákový výsadek přímo na partyzánské velitelství v jeskyni u Drvaru v Bosně. Mladí členové partyzánské ostrahy a důstojnické školy se obětovali a zadrželi elitní esesmany, což umožnilo Titovi s britskou i sovětskou misí uniknout do hor. Následně byl Tito sovětským letounem z provizorního horského letiště evakuován do Bari a přemístěn na ostrov Vis, střežený Royal Navy. Ze Visu koordinoval závěrečné osvobozování Srbska.',
    quote: {
      text: '„Němci získali Titovu uniformu ušitou k narozeninám, ale maršál jim unikl před nosem.“',
      author: 'Brigádní generál Fitzroy Maclean'
    }
  },
  {
    n: 11,
    date: 'Září 1944',
    short: '🔴 Rudá armáda vstupuje do Srbska!',
    hist: true,
    fLog: '🔴 6. 9. 1944: 3. ukrajinský front maršála Tolbuchina překračuje Dunaj! Opevnění Bělehradu oslabeno, +10 bojovníků, morálka +20!',
    fApply: g => {
      const r = { ...g.regions };
      if (r.belehrad) r.belehrad = { ...r.belehrad, garrison: Math.max(2, r.belehrad.garrison - 3), fortified: false };
      if (r.vych) r.vych = { ...r.vych, garrison: Math.max(0, r.vych.garrison - 2), control: Math.min(5, r.vych.control + 2) };
      return {
        ...g,
        regions: r,
        redArmy: true,
        fighters: g.fighters + 10,
        morale: Math.min(100, g.morale + 20)
      };
    },
    hTitle: 'Příchod Rudé armády – 3. ukrajinský front',
    hText: 'Po kapitulaci Rumunska a Bulharska v srpnu a září 1944 se otevřela východní brána do Srbska. Maršál Tolbuchin s jednotkami 3. ukrajinského frontu a 57. armády překročil srbskou hranici. Tito v Moskvě podepsal se Stalinem dohodu, podle níž měla sovětská vojska po osvobození Bělehradu pokračovat v postupu na Budapešť a správu předat partyzánským orgánům. Masivní sovětské tankové kolony T-34 a salvové raketomety Kaťuša definitivně zlomily německou převahu v těžkých zbraních.',
    quote: {
      text: '„Vítáme bratrské sovětské vojáky jako spojence v našem čtyřletém boji za svobodu.“',
      author: 'Provolání Hlavního štábu NOVJ'
    }
  },
  {
    n: 12,
    date: '14.–20. října 1944',
    short: '⭐ Belgradská operace – Finální osvobození!',
    hist: true,
    fLog: '⭐ 20. 10. 1944: BELGRADSKÁ OFENZÍVA! Společný útok sovětských tanků a 1. armádního sboru NOVJ. Čas rozhodujícího vítězství!',
    fApply: g => {
      const r = { ...g.regions };
      if (r.belehrad) r.belehrad = { ...r.belehrad, garrison: Math.max(1, r.belehrad.garrison - 2) };
      return { ...g, regions: r, morale: Math.min(100, g.morale + 10) };
    },
    hTitle: 'Belgradská operace (14.–20. října 1944)',
    hText: 'Společná ofenzíva 4. gardového mechanizovaného sboru generála Ždanova a partyzánských divizí pod velením Peka Dapčeviće začala 14. října. Německá armádní skupina F pod polním maršálem von Weichsem přeměnila Bělehrad v pevnou tvrz se zaminovanými budovami a dělostřeleckými hnízdy v pevnosti Kalemegdan. Šest dní zuřily divoké pouliční boje o každou ulici a dům. 20. října v poledne byla na paláci Albanija vztyčena jugoslávská vlajka s rudou hvězdou. Německé panství na Balkáně bylo rozdrceno.',
    quote: {
      text: '„Bělehrad je svobodný! Čtyři roky nezkrotného odboje přinesly své ovoce.“',
      author: 'Rozhlasové hlášení Svobodné Jugoslávie, 20. 10. 1944'
    }
  }
];

export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'rep',
    name: 'Německé odvetné popravy',
    log: '💀 Německé odvetné popravy civilistů v okupovaných městech. Morálka klesá o 12.',
    apply: g => ({ ...g, morale: Math.max(0, g.morale - 12) })
  },
  {
    id: 'vol',
    name: 'Příval dobrovolníků',
    log: '💪 Vlna mladých dobrovolníků vstupuje do oddílů. +5 bojovníků, morálka +5.',
    apply: g => ({ ...g, fighters: g.fighters + 5, morale: Math.min(100, g.morale + 5) })
  },
  {
    id: 'food',
    name: 'Vesnická solidarita',
    log: '🌾 Rolníci v horách ukryli obilí před Wehrmachtem a předali je partyzánům. +3 zásoby.',
    apply: g => ({ ...g, resources: Math.min(20, g.resources + 3) })
  },
  {
    id: 'chA',
    name: 'Přeběhlíci od četníků',
    log: '🤝 Část četnického oddílu odmítla kolaboraci a přidala se k partyzánům: +3 bojovníci, +1 kontrola v horách.',
    apply: g => {
      const r = { ...g.regions };
      ['zap', 'jiz'].forEach(id => {
        if (r[id] && r[id].control >= 0) r[id] = { ...r[id], control: Math.min(5, r[id].control + 1) };
      });
      return { ...g, regions: r, fighters: g.fighters + 3 };
    }
  },
  {
    id: 'chB',
    name: 'Četnická zrada',
    log: '💔 Četnická zrada: polní lazaret prozrazen Němcům. Ztráta základny a 3 bojovníků.',
    apply: g => {
      const r = { ...g.regions };
      const t = ['zap', 'jiz'].find(id => r[id]?.bases > 0);
      if (t && r[t]) r[t] = { ...r[t], bases: Math.max(0, r[t].bases - 1) };
      return { ...g, regions: r, fighters: Math.max(0, g.fighters - 3) };
    }
  },
  {
    id: 'ty',
    name: 'Tyfová nákaza',
    log: '🤒 Epidemie skvrnitého tyfu v partyzánských lazaretech: -4 bojovníci, morálka -5.',
    apply: g => ({ ...g, fighters: Math.max(0, g.fighters - 4), morale: Math.max(0, g.morale - 5) })
  },
  {
    id: 'bbc',
    name: 'Vysílání BBC z Londýna',
    log: '📻 Rozhlas BBC v srbochorvatštině vyzdvihuje statečnost Titových partyzánů. Morálka obyvatelstva +8.',
    cond: g => g.turn >= 4,
    apply: g => ({ ...g, morale: Math.min(100, g.morale + 8) })
  },
  {
    id: 'ger',
    name: 'Německé posily z Říše',
    log: '🪖 Wehrmacht přisunul motorizovaný prapor z Maďarska: posádka v jedné oblasti posílena o +2.',
    apply: g => {
      const r = { ...g.regions };
      const ids = Object.keys(r).filter(id => r[id].control <= 0 && id !== 'belehrad');
      const t = ids[Math.floor(Math.random() * ids.length)];
      if (t && r[t]) r[t] = { ...r[t], garrison: Math.min(6, r[t].garrison + 2) };
      return { ...g, regions: r };
    }
  },
  {
    id: 'ussr',
    name: 'Zásilka z Kavkazu',
    log: '🚂 Spojenecká zásilka munice a spojovací techniky dorazila přes Turecko: +3 zásoby.',
    cond: g => g.turn >= 8,
    apply: g => ({ ...g, resources: Math.min(20, g.resources + 3) })
  }
];

export const CARDS_DATA: Card[] = [
  {
    id: 'atk',
    name: 'Partyzánský útok',
    icon: '⚔️',
    cost: 2,
    n: 3,
    reg: true,
    ac: '#991b1b',
    desc: 'Přímý útok na nepřátelskou posádku. Hod d6 + terénní modifikátor + polovina bojovníků vs německý hod + posádka.',
    historicalFlavor: 'Bleskový přepad ze zálohy na německé opěrné body, silniční konvoje a stanice četnictva.'
  },
  {
    id: 'sab',
    name: 'Záškodnická sabotáž',
    icon: '💣',
    cost: 1,
    n: 3,
    reg: true,
    ac: '#b45309',
    desc: 'Podminování železnice, mostu či skladu. Hod d6 + terén ≥ 4 sníží německou posádku o 2. Ve Středním Srbsku +2 zásoby.',
    historicalFlavor: 'Ničení strategických tratí Bělehrad–Soluň a sabotáže ve vojenských zbrojovkách v Kragujevaci.'
  },
  {
    id: 'rec',
    name: 'Všeobecný nábor',
    icon: '👥',
    cost: 0,
    n: 3,
    reg: false,
    ac: '#15803d',
    desc: 'Získáte +4 bojovníky plus +1 navíc za každou oblast s vaší kontrolou (kontrola ≥ +1).',
    historicalFlavor: 'Mobilizace venkovské mládeže a formování nových brigád Národně osvobozenecké armády.'
  },
  {
    id: 'bas',
    name: 'Výstavba základny',
    icon: '🏕️',
    cost: 2,
    n: 2,
    reg: true,
    ac: '#047857',
    desc: 'Zřídí partyzánskou základnu v oblasti (dává +2 k obraně). Nutná kontrola ≥ 0. V horách získáte +1 obranu navíc.',
    historicalFlavor: 'Budování podzemních bunkrů, polních nemocnic a skladišť střeliva v nepřístupných horských soutěskách.'
  },
  {
    id: 'prp',
    name: 'Agitace a tiskoviny',
    icon: '📢',
    cost: 1,
    n: 2,
    reg: true,
    ac: '#1d4ed8',
    desc: 'Morálka +10, kontrola vybrané oblasti +1. Zvyšuje sympatie a podporu civilního obyvatelstva.',
    historicalFlavor: 'Distribuce ilegálních novin Borba a letáků vyzývajících ke stávkám a pasivnímu odporu.'
  },
  {
    id: 'sup',
    name: 'Letecký shoz zásob',
    icon: '✈️',
    cost: 0,
    n: 2,
    reg: false,
    ac: '#0369a1',
    desc: 'Získáte +5 zásob a +2 bojovníky. Noční shoz britské RAF z italských letišť.',
    historicalFlavor: 'Padákové kontejnery s lehkými kulomety Bren, samopaly Sten a chirurgickými léky od SOE.'
  },
  {
    id: 'int',
    name: 'Výzvědná síť v Abwehru',
    icon: '🕵️',
    cost: 1,
    n: 2,
    reg: false,
    ac: '#7e22ce',
    desc: 'Zmatení německého štábu a odhalení plánů: celá příští německá akční fáze je zcela přeskočena!',
    historicalFlavor: 'Partyzánští agenti a informátoři v Nedićově správě a německých okupačních velitelstvích.'
  },
  {
    id: 'dip',
    name: 'Spojenecká mise SOE',
    icon: '🤝',
    cost: 1,
    n: 2,
    reg: false,
    ac: '#a16207',
    desc: 'Získáte +4 bojovníky, trvale aktivuje britskou pomoc (+2 zásoby od tahu 9) a zvýší kontrolu v horách.',
    historicalFlavor: 'Příjezd britské vojenské mise v čele s Fitzroyem Macleanem, který přesvědčil Churchilla k plné podpoře Tita.'
  }
];

export const HISTORICAL_PERSONS: PersonProfile[] = [
  {
    id: 'tito',
    name: 'Josip Broz Tito',
    role: 'Vrchní velitel Partyzánů, Maršál Jugoslávie',
    faction: 'Partyzáni',
    bio: 'Chorvatsko-slovinský revolucionář a generální tajemník Komunistické strany Jugoslávie. Dokázal vybudovat nejúčinnější a nejpočetnější partyzánskou armádu v celé okupované Evropě (až 800 000 bojovníků v roce 1945). Zraněn na Sutjesce, unikl při výsadku na Drvar.',
    impact: 'Získal mezinárodní uznání na Teheránské konferenci, osvobodil Jugoslávii z velké části vlastními silami a stal se vůdcem poválečné socialistické federace.',
    quote: '„Hranice Jugoslávie nebyly stanoveny na konferenčních stolech, ale byly vykoupeny krví našich národů.“'
  },
  {
    id: 'mihailovic',
    name: 'Dragoljub „Draža“ Mihailović',
    role: 'Vůdce Jugoslávského vojska ve vlasti (Četníci)',
    faction: 'Četníci',
    bio: 'Důstojník královské armády, který v květnu 1941 odmítl kapitulaci a na Ravné Goře zorganizoval četnické oddíly. Zpočátku podporován Spojenci a jmenován ministrem války exilové vlády. Kvůli obavám z německých odvet a strachu z komunismu však četníci postupně přešli k dohodám s Italy a loutkovou Nedićovou vládou v boji proti partyzánům.',
    impact: 'Ztráta podpory Spojenců v roce 1943. Po válce souzen a v roce 1946 popraven v Bělehradě za válečné zločiny a kolaboraci.',
    quote: '„Kdo bojuje s Němci nyní, přináší zkázu srbským vesnicím.“'
  },
  {
    id: 'nedic',
    name: 'Milan Nedić',
    role: 'Předseda loutkové „Vlády národní spásy“',
    faction: 'Německo / Kolaboranti',
    bio: 'Předválečný generál a ministr obrany, který v srpnu 1941 přijal nabídku německé vojenské správy stát se v čele kolaborantské vlády v okupovaném Srbsku. Založil Srbskou státní stráž a aktivně se podílel na potlačování odboje.',
    impact: 'Zodpovědný za pronásledování antifašistů a účast na holokaustu srbských Židů a Romů. Uprchl s Němci v říjnu 1944.',
    quote: '„Spolupráce s Německem je jedinou cestou k biologickému přežití srbského národa.“'
  },
  {
    id: 'maclean',
    name: 'Sir Fitzroy Maclean',
    role: 'Velitel britské vojenské mise SOE',
    faction: 'Spojenci',
    bio: 'Skotský diplomat, voják a poslanec, kterého Winston Churchill vysadil padákem k Titovi v září 1943. Maclean strávil s partyzány měsíce v bosenských horách a stal se jejich klíčovým advokátem v Londýně.',
    impact: 'Jeho objektivní hlášení definitivně obrátila britskou i americkou politiku od nečinných četníků k bojujícím partyzánům. Údajná předloha pro postavu Jamese Bonda.',
    quote: '„Tito se svými partyzány poutá v Jugoslávii víc německých divizí než všechny spojenecké armády v Itálii dohromady.“'
  },
  {
    id: 'tolbuchin',
    name: 'Fjodor Tolbuchin',
    role: 'Maršál SSSR, velitel 3. ukrajinského frontu',
    faction: 'Rudá armáda',
    bio: 'Zkušený sovětský vojevůdce ze stalingradské bitvy a krymské operace. Na podzim 1944 vedl vojska 3. ukrajinského frontu přes Bulharsko a Rumunsko do východního Srbska.',
    impact: 'Jeho těžké tankové a mechanizované jednotky prolomily opevnění Bělehradu a spolu s jugoslávským 1. armádním sborem město 20. října 1944 osvobodily.',
    quote: '„Osvobození Bělehradu je triumfem bratrství sovětských a jugoslávských zbraní.“'
  },
  {
    id: 'radic',
    name: 'Lepa Radić',
    role: 'Partyzánská hrdinka a ošetřovatelka (17 let)',
    faction: 'Partyzáni',
    bio: 'Mladá bosenská dívka, která vstoupila do Kozarského partyzánského oddílu v 15 letech. V únoru 1943 během operace Weiss kryla ústup raněných a uprchlíků. Po vystřílení veškerého střeliva byla zajata 7. divizí SS Prinz Eugen.',
    impact: 'Navzdory krutému mučení odmítla prozradit jména svých spolubojovníků. Těsně před oběšením vykřikla na shromážděný lid: „Bojujte! Moji soudruzi mě pomstí!" V roce 1951 posmrtně vyznamenána jako Hrdinka lidu Jugoslávie.',
    quote: '„Nejsem zrádce. Mí soudruzi se představí sami, až vás přijdou vyhladit do jednoho!“'
  }
];

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'NOVJ (Národně osvobozenecká armáda Jugoslávie)',
    definition: 'Oficiální název partyzánských ozbrojených sil pod velením Josipa Broze Tita. V roce 1944 čítala přes 400 000 a v květnu 1945 až 800 000 organizovaných vojáků.',
    category: 'Vojenské'
  },
  {
    term: 'Četníci (Ravnogorské hnutí)',
    definition: 'Královští srbští nacionalisté pod vedením generála Draži Mihailoviće. Původně odbojáři, postupně však kvůli nenávisti ke komunistům a strachu z německých represí uzavírali kolaborační dohody s Italy a Wehrmachtem.',
    category: 'Vojenské'
  },
  {
    term: 'AVNOJ',
    definition: 'Antifašistická rada národního osvobození Jugoslávie. Politický parlament odboje, který v Bihaći (1942) a Jajci (1943) vyhlásil vytvoření budoucí demokratické a federativní Jugoslávie.',
    category: 'Politické'
  },
  {
    term: 'Operace Strafgericht (Trestný soud)',
    definition: 'Kódový název pro ničivé německé bombardování nechráněného Bělehradu 6.–9. dubna 1941, které zahájilo nacistickou invazi a zabilo tisíce civilistů.',
    category: 'Vojenské'
  },
  {
    term: 'Folksdojčeři (Volksdeutsche)',
    definition: 'Příslušníci etnické německé menšiny žijící v Banátu a Vojvodině. Mnozí z nich vstoupili do dobrovolnické horské divize zbraní SS „Prinz Eugen“, proslulé mimořádnou brutalitou vůči civilistům.',
    category: 'Politické'
  },
  {
    term: 'SOE (Special Operations Executive)',
    definition: 'Britská zpravodajská a sabotážní služba založená Churchillem s pokynem „podpálit Evropu“. Koordinovala shozy zbraní a vysílala styčné důstojníky k Titovi.',
    category: 'Vojenské'
  },
  {
    term: 'Užická republika',
    definition: 'První osvobozené území v nacisty okupované Evropě (září–prosinec 1941) v západním Srbsku, se samosprávou, tiskovinami a výrobou zbraní.',
    category: 'Geografické'
  },
  {
    term: 'Ustašovci',
    definition: 'Fašistické chorvatské hnutí vedené Ante Pavelićem v Nezávislém státě Chorvatsko (NDH), které provádělo genocidu Srbů, Židů a Romů v táboře Jasenovac.',
    category: 'Politické'
  }
];

export const HISTORICAL_DILEMMAS: HistoricalDilemma[] = [
  {
    id: 'dilemma_1',
    title: 'Jednání s četníky na Ravné Goře (Podzim 1941)',
    situation: 'Tito se v říjnu 1941 setkává na samotě Brajići s Dražou Mihailovićem. Četníci požadují zastavení všech akcí proti městům, protože Wehrmacht střílí 100 rukojmích za 1 Němce. Partyzáni chtějí společný útok na Kragujevac a Čačak.',
    historicalContext: 'Historicky dohoda selhala. Tito trval na aktivním boji za každou cenu, zatímco Mihailović považoval odpor za biologickou sebevraždu srbského národa.',
    options: [
      {
        text: 'Trvat na nekompromisním boji bez ohledu na hrozbu represálií',
        historicalChoice: true,
        consequence: 'Historická volba! Partyzáni si udržují iniciativu a morálku, ale ztrácí naději na spojenectví s královskými důstojníky.',
        apply: g => ({
          state: { ...g, morale: Math.min(100, g.morale + 8), fighters: g.fighters + 3 },
          logMsg: '📜 Dilema Brajići: Zvolen nekompromisní boj! Morálka +8, bojovníci +3.'
        })
      },
      {
        text: 'Uzavřít kompromis: dočasně omezit útoky na velká města výměnou za četnické zbraně',
        historicalChoice: false,
        consequence: 'Alternativní cesta: Četníci vám poskytnou část zásob z britských shozů, ale část partyzánských velitelů vnímá ústupky jako slabost.',
        apply: g => ({
          state: { ...g, resources: Math.min(20, g.resources + 4), morale: Math.max(0, g.morale - 4) },
          logMsg: '📜 Dilema Brajići: Kompromis s četníky přinesl +4 zásoby, ale morálka klesla o 4.'
        })
      }
    ]
  },
  {
    id: 'dilemma_2',
    title: 'Osud raněných na řece Neretvě (Březen 1943)',
    situation: 'Partyzánská hlavní kolona se 4 000 raněnými a nemocnými tyfem je sevřena v hlubokém kaňonu řeky Neretvy. Ze severu útočí Němci, z jihu četníci a Italové. Někteří velitelé navrhují zanechat nepohyblivé raněné v jeskyních.',
    historicalContext: 'Tito kategoricky odmítl zanechat raněné napospas nepříteli: „Partyzán nikdy neopouští svého raněného druha!" Tento etický princip vytvořil legendární morální soudržnost hnutí.',
    options: [
      {
        text: '„Nikoho nenecháme za sebou!" Prolomit obklíčení i s nosítky s raněnými.',
        historicalChoice: true,
        consequence: 'Historická volba! Prolomení stálo obrovské úsilí a zásoby, ale záchrana raněných vdechla armádě nezdolnou víru.',
        apply: g => ({
          state: { ...g, morale: Math.min(100, g.morale + 15), resources: Math.max(0, g.resources - 3) },
          logMsg: '📜 Dilema Neretva: Ranění zachráněni! Legendární morální vítězství: Morálka +15, zásoby -3.'
        })
      },
      {
        text: 'Skrýt nejtěžší pacienty u spřátelených pastevců a vyrazit rychlým pochodem',
        historicalChoice: false,
        consequence: 'Ušetříte zásoby a zrychlíte přesun, ale ztráta spolubojovníků těžce zasáhne srdce partyzánů.',
        apply: g => ({
          state: { ...g, fighters: g.fighters + 4, morale: Math.max(0, g.morale - 10) },
          logMsg: '📜 Dilema Neretva: Taktický únik bez zátěže: +4 bojovníci zachráněni, morálka -10.'
        })
      }
    ]
  }
];
