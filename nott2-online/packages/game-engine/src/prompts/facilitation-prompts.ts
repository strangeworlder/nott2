/**
 * @nott2/game-engine — Facilitation Prompts & Playset Coupling
 *
 * Provides Playset metadata, Archetype & Prologue sparks, Camera Crew sensory
 * questions, "Something's Not Right..." escalations, Act-scaled Overexertion
 * sacrifices, and Effort 1–4 post-roll narration prompts.
 *
 * Every spark pool provides 9 concrete takes (3 pages of 3 takes) so players
 * can click "New Takes" in `<ScriptSparks>` whenever they want fresh ideas.
 */

import type { Suit, Act, EffortLevel, RulesModules } from '../types';

export interface PlaysetDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  touchstones: readonly string[];
  defaultModules: RulesModules;
  archetypes: Record<Suit, readonly string[]>;
  prologueWhyHereSparks: Record<Suit, readonly string[]>;
}

export const PLAYSETS: Record<string, PlaysetDefinition> = {
  default: {
    id: 'default',
    name: 'Generic Slasher',
    tagline: 'Wrong place. Wrong time. No way out.',
    description:
      'A classic isolated slasher nightmare—abandoned houses, dead phone lines, and a relentless killer in the shadows.',
    touchstones: ['Halloween', 'Scream', 'The Texas Chain Saw Massacre', 'You’re Next'],
    defaultModules: { classicSetup: false, finalGirl: false },
    archetypes: {
      Spades: ['The Jock', 'The Protective', 'The Townie', 'The Greaser', 'The Sheriff’s Kid'],
      Hearts: ['The Babysitter', 'The Final Them', 'The Sibling', 'The Atoner', 'The New Kid'],
      Clubs: ['The Genre Savant', 'The Skeptic', 'The Bookworm', 'The Reporter', 'The Loner'],
      Diamonds: ['The Rebel', 'The Class Clown', 'The Cheerleader', 'The Rich Kid', 'The Thief'],
    },
    prologueWhyHereSparks: {
      Spades: [
        'I promised someone here I’d have their back—and I don’t break my word.',
        'I was hired to haul gear and lock up the property, not realizing we weren’t alone.',
        'I came to settle an old score with someone in this group before the night is over.',
        'My truck was the only vehicle big enough to carry everyone’s supplies out to the edge of town.',
        'My older brother or cousin went missing near here last autumn, and the police stopped looking.',
        'I lost a bet I couldn’t afford to pay, so I agreed to act as the muscle for tonight’s trip.',
        'I’m the only local who knows these back roads, and they begged me not to let them go out here blind.',
        'I needed a place to lie low for the night after a fight went too far back in town.',
        'Someone left an anonymous threat on my windshield telling me to show up here if I wanted the truth.',
      ],
      Hearts: [
        'My younger sibling or best friend insisted on coming, and I couldn’t let them go alone.',
        'After the accident last year, I thought getting everyone back together would heal old wounds.',
        'I’m the only one who remembers what happened here before—and I came to find closure.',
        'I’m secretly in love with someone in this group and took any excuse just to spend the night near them.',
        'I felt guilty for drifting apart from the group and wanted one last night together before we all move on.',
        'I promised a dying relative or old friend that I’d retrieve a keepsake left inside this house.',
        'Everyone else was drinking or reckless, and somebody had to be the designated caretaker.',
        'I’ve been having the same nightmare about this place for a month and needed to prove to myself it was just a dream.',
        'Someone in this room knows my worst secret, and I came tonight to beg them to keep quiet.',
      ],
      Clubs: [
        'I found a connection between this place and a string of local disappearances no one else believes.',
        'I’m the only one with the keys, the map, and a working head on my shoulders.',
        'Something about the invitation didn’t add up, and my curiosity wouldn’t let me stay home.',
        'I’m writing an article or true-crime podcast episode on the town’s cold cases and needed photos of the interior.',
        'I inherited a mysterious key and a deed parcel number that traced back to this exact address.',
        'I noticed someone tailing our friend group all week and came along to figure out who is watching us.',
        'I came to test radio or recording equipment in a dead zone away from town interference.',
        'I found my family’s name in the old county inquest records for this property and had to see why.',
        'Everyone else thinks the urban legend is a joke—I came to prove the physical evidence is real.',
      ],
      Diamonds: [
        'I heard this place was off-limits and couldn’t resist throwing an after-hours dare.',
        'There’s something valuable locked inside this property, and tonight was my only chance to grab it.',
        'I was trying to impress the last person in this room who should ever trust me.',
        'I needed an alibi for where I was earlier tonight, and tagging along with this group was the perfect cover.',
        'I swiped the keys from a family member’s desk just to prove I could get us inside.',
        'I’m running from a debt back in town and needed somewhere off the grid to stash what I took.',
        'I planned a harmless scare to prank the group—until I realized someone else was already in the house.',
        'I was promised a cut of cash if I unlocked the back gate and asked no questions.',
        'Honestly? I was bored out of my skull and thought a condemned house sounded like a good story.',
      ],
    },
  },

  summercamp: {
    id: 'summercamp',
    name: 'Summer Camp Massacre',
    tagline: 'Counselors, cabins, and blood in the lake.',
    description:
      'Camp Pinewood is closed for the storm—miles of black pines, rotting docks, and an old curse rising from the water.',
    touchstones: ['Friday the 13th', 'Sleepaway Camp', 'The Burning', 'Fear Street: 1978'],
    defaultModules: { classicSetup: false, finalGirl: true },
    archetypes: {
      Spades: ['The Lifeguard', 'The Groundskeeper', 'The Varsity Counselor', 'The Woodcraft Lead'],
      Hearts: ['The First-Year Counselor', 'The Camp Nurse’s Aide', 'The Older Sibling', 'The Local Kid'],
      Clubs: ['The Nature Nerd', 'The Radio Operator', 'The True-Crime Fanatic', 'The Historian'],
      Diamonds: ['The Prankster', 'The Head Counselor’s Favorite', 'The Petty Thief', 'The Slack-Off'],
    },
    prologueWhyHereSparks: {
      Spades: [
        'I stayed behind after the buses left to board up the boathouse before the storm hit.',
        'The Camp Director paid me double in cash to clear the fallen pines off the access road.',
        'Someone swore they saw a light in the abandoned cabins across the lake, and I volunteered to check.',
        'As head lifeguard, I refused to leave until every canoe and life-raft was hauled above the storm line.',
        'My truck got stuck in the washout by the creek, and I’m the only one strong enough to winch it out at dawn.',
        'I grew up in the town across the lake and took the groundskeeper job to pay off my family’s debts.',
        'I promised a nervous first-year counselor I wouldn’t let them close up the cabins by themselves.',
        'I was on night-watch duty after someone vandalized the archery shed two nights ago.',
        'I came back up the trail to look for a counselor who never got on the last bus out.',
      ],
      Hearts: [
        'Someone close to me drowned in this lake years ago, and this was my first summer brave enough to return.',
        'A younger counselor was terrified of staying at the camp overnight alone, so I swapped shifts.',
        'I’m trying to hold this friend group together for one last summer before everyone leaves town.',
        'I work in the camp infirmary and stayed behind to pack up the medical supplies before the roof leaked.',
        'I was on swim-watch the afternoon a camper nearly went under, and the guilt hasn’t let me sleep since.',
        'Camp Pinewood was the only place I ever felt like I belonged—until the storm rolled in tonight.',
        'I stayed to have one honest conversation with someone in this group before summer ends forever.',
        'I found a child’s old camp bracelet washed up on the beach today and felt compelled to find out whose it was.',
        'My parents met at this camp thirty years ago, and they made me promise to look after the place.',
      ],
      Clubs: [
        'I found the old 1979 camp logbooks hidden under the floorboards and needed to see what the staff covered up.',
        'The weather radio warned the gorge bridge would flood, and I came up to get everyone evacuated.',
        'I noticed supplies vanishing from the camp pantry all week and stayed to catch who was taking them.',
        'I was charting water samples from the cove and found traces of blood and oil near the sunken dock.',
        'I’m the only counselor who knows how to run the backup generator and the shortwave radio.',
        'I discovered an unmarked cabin on the original 1958 property survey that doesn’t appear on the camp map.',
        'I stayed behind to develop the summer’s darkroom photos—and saw a figure standing in the trees in every background shot.',
        'I tracked a set of heavy bootprints from the girls’ cabins straight to the old root cellar.',
        'The Camp Director left in a sudden panic this afternoon and forgot the master keys on the office desk.',
      ],
      Diamonds: [
        'With the campers gone, we had the whole lake, the canoes, and the keys to the canteen to ourselves.',
        'I snuck back into camp to retrieve something incriminating I hid under Cabin 4.',
        'I made a bet that I could spend a night at the Old Point without chickening out.',
        'I lifted the keys to the Camp Director’s station wagon and planned on taking a joyride once the rain stopped.',
        'I was supposed to leave on the afternoon bus, but I fell asleep in the boathouse loft and missed it.',
        'I staged a ghost story by the dock to scare the rookies—until the real blood showed up.',
        'I’m hiding out at camp because the county sheriff is looking for me back in town.',
        'I heard the camp safe in the main lodge still had the season’s petty cash locked inside.',
        'I talked someone into sneaking out to the archery range after curfew, and now we’re both trapped in the storm.',
      ],
    },
  },
};

export function getPlaysetInfo(playsetId = 'default'): PlaysetDefinition {
  return PLAYSETS[playsetId] ?? PLAYSETS.default;
}

export function getAvailablePlaysets(): PlaysetDefinition[] {
  return [PLAYSETS.default, PLAYSETS.summercamp];
}

// ── Camera Crew Sensory Sparks (Suit × Act × Playset — 9 takes per pool) ─────

export function getCameraSparks(
  suit: Suit | null,
  act: Act,
  playsetId = 'default',
): readonly string[] {
  const isCamp = playsetId === 'summercamp';

  if (act === 1) {
    switch (suit) {
      case 'Spades':
        return isCamp
          ? [
              'What does the wet pine and rusted iron smell like in here?',
              'How dark is the treeline beyond the lantern’s reach?',
              'What heavy object in this cabin looks like it could fall at any second?',
              'Where is the rain leaking through the roof onto the floorboards right now?',
              'What rusted camp tool is hanging on the wall just out of arm’s reach?',
              'How cold is the draft blowing up through the gaps in the cabin floor?',
              'What sound does the wind make as it scrapes the pine branches against the roof?',
              'Whose muddy bootprints are already tracked across this doorway?',
              'Why does this cramped space feel like it was built to lock something inside?',
            ]
          : [
              'What does the air smell like in this enclosed space?',
              'How dark is the room beyond your immediate reach?',
              'What heavy detail in the environment makes this feel like a trap?',
              'What is dripping or rattling in the ceiling directly above their shoulder?',
              'Which piece of furniture looks like it was shoved out of place in a struggle?',
              'Where is the only light source coming from, and why is it starting to flicker?',
              'What cold metal or splintered wood is their hand resting against right now?',
              'How narrow is the gap they have to squeeze or force their way through?',
              'What everyday object in the corner suddenly looks like a weapon—or a hazard?',
            ];
      case 'Hearts':
        return [
          'How close does the Killer feel right now—even if you can’t see them?',
          'Whose shadow or reflection looks slightly wrong in the dim light?',
          'What quiet sound makes the silence between you feel unbearable?',
          'What personal item belonging to a friend is lying abandoned on the floor here?',
          'How can we tell from their breathing or hands that they are barely holding it together?',
          'Where in the background of this shot is a doorway or curtain standing slightly open?',
          'What familiar scent or memory makes this room feel hauntingly wrong?',
          'Who at the table is standing furthest from the group without realizing it?',
          'What tiny movement at the edge of the frame makes you question if you’re alone?',
        ];
      case 'Clubs':
        return [
          'What small detail in the room looks like someone touched it five minutes ago?',
          'Is it pitch black, or is there a flickering light distorting the view?',
          'What smells out of place—copper, smoke, damp earth, or stagnant water?',
          'What piece of machinery or wiring is humming, sparking, or dead silent when it shouldn’t be?',
          'Where do the scratches or drag-marks on the floor seem to point?',
          'What written note, label, or date on the wall catches the edge of the flashlight beam?',
          'Why does the layout of this room feel like someone prepared it ahead of time?',
          'What tool or instrument is missing from the rack where it’s supposed to hang?',
          'What subtle clue tells the table the Killer has been standing in this exact spot?',
        ];
      case 'Diamonds':
      default:
        return [
          'Who else is in the shot, and where are they looking when this happens?',
          'How far carries the sound of your movement through the quiet?',
          'What fragile or treacherous surface are you standing on right now?',
          'What loose object on the shelf or floor is one bump away from crashing down?',
          'How tight is the hiding spot or ledge they are trying to navigate?',
          'Where is the nearest cover if the door bursts open in the next three seconds?',
          'What is snagged on their sleeve, boot, or flashlight cord right now?',
          'How does the beam of light betray their position if they move too fast?',
          'What expression is on the other survivor’s face as they watch this happen?',
        ];
    }
  }

  if (act === 2) {
    switch (suit) {
      case 'Spades':
        return [
          'Where is the fresh blood coming from—and whose is it?',
          'What sound of splintering wood or dragging metal makes you freeze?',
          'What exit that was open in Act 1 is now visibly cut off?',
          'How heavy is the breathing coming from the other side of the barrier?',
          'What makeshift barricade in this room is already buckling under pressure?',
          'Where on their hands or jacket is the dirt and blood from the last scene still wet?',
          'What industrial or camp hazard in this room could maim someone if they slip?',
          'How close are the Killer’s footsteps echoing through the walls right now?',
          'Why is there no way around this obstacle except straight through it?',
        ];
      case 'Hearts':
        return [
          'Who is watching you from the dark—and how do you know they’re there?',
          'What sound makes your heart hammer against your ribs?',
          'Which other survivor looks closest to breaking right now?',
          'What gruesome trace of a previous attack is visible in the corner of the shot?',
          'Why do you suddenly doubt whether the person next to you is telling the whole truth?',
          'Where does the trail of smeared red handprints on the wall end?',
          'What voice or echo in the dark sounds horribly like someone you already lost?',
          'How does the darkness outside the window seem to press in against the glass?',
          'What silent look passes between two survivors who know they might not both make it?',
        ];
      case 'Clubs':
        return [
          'Where is the blood trail leading—toward an exit, or straight toward you?',
          'What detail proves the Killer anticipated this exact move?',
          'What sound makes everyone in the scene stop breathing at once?',
          'How much light or battery power do you actually have left right now?',
          'What piece of the Killer’s handiwork—a cut wire, a wedged latch, a decoy—is sitting right in front of you?',
          'Why is your hands’ trembling making this delicate task ten times harder?',
          'What sound from the next room acts as a ticking clock while you work?',
          'What horrific truth about the Killer’s method becomes undeniable when you look closer?',
          'Where is the one blind spot in this room that your light hasn’t checked yet?',
        ];
      case 'Diamonds':
      default:
        return [
          'Who is standing closest to the dark corner—and why haven’t they moved?',
          'What sound makes you freeze mid-step?',
          'Where is the blood coming from that you just stepped in?',
          'How close did the Killer’s last swing or shadow pass to your head?',
          'What slick patch of water, oil, or blood threatens to take your feet out from under you?',
          'Why would making a single sound right now be a death sentence for the group?',
          'What vital item is lying on the floor just two steps closer to the danger?',
          'Where is the Killer’s silhouette visible through the slats, cracks, or trees?',
          'Who is about to get left behind if this move takes two seconds too long?',
        ];
    }
  }

  // Act 3 — Climax (9 takes)
  return [
    'Why does it feel like there is no hope of rescue left?',
    'What part of your body hurts the most as you push yourself to move?',
    'How do you know—deep in your gut—that one wrong breath means death?',
    'What wreckage of the earlier scenes surrounds you in this final arena?',
    'How close is the Killer’s breathing in the dark right behind you?',
    'What does the blood, smoke, or rain taste like as you gasp for air?',
    'Whose memory or lost friend flashes through your mind before you act?',
    'Where is the only sliver of dawn, firelight, or moonlit water cutting through the black?',
    'Why is this exact second the point of no return for everyone still breathing?',
  ];
}

// ── Escalation Sparks ("Something's Not Right..." — 9 takes per pool) ────────

export function getEscalationSparks(
  suit: Suit | null,
  act: Act,
  playsetId = 'default',
): readonly string[] {
  const isCamp = playsetId === 'summercamp';

  if (suit === 'Spades') {
    return isCamp
      ? [
          'Something’s not right... the cabin boards have been nailed shut from the outside while you were talking.',
          'Something’s not right... the water rising around your boots is slick with outboard fuel.',
          'Something’s not right... the tool you reached for to pry it open has a snapped handle smeared with blood.',
          'Something’s not right... the heavy chain on the boathouse gate isn’t rusted—it was padlocked five minutes ago.',
          'Something’s not right... the support beam you’re bracing against has been sawed three-quarters through.',
          'Something’s not right... there’s a second set of wet bootprints right behind yours on the dock planks.',
          'Something’s not right... the rope you’re hauling on comes up frayed and dripping with dark red.',
          'Something’s not right... the storm shutter you just pried open reveals bricked-up timber and a waiting snare.',
          'Something’s not right... the floorboards beneath the barrier are soaked in kerosene and starting to smoke.',
        ]
      : [
          'Something’s not right... the latch wasn’t broken by age—it’s been wedged shut from the other side just now.',
          'Something’s not right... the floor beneath your feet is slick with something warm and metallic.',
          'Something’s not right... the only tool within reach has already been sabotaged.',
          'Something’s not right... the hinges on this door have been unscrewed so the whole frame collapses inward when pulled.',
          'Something’s not right... razor wire or broken glass has been taped along the underside of the handle.',
          'Something’s not right... the heavy obstacle blocking the hall is moving slightly—someone is bracing it from the dark.',
          'Something’s not right... the cellar stairs beneath your boots have had their risers sawed through to give way.',
          'Something’s not right... the smell of leaking gas is thick enough that a single metal spark could ignite the room.',
          'Something’s not right... the deadbolt you just threw locks into an empty strike-plate—the door won’t hold a single shove.',
        ];
  }

  if (suit === 'Hearts') {
    return isCamp
      ? [
          'Something’s not right... the lantern light reveals wet bootprints leading IN from the lake, but none leading out.',
          'Something’s not right... the voice calling for help stops abruptly, replaced by the hiss of an open walkie-talkie.',
          'Something’s not right... the person you thought was standing behind you is actually across the clearing.',
          'Something’s not right... the sleeping bag on the corner bunk isn’t empty—someone has hidden a body under the wool blanket.',
          'Something’s not right... the camp whistle hanging on the peg is still swinging as if someone just brushed past it.',
          'Something’s not right... the reflection in the cabin window shows a masked face standing between two of the counselors.',
          'Something’s not right... the first-aid kit has been gutted, and every bandage is soaked in lake mud.',
          'Something’s not right... the scratching sound isn’t coming from the roof—it’s coming from directly under the bed.',
          'Something’s not right... the flare you just fired into the rain illuminates a figure standing ten feet away on the path.',
        ]
      : [
          'Something’s not right... the door behind the group is now standing two inches ajar, and nobody touched it.',
          'Something’s not right... the breathing you hear in the dark isn’t coming from any of the survivors.',
          'Something’s not right... your shadow on the wall is overlapped by a taller one right behind you.',
          'Something’s not right... the voice calling from the next room is repeating the exact same phrase like a recording.',
          'Something’s not right... the blood dripping from the ceiling is landing on your shoulder while you stand still.',
          'Something’s not right... the closet door you locked ten minutes ago is now unlatched from the inside.',
          'Something’s not right... every family photo on the hallway wall has had the eyes scratched out with a blade.',
          'Something’s not right... when you count the people in the dark, there is one more silhouette than there should be.',
          'Something’s not right... the phone in your hand vibrates with a text sent from inside this very house.',
        ];
  }

  if (suit === 'Clubs') {
    return isCamp
      ? [
          'Something’s not right... the wire wasn’t chewed by animals—it was cut cleanly with a hunting knife minutes ago.',
          'Something’s not right... the map is missing the one trail you’re standing on because it leads to a drop-off.',
          'Something’s not right... the keys on the hook are decoys; the real set is still on the body.',
          'Something’s not right... the generator fuel tank hasn’t run dry—someone poured sugar and lake water down the intake.',
          'Something’s not right... the radio frequency is being jammed by an open mic sitting inside the Killer’s cabin.',
          'Something’s not right... the compass needle is spinning because a heavy steel blade is wedged under the floorboards.',
          'Something’s not right... the camp logbook has tonight’s date already written in at the bottom of the page.',
          'Something’s not right... the tripwire you just spotted is only a decoy for the pit-trap directly beneath your heel.',
          'Something’s not right... the fuse box door is warm, and one of the live wires has been stripped bare to shock whoever reaches in.',
        ]
      : [
          'Something’s not right... there is no ignition cylinder left—the wires have been ripped out by the roots.',
          'Something’s not right... the window you planned to break through is reinforced plexiglass.',
          'Something’s not right... the clue is still warm to the touch—the Killer was standing here seconds ago.',
          'Something’s not right... the breaker switch has been wired to an alarm bell that rings loud enough to echo through the building.',
          'Something’s not right... the key fits the lock, but the cylinder has been packed with snapped steel so it cannot turn.',
          'Something’s not right... the blueprint shows this hallway is a false wall built to funnel intruders into the cellar.',
          'Something’s not right... the flashlight batteries haven’t died—someone slipped paper discs between the contacts.',
          'Something’s not right... the footprints you’ve been tracking loop in a circle right back to the doorway behind you.',
          'Something’s not right... the handwriting on the warning note matches someone who is standing in this room.',
        ];
  }

  // Diamonds or fallback
  return act === 3
    ? [
        'Something’s not right... the Killer isn’t chasing you anymore—they were herding you straight into this room.',
        'Something’s not right... the weapon you were counting on is empty, jammed, or notched to the breaking point.',
        'Something’s not right... smoke is already curling under the only door out of here.',
        'Something’s not right... the floorboards between you and the exit have been greased with oil and blood.',
        'Something’s not right... the ladder rung gives way with a dry crack the instant you put your weight on it.',
        'Something’s not right... the window latch opens, but iron bars have been bolted across the outside frame.',
        'Something’s not right... the Killer is already waiting on the other side of the wall, listening to your footsteps.',
        'Something’s not right... the person you reached out to pull to safety can’t move—their boot is caught in a wire snare.',
        'Something’s not right... the last light source in the room begins to gutter out just as the shadow lunges.',
      ]
    : [
        'Something’s not right... the noise you just made caused a sudden, dead silence from the room above you.',
        'Something’s not right... when you reach into the dark, your fingers brush wet fabric that pulls away.',
        'Something’s not right... the lock turns, but the chain on the other side has been welded or knotted tight.',
        'Something’s not right... the floor beneath the window is covered in dry broken glass that will crunch under any step.',
        'Something’s not right... a tin can string or wind-chime has been hung at head height right across your path.',
        'Something’s not right... the hiding spot you ducked into already has blood pooling in the back corner.',
        'Something’s not right... the ledge you’re edging along is slick with rain and pulling loose from the mortar.',
        'Something’s not right... the keys you just grabbed are tied to a taut fishing line that tugs something heavy in the dark.',
        'Something’s not right... the door you slipped through has no handle on the inside.',
      ];
}

// ── Stakes Guidance & Overexertion Sacrifice Sparks (9 takes per pool) ───────

export function getStakesGuidance(act: Act): string {
  if (act === 1) {
    return 'Act 1 Stakes — Keep the sacrifice grounded: a dropped tool, a twisted ankle, a torn jacket, or getting separated from the person you trust.';
  }
  if (act === 2) {
    return 'Act 2 Stakes — The hunt is on: agree on a genuine, painful loss—a bleeding wound, a destroyed escape route, or leaving someone exposed.';
  }
  return 'Act 3 Stakes — Desperate climax: only terrible sacrifices remain—a crippling injury, your last weapon shattered, or drawing the Killer’s full fury.';
}

export function getSacrificeSparks(
  suit: Suit | null,
  act: Act,
  playsetId = 'default',
): readonly string[] {
  const isCamp = playsetId === 'summercamp';

  if (act === 1) {
    switch (suit) {
      case 'Spades':
        return [
          'I wrench my shoulder forcing it through, leaving my arm numb and throbbing.',
          isCamp
            ? 'I smash through, but my boot plunges into the freezing lake mud and I lose my shoe.'
            : 'I force it open, but I gash my palm deeply on the rusted metal latch.',
          'The noise of forcing it brings down debris that cuts me off from the person behind me.',
          'My pry-bar or heavy tool bends and wedges permanently in the gap—I can’t take it with me.',
          'Splinters and rust tear through my sleeves, leaving my forearms raw and bleeding.',
          'The violent shove knocks the wind out of me, leaving me doubled over and gasping as we move on.',
          'I throw my weight so hard that I crash through onto the floor on the far side, bruising my ribs.',
          'The echoing bang of my effort carries across the property—whatever is out there now knows our exact room.',
          'I hold the barrier open for the others, but it slams back on my wrist before I can slip through cleanly.',
        ];
      case 'Hearts':
        return [
          'I keep from screaming, but my hands are shaking so badly I drop what I was carrying.',
          'I steady myself by backing away—straight into a dark corner isolated from the group.',
          'My panic rubs off on another survivor, sparking an argument that costs us precious time.',
          'I freeze for three agonizing seconds too long, forcing someone else to grab my arm and pull me out.',
          'I bite my tongue hard enough to draw blood just to choke back the cry in my throat.',
          'In my rush to check on a friend, I leave my bag or jacket lying in the middle of the floor.',
          'Tears and sweat blur my vision so badly I stumble into the furniture and knock a lamp over.',
          'I blurt out a harsh accusation in the heat of fear, fracturing the trust between two of us.',
          'My heart is hammering so hard in my ears that I can’t hear the others warning me which way to turn.',
        ];
      case 'Clubs':
        return [
          isCamp
            ? 'I get it working, but my lantern battery dies just as the woods go black.'
            : 'I get the answer I need, but my flashlight shatters on the floor in the rush.',
          'I leave a clear trail—blood on the handle or footprints in the dust—showing where we went.',
          'I have to abandon my pack and supplies to get out before the door closes.',
          'A live spark from the mechanism singes my fingers and fills the air with the smell of ozone.',
          'My glasses or compass crack against the frame as I yank my head back at the last second.',
          'The key snaps off inside the lock cylinder—it opens this once, but we can never lock it behind us.',
          'I spend too long piecing the clue together, and the shadows close in around the hallway exit.',
          'I have to rip the page or map loose in a hurry, losing half the diagram in the dark.',
          'My multi-tool or pocketknife slips into the gap in the floorboards where I can’t reach it.',
        ];
      case 'Diamonds':
      default:
        return [
          'I twist my ankle on the landing—I can still move, but every step is a limp.',
          'I save myself at the cost of burning through another survivor’s trust.',
          isCamp
            ? 'The canoe paddle or walkie-talkie slips into the black water and sinks out of sight.'
            : 'The keys or tool I was holding fly into the dark where we can’t retrieve them now.',
          'My coat catches on a jagged nail and rips open, spilling the contents of my pockets across the floor.',
          'I slip on the slick surface and slam my knee hard against the threshold as I scramble through.',
          'To keep my balance, I have to kick off a shelf or railing that crashes down with a deafening clatter.',
          'I squeeze through the narrow gap first, accidentally knocking the prop loose so it’s harder for the next person.',
          'My palms are scraped raw from sliding down the rough timber or brickwork.',
          'I drop our spare light source down the stairs just to keep both hands free to catch myself.',
        ];
    }
  }

  if (act === 2) {
    switch (suit) {
      case 'Spades':
        return [
          'I tear my muscles pulling free, leaving a trail of bright blood that the Killer can track.',
          'The makeshift weapon or pry-bar I used snaps in half, leaving me empty-handed.',
          'I break through the barrier, but the collapse traps another survivor on the far side.',
          'A jagged shard of glass or rusted iron slices deep into my forearm as I smash the obstacle aside.',
          'I take the full weight of the falling timber across my back so the others can dive clear.',
          'The violent recoil dislocates my thumb or bruises my collarbone, making it agony to grip anything.',
          'I smash the door off its hinges—meaning we have zero cover in the room we just entered.',
          'My boots slip in the blood and mud, sending me crashing face-first into the wall as the path clears.',
          'I spend the last of my stamina holding the Killer’s weight back, leaving my legs shaking like water.',
        ];
      case 'Hearts':
        return [
          'I bite through my own lip to stay silent, tasting blood while my vision tunnels with panic.',
          'I bolt in blind terror and lock the door behind me before realizing someone else is still outside.',
          'The shock leaves me hyperventilating in the open, drawing the Killer’s attention onto me next.',
          'I refuse to let go of a wounded friend’s hand, dragging us both down into the mud and blood.',
          'My scream echoes through the entire property, giving away everyone’s hiding spot at once.',
          'I shove another survivor out of harm’s way and end up cornered on the wrong side of the room.',
          'The horror of what I just saw leaves me shaking so violently I can’t hold a weapon or flashlight steady.',
          'I give up my own hiding place so a terrified friend can squeeze in, leaving myself exposed in the hall.',
          'In the emotional fallout, I confess the one secret that turns the rest of the group against me.',
        ];
      case 'Clubs':
        return [
          'I reach right into the hazard to fix it, burning or slicing my forearm to the bone.',
          isCamp
            ? 'We burn the last flare to see the trail, leaving us in total darkness for the next scene.'
            : 'Shorting the mechanism blows the fuses for the entire floor, plunging us into pitch dark.',
          'I uncover the truth, but the Killer hears me and cuts off our planned escape route.',
          'The chemical or fuel splashes across my hands and coat—making me dangerously flammable near any spark.',
          'I have to jam our best tool into the gears to stop the trap, destroying it completely.',
          'The electrical arc knocks me flat on my back with my ears ringing and my fingers blistered.',
          'While my eyes are glued to the mechanism, the Killer slips past into the room right behind us.',
          'I get the lock open, but the alarm or bell triggers at full volume across the night.',
          'I have to smash the glass with my bare elbow to reach the switch, leaving a trail of crimson drips.',
        ];
      case 'Diamonds':
      default:
        return [
          'I dive clear but slam my ribs against the corner, knocking the wind and fight out of me.',
          'In the scramble, I accidentally pull another survivor into the line of danger.',
          'I have to leave our best piece of gear behind in the Killer’s reach just to slip away.',
          'The blade grazes my shoulder or calf as I twist away, soaking my clothes in hot blood.',
          'I leap the gap, but the plank or rung snaps beneath my heel—no one else can follow the way I came.',
          'My ankle gives out on the slick floor, forcing me to crawl the last ten feet on bleeding knees.',
          'To distract the Killer for one second, I have to hurl our last lantern or radio into the dark.',
          'I slip out of my coat or pack when the Killer grabs it, losing everything I was carrying.',
          'I make it through the window, but the shattered glass cuts a deep line across my cheek and palm.',
        ];
    }
  }

  // Act 3 — Terrible Sacrifices (9 takes)
  return [
    'I take the full brunt of the impact—my leg or arm is badly broken, and I’m barely dragging myself forward.',
    'I destroy the last shelter or barricade behind me so there is nowhere left to hide—only the final fight.',
    'I act as live bait, screaming into the dark so the Killer locks onto me and lets the others breathe.',
    'I drive our last weapon so deep into the barrier or trap that it shatters, leaving me completely unarmed.',
    'I pull the burning debris or collapsing beams down between us, trapping myself in the kill-zone with the monster.',
    'I catch the Killer’s blade with my own forearm or shoulder to stop it from reaching another survivor’s throat.',
    'I use the very last flare, shell, or charge of power right here—after this roll, we have nothing left.',
    'I throw another survivor through the exit and slam the bolt from the inside, facing the dark alone.',
    'Blood loss and exhaustion drop me to my knees; whatever happens next, I can no longer run.',
  ];
}

// ── Post-Roll Outcome Narration & Effort Sparks (9 takes per pool) ───────────

export interface OutcomeFacilitation {
  activePlayerPrompt: string;
  tablePrompt: string;
  sparks: readonly string[];
  sparkTriggerLabel?: string;
  sparkPinnedLabel?: string;
}

export function getOutcomeFacilitation(params: {
  success: boolean;
  effortLevel: EffortLevel | null;
  suit: Suit | null;
  act: Act;
  playsetId?: string;
}): OutcomeFacilitation {
  const { success, effortLevel, suit, playsetId = 'default' } = params;
  const isCamp = playsetId === 'summercamp';

  if (effortLevel === 'controlled') {
    const controlledSparks: readonly string[] = success
      ? [
          'You time your movement between heartbeats, slipping past the hazard without leaving a single trace.',
          'Your hands stay steady on the mechanism—it gives way with a quiet click just when you need it to.',
          'You brace your weight cleanly and clear the obstacle before the shadows can close in.',
          'You spot the danger half a second early and guide the others around it with a silent hand signal.',
          'You keep your breathing slow and deliberate, refusing to let the darkness rattle your focus.',
          'A practiced motion from your everyday life kicks in automatically, getting you through unscathed.',
          'You use the environment’s own leverage so the barrier yields without a sound.',
          'You lock eyes with the other survivors and nod—for this one moment, you are in complete control.',
          'You step back into cover just as the light flickers, holding onto everything you brought into the scene.',
        ]
      : [
          'You realize the attempt won’t work in time and pull back cleanly before anyone gets hurt.',
          'The barrier refuses to budge, but you muffle the sound so you don’t draw the Killer to your position.',
          'You shield another survivor with your own body as the plan falls apart, keeping them out of harm’s way.',
          'Your fingers slip off the target at the last instant, but you catch your balance on the way back.',
          'You swallow your frustration and retreat into the shadows with your gear and composure intact.',
          'The clue or mechanism stays locked, yet you carefully cover your tracks so the Killer doesn’t know you tried.',
          'You call off the attempt a split-second before the trap can spring on the group.',
          'Even though the door stays shut, you steady the most panicked survivor beside you before moving on.',
          'You take a Controlled step back into the dark—alive, unhurt, and already looking for the next angle.',
        ];
    return {
      activePlayerPrompt: success
        ? '1 — Controlled Effort (Success): You kept your cool. Narrate how you overcome the challenge cleanly, on your own terms.'
        : '1 — Controlled Effort (Failure): Even in failure, you keep your composure. Narrate a tragic, narrow miss where you protect your dignity or shield the group.',
      tablePrompt:
        'Camera Crew: Frame the reaction shot—how does the environment settle, and how do the other survivors react to seeing this?',
      sparks: controlledSparks,
      sparkTriggerLabel: 'Need a Spark? — Controlled Outcome',
    };
  }

  if (effortLevel === 'pushing-it') {
    const costSparks: readonly string[] =
      suit === 'Spades'
        ? [
            'Scraped knuckles and a wrenched muscle that makes your hands tremble.',
            'The force of your effort sends a loud crash echoing into the next area.',
            'Your jacket or sleeve tears on a jagged edge, leaving a scrap behind.',
            'A heavy splinter or rusted burr drives deep under your fingernail.',
            'You kick up a cloud of choking dust, rust, or cold ash that makes you cough.',
            'Your boot heel cracks or twists on the uneven floor as you brace your weight.',
            'The tool you used is chipped, bent, or slick with sweat in your grip.',
            'A bruise blooms across your shoulder where you threw your weight against the obstacle.',
            'The metallic clang of your effort rings out across the quiet property.',
          ]
        : suit === 'Hearts'
        ? [
            'A ragged gasp escapes your throat—loud enough that something in the dark hears it.',
            'You waste precious seconds steadying your nerves while the shadows lengthen.',
            'Another survivor sees the terror in your eyes and starts to lose their nerve too.',
            'Cold sweat stings your eyes, making every shadow at the edge of the light look like movement.',
            'Your fingernails dig crescents into your own palms as you fight back a scream.',
            'You accidentally snap at a friend who tries to help, leaving bitter silence between you.',
            'Your knees buckle for a second once the immediate pressure passes.',
            'You drop a small sentimental keepsake in the dark and don’t dare reach back for it.',
            'A tremor stays in your voice for the rest of the scene.',
          ]
        : suit === 'Clubs'
        ? [
            isCamp
              ? 'Your lantern wick gutters low—the light is flickering on its last drops of oil.'
              : 'Your flashlight beam flickers and dims—the battery is nearly dead.',
            'You leave a smeared fingerprint or boot-mark right where you were working.',
            'Solving it takes longer than expected; footsteps are already closer.',
            'A tiny screw, fuse, or key-ring slips from your fingers and rolls under the furniture.',
            'A hot spark or sharp wire nicks the side of your thumb.',
            'You have to tear your sleeve to wipe away the grease, mud, or blood obscuring the clue.',
            'The mechanism groans loudly as it turns, betraying which room you are in.',
            'Smoke or acrid fumes from the wiring make your eyes water.',
            'You realize too late that you left the cabinet or drawer wide open as evidence you were here.',
          ]
        : [
            'You lose your footing and scrape your knee hard on the floor.',
            'Something small clatters out of your pocket and rolls into the shadows.',
            'A sharp exchange of words leaves tension crackling between two survivors.',
            'Your shoe skids on the wet floorboards, leaving a loud squeak in the silence.',
            'You brush against a hanging light or branch, setting the shadows swaying.',
            'Your sleeve snags on a nail, forcing you to yank it free with a rip of fabric.',
            'You land awkwardly from the scramble, knocking the breath out of your lungs.',
            'Mud or blood splashes up to your knees as you slide into cover.',
            'You barely catch a falling object in time, bruising your wrist against the shelf.',
          ];

    return {
      activePlayerPrompt: success
        ? '2 — Pushing It (Success): You pull it off, but it’s messy. Narrate how you succeed, then weave in the minor cost you choose from the table.'
        : '2 — Pushing It (Failure): You fall short despite straining yourself. Narrate how the attempt unravels and include one minor cost suggested by the table.',
      tablePrompt:
        'Camera Crew: Suggest 2–3 minor costs (noise, scratches, lost time, dimmed light) so the Active Player can pick one to weave into the scene.',
      sparks: costSparks,
      sparkTriggerLabel: 'Need a Spark? — Suggest a Minor Cost',
    };
  }

  if (effortLevel === 'overexertion') {
    const overexertionSparks: readonly string[] = [
      'You throw every ounce of your remaining strength into the final push—hearing something tear or shatter just as it ends.',
      'You refuse to let go even as the pain shoots up your arm, trading your own wellbeing for the result.',
      'In the frantic rush, you abandon what you were carrying and lunge forward with bare, bleeding hands.',
      'The camera holds on the exact item, route, or limb you just sacrificed lying in the wake of your effort.',
      'You stumble out of the exchange gasping for air, visibly changed by the price you just paid.',
      'The noise and violence of your overexertion leaves the entire room ringing with silence afterward.',
      'Another survivor reaches out to catch you as the cost of your effort catches up all at once.',
      'You wipe blood or sweat from your eyes and look back at what you had to leave behind.',
      'Even before the dust settles, everyone at the table can see how much this single scene took out of you.',
    ];
    return {
      activePlayerPrompt: success
        ? '3 — Overexertion (Costly Success): You get what you wanted, but you pay the price in full. Narrate your success alongside the Agreed Sacrifice.'
        : '3 — Overexertion (Bitter Failure): You don’t get what you wanted, AND you still pay the price. Narrate how the Agreed Sacrifice happens as the attempt fails.',
      tablePrompt:
        'Camera Crew: Hold the lens on the Agreed Sacrifice—make sure the loss lands with weight and changes the scene.',
      sparks: overexertionSparks,
      sparkTriggerLabel: 'Need a Spark? — Overexertion Outcome',
    };
  }

  // Effort 4: breaking-point (9 takes)
  const twistSparks: readonly string[] = isCamp
    ? [
        'THE TWIST: A shrill scream or walkie-talkie burst confirms the Killer is already inside the cabin you were retreating toward.',
        'THE TWIST: The storm surge snaps the dock mooring—your only boat or vehicle is drifting out into the black water.',
        'THE TWIST: In the chaos, a fresh body tumbles out of the shadows, revealing the Killer has been right beside you the whole time.',
        'THE TWIST: The camp generator explodes in a shower of sparks, plunging the entire lakeside into pitch-black silence.',
        'THE TWIST: A heavy axe blade crashes through the cabin wall right beside you, cutting the group in two.',
        'THE TWIST: The wooden floorboards give way beneath the struggle, dropping you into the flooded crawlspace under the cabin.',
        'THE TWIST: The flare you fired lands on the boathouse roof, igniting dry pine needles and spilled outboard fuel.',
        'THE TWIST: You lock eyes with the Killer through the rain—and recognize a piece of clothing from someone you thought was still alive.',
        'THE TWIST: The iron camp gate slams shut and a padlock clicks into place from the woods side; there is no road out.',
      ]
    : [
        'THE TWIST: The lights across the entire building cut out at once—the main power has just been severed.',
        'THE TWIST: The door you just came through slams and bolts from the outside; you are boxed in.',
        'THE TWIST: You spot a fresh trail of blood leading straight toward the room where another survivor is waiting alone.',
        'THE TWIST: A closet or ceiling hatch bursts open, and a dead body drops into the frame—the Killer was hiding inches away.',
        'THE TWIST: Smelling smoke, you realize the Killer has set fire to the ground floor to smoke you out of hiding.',
        'THE TWIST: The weapon comes down through the partition wall, splintering the wood and separating you from the group.',
        'THE TWIST: A car alarm or siren blares outside, drowning out your cries for help while the Killer steps into the hall.',
        'THE TWIST: The keys you were counting on are hanging from the Killer’s belt—they already searched the escape vehicle.',
        'THE TWIST: The staircase or floor landing collapses under the strain, stranding half the group on the wrong level.',
      ];

  return {
    activePlayerPrompt: success
      ? '4 — Breaking Point (Success + Strike): You barely pull it off at a terrible price. Narrate your success, the Agreed Sacrifice, AND the Twist you choose from the table.'
      : '4 — Breaking Point (Disaster + Strike): Everything goes wrong at once. Narrate the failure, the Agreed Sacrifice, AND the Twist you choose from the table.',
    tablePrompt:
      'Camera Crew: The Agreed Sacrifice happens AND it gets worse. Suggest "The Twist"—a sudden, horrible revelation or immediate danger—for the Active Player to choose.',
    sparks: twistSparks,
    sparkTriggerLabel: 'Need a Spark? — Suggest a Twist',
  };
}
