/**
 * @nott2/game-engine — Extended Playset Spark Pools (Pages 2 & 3 — 6 extra takes per card)
 *
 * Combined with the 3 primary rank sparks in `sparks-default.ts` and `sparks-summercamp.ts`,
 * this gives every single card in the 54-card deck 9 concrete takes (3 full pages of 3 takes)
 * when players click "New Takes" inside `<ScriptSparks>`.
 */

import type { Suit, JokerColor } from '../types';

type SixSparks = readonly [string, string, string, string, string, string];

// ── Generic Slasher (`default`) Extended Takes ───────────────────────────────

const DEFAULT_ACE_EXTRA: Record<Suit, SixSparks> = {
  Spades: [
    'A scarred baseball bat or tire iron rolling loose in the footwell beside my boots—and a chip on my shoulder no one asks about.',
    'Tape wrapped around my bruised knuckles from a fight earlier this week, and a promise to keep the youngest person here safe.',
    'A heavy keyring clipped to my belt as the unofficial bouncer of this group, staring nervously at the treeline.',
    'Mud caked up to my shins from pushing our stalled car the last half-mile, already regretting letting everyone talk me into this.',
    'A varsity jacket with a torn sleeve and a habit of stepping between my friends and whatever makes a noise in the dark.',
    'A heavy work flashlight tucked under my arm like a baton while I double-check every window latch in the room.',
  ],
  Hearts: [
    'A silver locket or friendship bracelet I keep twisting around my wrist whenever the silence stretches too long.',
    'A bottle of painkillers or anxiety meds rattling in my coat pocket—and a gut feeling that we never should have unlocked that door.',
    'Two phones in my pocket because I’m always the one keeping track of everyone else’s curfews and alibis.',
    'A borrowed oversized sweater that smells like someone who isn’t speaking to me tonight, and eyes that haven’t left the hallway.',
    'A disposable camera half-full of candid shots of the group, trying to pretend tonight feels like the old days.',
    'A stack of band-aids and a pocketknife in my bag because I’m always the one patching up everyone else’s mistakes.',
  ],
  Clubs: [
    'A dog-eared county map with three red circles drawn around this property and a pen chewed nearly in half.',
    'A police scanner app draining the last 12% of my battery while everyone else laughs in the next room.',
    'A pair of wire-rimmed glasses I keep wiping clean and a notebook full of dates from the original killings.',
    'A heavy keychain multi-tool and the unsettling realization that the deadbolt on the front door was replaced recently.',
    'A folder of old newspaper clippings stuffed into my backpack that I haven’t worked up the nerve to show the group yet.',
    'A pocket voltmeter and a flashlight with spare batteries, already noticing that the wiring in this building makes no sense.',
  ],
  Diamonds: [
    'A set of bolt cutters hidden in the trunk and a grin that says I still think this whole night is a joke.',
    'Someone else’s car keys spinning around my index finger while I lean against the one door everyone said not to open.',
    'A flask tucked into my boot, a pair of bent hairpins, and a dare I refused to back down from.',
    'A pricey watch I definitely didn’t pay for and a habit of checking the nearest exit before I sit down anywhere.',
    'A pack of matches I keep striking and blowing out just to watch the shadows jump across everyone’s faces.',
    'Mud on the hem of my best jacket from sneaking around the back window ten minutes before everyone else arrived.',
  ],
};

const DEFAULT_NUMBER_RESERVOIR: Record<Suit, readonly string[]> = {
  Spades: [
    'A warped storm-cellar bulkhead weighed down by something heavy piled across the top doors; you have to brace your spine and heave.',
    'A sliding barn or garage door jumped off its iron track—the gap is barely wide enough for one shoulder unless you wrench the rail.',
    'A rusted chain-link gate wrapped in fresh barbed wire; every shove drives the barbs deeper into your sleeves.',
    'A collapsed bookcase pinning the hallway door shut while boots crunch on broken glass at the far end of the corridor.',
    'A jammed freight-elevator grate that stops chest-high—you have to deadlift the counterweight gate so the others can crawl under.',
    'A heavy oak wardrobe tipped across the stairwell landing, groaning as something on the upper floor leans against it.',
    'A basement coal-chute hatch bolted with a rusted iron bar that bends only if you throw your full body weight against it.',
    'A rolling steel security shutter halfway down and jammed in its grooves while the alarm bell clangs overhead.',
    'A waterlogged laundry-room door swollen into its frame while freezing water pools around your ankles.',
    'A wrought-iron cellar grille padlock that is rusted half-through—one brutal strike with a heavy object might shatter the shackle.',
    'A fallen ceiling beam blocking the mudroom exit; hot dust and insulation rain down with every heave.',
    'A padlocked tool-shed door whose hinges are rotting out of the wood if you can rip the frame free.',
    'A heavy freezer curtain frozen solid to the floor drain while the compressor dies with a loud metallic shriek.',
    'A barricaded kitchen service door held shut by a wedge driven under the bottom gap from the outside.',
    'A rusted fire-escape drop ladder hanging just out of reach unless you boost yourself up by the crumbling brickwork.',
    'A jammed truck tailgate pinning your gear bag inside while the headlights flicker and die.',
    'A cellar trapdoor with a snapped pull-ring—you have to wedge your fingers into the splintered crack and rip it upward.',
    'A heavy cast-iron radiator tipped across the bathroom door, still radiating scalding heat.',
  ],
  Hearts: [
    'A slow, rhythmic tapping comes from inside the heating vent right beside your head—too steady to be pipes, too deliberate to be rats.',
    'You find a survivor’s phone lying face-up on the floor; the screen is unlocked and showing a photo taken of the group five minutes ago.',
    'A faint trail of wet, red footprints leads out of the closet you just walked past and stops right behind the group.',
    'Through the frosted glass of the bathroom door, a tall silhouette stands motionless—waiting for you to reach for the knob.',
    'A music box or old radio in the next room clicks on by itself, playing static mixed with the sound of someone breathing.',
    'One of the other survivors grabs your sleeve with ice-cold hands and whispers that someone is standing at the top of the stairs.',
    'You catch your own reflection in the darkened window—and realize a second face is hovering just over your shoulder.',
    'A child’s plastic toy or glass ornament rolls slowly across the floorboards out of the pitch-black kitchen.',
    'The smell of damp earth, copper, and stale sweat suddenly fills the hallway even though every window is nailed shut.',
    'You hear the distinct click of a camera shutter or a blade locking open from the dark alcove ten feet away.',
    'A jacket belonging to someone in this group is hanging on a hook by the back door—soaked from the chest down in fresh blood.',
    'The candle or lantern on the table gutters violently as if someone just walked past it in the dark.',
    'From behind the locked cellar door comes the unmistakable sound of someone mimicking a survivor’s voice calling your name.',
    'You step on a floorboard that gives a wet, hollow squelch, and dark red liquid wells up between the cracks.',
    'Another survivor is staring fixedly at the ceiling corner, too paralyzed to speak until you force them to move.',
    'A cold draft blows from behind a bookshelf that shouldn’t have a room behind it, carrying the sound of heavy boots.',
    'Your hand brushes the wall for balance and comes away sticky with a handprint that hasn’t dried yet.',
    'The house landline rings once—just a single sharp jangle—even though you saw the cord cut an hour ago.',
  ],
  Clubs: [
    'A tangle of color-coded wires behind the breaker panel has been deliberately cross-wired to spark if you flip the wrong switch.',
    'An old keyring found in the desk drawer has seven rusted keys—and footsteps are coming down the hall while you test them.',
    'A hand-drawn floorplan scratched into the back of a framed painting shows a hidden crawlspace between the walls.',
    'The backup generator in the shed is flooded with stale gas; you have to bleed the fuel line by feel in the dark.',
    'A padlock with a four-digit combination wheel is smeared with grease on three numbers—leaving just enough clue to crack it fast.',
    'A rotary phone or intercom panel in the study still has a faint hum on the line if you can splice the severed wall jack.',
    'A locked gun cabinet or medical locker has a loose hinge pin that can be tapped out if you have a steady hand and thirty seconds.',
    'A stack of polaroids hidden in a shoebox shows every exit on the property—each marked with the exact time it was chained shut.',
    'The car’s starter relay has been pulled from the fuse box under the hood and dropped into the oily gravel beneath the engine.',
    'A flickering fluorescent tube overhead is buzzing in Morse-like bursts because someone rigged a tripwire to the ballast.',
    'A ledger on the workbench lists licence plate numbers—including the car your group drove here tonight.',
    'A jammed window sash is held shut by a hidden security pin drilled into the upper frame that you have to unscrew blind.',
    'A spilled bottle of bleach or turpentine in the utility closet masks a trapdoor latch recessed into the linoleum.',
    'An old CB radio in the garage still has power from a marine battery, but the antenna coax is snagged in the rafters.',
    'A set of fresh boot tracks in the spilled flour or sawdust reveals the exact blind spot where the Killer has been waiting.',
    'A chemical flare or lantern in the storage bin is missing its striker cap—you have to improvise an ignition source.',
    'The dumbwaiter pulley mechanism is jammed by a leather strap caught in the gears; freeing it reveals what’s hidden in the car.',
    'A torn page from a local yearbook or property deed names the person who lived here—and connects them to someone at the table.',
  ],
  Diamonds: [
    'You have to edge across a rotting porch roof covered in wet leaves while the Killer’s flashlight sweeps the yard below.',
    'A vital set of keys has slipped through the floorboards into the narrow crawlspace—you have to reach in blind up to your shoulder.',
    'A shelf of glass jars and paint cans begins to tip as you squeeze past; you have one second to catch them before they crash.',
    'You are hiding behind a half-open door as heavy footsteps stop on the threshold—your foot is inches from a creaking board.',
    'To unbolt the back hatch, you have to crawl under a rusted workbench littered with fishhooks, broken glass, and rat traps.',
    'A survivor drops the only flashlight down the cellar stairs; you have to dart down, grab it, and scramble back before the shadow moves.',
    'You have to slip a butter knife or wire through the crack of the door to lift the brass privacy latch from the wrong side.',
    'A loose gutter pipe is the only way down from the second-story window, and the top bracket is already pulling out of the wood.',
    'Someone’s sleeve or backpack strap catches on a jagged nail right as you try to slip through the gap in the fence.',
    'You have to cross a room strewn with dry broken glass and crunching plaster without making a sound loud enough to carry.',
    'A rolling tool cart starts coasting down the sloped garage floor toward a stack of metal drums unless you catch it mid-roll.',
    'You have to trade places with a panicked survivor on a narrow ledge without either of you losing your grip.',
    'The only way into the locked office is through the transom window above the door—balancing on another survivor’s shoulders.',
    'A stray dog or startled crow is about to set off a racket outside the window unless you quiet or distract it immediately.',
    'Your boots are slick with oil or blood as you sprint for the corner—taking the turn too fast will send you slamming into the wall.',
    'You have to unhook a heavy chain from the gate link by link so the metal doesn’t clink in the dead silence.',
    'A swinging pendulum light casts a sweeping circle across the floor; you have to time your dash through the dark gap.',
    'You lunge to catch a slamming door with your boot before the automatic deadbolt clicks shut and locks everyone out.',
  ],
};

const DEFAULT_FACE_EXTRA: Record<Suit, Record<'11' | '12' | '13', SixSparks>> = {
  Spades: {
    '11': [
      'A heavy steel blade punches straight through the hollow-core door at chest height and rips downward.',
      'The Killer’s boot kicks the barricade inward, sending splinters flying as they fill the doorway shoulder-to-shoulder.',
      'A gloved hand shoots out from under the stairs and locks around a survivor’s ankle, dragging them backward.',
      'The Killer swings a heavy iron hook or sledge into the wall inches from your head, showering you in plaster.',
      'You round the corner at a dead run and slam chest-first into the Killer standing motionless in the dark.',
      'The Killer hurls a heavy table or appliance aside like cardboard, cutting off your retreat into the hallway.',
    ],
    '12': [
      'The Killer has chained the main exit and stands at the end of the hall, slowly tapping their weapon against the wall.',
      'A survivor is pinned beneath a fallen beam while the Killer’s heavy footsteps descend the cellar stairs step by step.',
      'The Killer crashes through the interior window in a shower of glass, landing between you and the rest of the group.',
      'Every door on this floor has been wedged shut—the Killer is driving you down the corridor like cattle toward a dead end.',
      'The Killer grabs the edge of the door you’re holding shut and begins forcing it open millimeter by millimeter.',
      'A sudden blackout hits the room, and the flare of a lighter reveals the Killer standing within arm’s reach.',
    ],
    '13': [
      'The Killer’s weapon embeds deep into the wood beside your throat; for one heartbeat, their weapon is trapped if you strike back.',
      'There is nowhere left to run—the Killer charges across the blood-slick floor to end this in a brutal close-quarters brawl.',
      'The Killer lifts a survivor off their feet by the collar; only a desperate, all-out physical collision can break their grip.',
      'Backed against the furnace or balcony rail, you have to use the Killer’s own momentum to slam them into the hazard.',
      'The Killer’s mask or hood is torn askew in the struggle—giving you one brutal opening to drive them back.',
      'With the last door burning or collapsed behind you, you grab the heaviest weapon in reach and meet the Killer head-on.',
    ],
  },
  Hearts: {
    '11': [
      'The Killer steps into the doorway wearing a trophy taken from the first victim—forcing you to face what already happened.',
      'From the darkness, the Killer holds up a set of car keys or a survivor’s phone and drops it into the drain at their feet.',
      'The Killer stands motionless on the landing, tilting their head as one of the survivors begins to hyperventilate.',
      'A closet door swings open to reveal a staging of bodies or belongings arranged specifically to break your nerve.',
      'The Killer drags their blade along the wallpaper right outside the room, waiting to see who cracks and bolts first.',
      'You lock eyes with the Killer through a crack in the boards—and realize they have been listening to your entire plan.',
    ],
    '12': [
      'The Killer corners two of you at a fork in the hallway; whichever way they step, one of you is left alone.',
      'A terrified survivor freezes in the middle of the room as the Killer advances—if you leave them, they die.',
      'The Killer mimics a familiar knock or signal at the door, tricking someone into reaching for the deadbolt.',
      'Locked on the wrong side of a glass door, you have to watch the Killer stalk toward a friend unless you draw their eyes to you.',
      'Paranoia erupts as the Killer’s trap makes it look like someone in the group locked the exit from the inside.',
      'The Killer slowly raises their weapon over an injured friend, looking straight at you to see what you’re willing to trade.',
    ],
    '13': [
      'Every instinct screams at you to curl up and surrender as the Killer looms over you—you have to find the fury to stand up.',
      'With the group scattered and screaming, you plant your feet in the doorway and refuse to let the Killer pass.',
      'The Killer whispers or reveals the cruelest truth of the night, trying to shatter your will before the final blow.',
      'Soaked in blood and shaking with exhaustion, you lock eyes with the Killer and turn your terror into cold resolve.',
      'You step directly into the lantern light so the Killer locks onto you, buying the others the seconds they need to live.',
      'As the Killer raises the blade for the killing stroke, a memory of everyone you’ve lost snaps you out of paralysis.',
    ],
  },
  Clubs: {
    '11': [
      'The Killer steps out from the exact hiding spot you thought was clear, proving they know the building’s layout better than you.',
      'You realize the clue you were following was bait—and the door latches shut behind you as the Killer’s shadow falls across the floor.',
      'The Killer systematically smashes the fuse box or radio right in front of you before turning their head toward your hiding spot.',
      'As you examine the murder weapon or evidence, a floorboard creaks directly behind you—the Killer returned for it.',
      'The Killer has rigged the stairwell light to blind anyone coming up while they wait in the dark at the top.',
      'You spot the flaw in the Killer’s stance or mask just as they lunge across the room toward you.',
    ],
    '12': [
      'The Killer is hunting methodically through the room, overturning cover one piece at a time while you rig a desperate trap.',
      'You see how the Killer’s own trap works—if you can trip the mechanism at the exact second they cross the threshold.',
      'A trail of leaked fuel, live electrical wire, or stacked timber gives you one chance to turn the room into a weapon.',
      'The Killer cuts off the hallway, forcing you to calculate a split-second escape through the ventilation or service shaft.',
      'While the Killer batters the door, you uncover the pattern linking the victims—revealing what the Killer cannot stand.',
      'You have five seconds at the control panel or lock cylinder while the Killer’s footsteps close the last twenty feet.',
    ],
    '13': [
      'You piece together the Killer’s identity and obsession at the exact moment they break into the room—and use it to bait them.',
      'With the Killer charging, you trigger the final improvised trap—live voltage, falling weight, or ignited fumes—at point-blank range.',
      'You exploit the Killer’s blind spot or old injury, turning their own ruthless method against them when it counts most.',
      'Cornered in the killer’s lair, you use the one piece of evidence you saved to throw them off balance and escape the kill-zone.',
      'You call out the Killer’s real name or secret crime, freezing them for the one second you need to strike.',
      'Every clue from the night clicks into place: you know which way the Killer will lunge before they even move.',
    ],
  },
  Diamonds: {
    '11': [
      'A survivor’s foot snaps a dry board or kicks a tin can, and the Killer’s head whips around from thirty feet away.',
      'The Killer lunges from the shadows; you have a fraction of a second to duck under the swing before the blade takes your head off.',
      'Your flashlight beam accidentally sweeps across the Killer’s mask in the dark—and the chase is on instantly.',
      'The hiding spot is too small for everyone; as the Killer walks past, someone’s shoe slips out into the light.',
      'The Killer slashes through the curtain or closet door you’re pressed behind, forcing an immediate acrobatic scramble.',
      'You drop the key at the base of the door just as the Killer rounds the corner at a terrifyingly fast stride.',
    ],
    '12': [
      'The Killer chases you through a maze of overturned furniture and broken glass—one misstep means getting caught on the floor.',
      'To get past the Killer in the narrow hall, you have to feint left, draw their swing into the wall, and slip past their elbow.',
      'A survivor is cornered at the window; you have to hurl a distraction or snatch them clear before the blade comes down.',
      'The Killer slashes the rope or ladder while you’re halfway across—you have to leap for the ledge and catch yourself.',
      'Locked in the same dark room as the Killer, you have to move from shadow to shadow by the sound of their breathing alone.',
      'You slide across a slick floor under a swinging weapon, grabbing the dropped tool on the way through.',
    ],
    '13': [
      'At point-blank range, you thread the needle—dodging the Killer’s lethal lunge so their weapon buries itself in the wall behind you.',
      'Balanced on a narrow beam, stairs, or rooftop edge, you bait the Killer into overcommitting and send them crashing down.',
      'With no margin for error, you snatch the weapon or key right off the Killer’s belt as they swing for your throat.',
      'You pull off a desperate sleight-of-hand—flashing a light or throwing shards in their eyes—to slip out of a fatal chokehold.',
      'As the floor or stairway collapses beneath you both, you leap clear at the last instant while the Killer is dragged back.',
      'One final, razor-thin dodge determines whether the blade takes your life or slices harmlessly through your coat.',
    ],
  },
};

const DEFAULT_JOKER_EXTRA: Record<JokerColor, SixSparks> = {
  Red: [
    'The Killer’s mask is cracked and bloodied, and you have them lured right onto the killing ground you prepared—strike now or die.',
    'All the survivors who remain surround the Killer in the wreckage of the property; every weakness you uncovered is brought to bear at once.',
    'Pinned to the ground with the Killer’s blade inches from your chest, your hand closes around the one weapon that can finish this forever.',
    'The first gray light of dawn breaks through the shattered windows as you drive the Killer back toward the fire, the shaft, or the blades.',
    'The Killer lunges for one last victim, and you intercept them mid-stride with everything you have left in your body.',
    'Bloodied, limping, and out of breath, you deliver the decisive final blow that ends the nightmare once and for all.',
  ],
  Black: [
    'What you thought was a dead body on the floor suddenly gasps—it’s a decoy, and the real Killer drops from the rafters above.',
    'The police cruiser or rescue truck pulling up the driveway has a slumped driver at the wheel—the Killer got to them first.',
    'A fire breaks out in the walls, filling the only safe room with black smoke and forcing everyone back into the Killer’s hunting ground.',
    'The weapon you thought you used to wound the Killer is lying clean on the table—meaning there is more than one mask in the dark.',
    'The storm blows out every window on the ground floor at once, and the cellar door you bolted from the inside is wide open.',
    'The phone finally connects, and the voice on the other end is coming from an extension inside the very room you’re hiding in.',
  ],
};

// ── Summer Camp Massacre (`summercamp`) Extended Takes ───────────────────────

const SUMMERCAMP_ACE_EXTRA: Record<Suit, SixSparks> = {
  Spades: [
    'A scarred camp splitting maul or canoe paddle resting against my bench—and blistered palms from clearing brush all week.',
    'A whistle around my neck, a waterproof flashlight on my belt, and a promise to get the younger counselors out before the bridge floods.',
    'Muddy boots from dragging theswim-docks ashore in the rain, already exhausted before the lights even went out.',
    'A faded Camp Pinewood varsity hoodie and a reputation as the only counselor strong enough to haul the generator.',
    'A heavy coil of nylon tow-rope slung over my shoulder and a bad feeling about the shadows along the archery range.',
    'A freshly bandaged forearm from repairing the cabin roofs, standing watch by the screen door while the thunder rolls in.',
  ],
  Hearts: [
    'A braided camp friendship bracelet from a summer nobody talks about anymore, and eyes that keep darting toward the dark lake.',
    'The infirmary first-aid kit slung across my chest because I’m the only one who knows how to stitch a cut out here.',
    'A damp wool camp blanket wrapped around my shoulders and a promise to look after a counselor who is already panicking.',
    'An old tarnished camp whistle I found buried in the sand by the dock—with someone’s initials scratched into the brass.',
    'A stack of unsent postcards in my jacket pocket and the creeping certainty that someone was watching us from the boathouse.',
    'A warm thermos and two extra flashlights because I never let anyone walk back to the cabins alone after taps.',
  ],
  Clubs: [
    'A laminated trail map of Camp Pinewood with the old abandoned cabins circled in red grease pencil.',
    'A hand-crank weather radio crackling with static and a set of master keys taken from the Camp Director’s pegboard.',
    'A water-stained 1979 counselor roster I found behind the mess hall filing cabinet that lists a death that was never reported.',
    'A pair of heavy binoculars and the realization that the phone line by the highway junction didn’t blow down—it was sawed through.',
    'A tackle-box full of spare fuses, electrical tape, and waterproof matches, already calculating how long the generator fuel will last.',
    'A field notebook charting the lake currents and old logging roads—and the disturbing discovery of fresh bootprints size 13 in the mud.',
  ],
  Diamonds: [
    'A swiped ring of canteen keys jingling in my pocket and a bottle of contraband hidden under a loose floorboard in Cabin 4.',
    'A flick-lighter I keep snapping open and shut while leaning back in my chair with my boots up on the mess hall table.',
    'Mud on my sneakers from sneaking out to the Old Point after curfew—where I left something I desperately need to get back.',
    'A waterproof watch, a pocketknife, and a twenty-dollar bet that none of the stories about the lake are real.',
    'A dry pack of flares I lifted from the boathouse locker "just in case," trying to act cooler than I actually feel.',
    'A canoe key on a floating cork lanyard and a habit of knowing every loose window screen in every cabin on the ridge.',
  ],
};

const SUMMERCAMP_NUMBER_RESERVOIR: Record<Suit, readonly string[]> = {
  Spades: [
    'A rotting cabin floorboard gives way beneath your boot, dropping your leg into the flooded crawlspace while something scrapes underneath.',
    'An overturned aluminum canoe is wedged across the boathouse slip; you have to haul its waterlogged weight clear in the pouring rain.',
    'A fallen white pine has crushed the covered bridge rail, pinning the gate shut while footsteps splash up the muddy bank behind you.',
    'The heavy storm-shutters on the mess hall have been spiked shut from the outside with ten-penny nails; you have to pry them loose.',
    'A tangled gill-net and rusted anchor chain have fouled the motorboat propeller in waist-deep black water.',
    'The root-cellar bulkhead behind the kitchen is weighed down by a cord of wet firewood that someone deliberately collapsed across it.',
    'A rusted bear-trap or snare wire in the tall brush snaps shut around your boot heel, anchoring you to a chain staked into the mud.',
    'The archery shed’s heavy barn door is jammed on its warped pine rollers while lightning illuminates a figure crossing the field.',
    'A mudslide along the ravine trail has buried the rope ladder in heavy clay and jagged shale that you have to claw free.',
    'The camp truck’s front bumper is wedged against a boulder on the access road; rocking it free takes everything in your back and legs.',
    'A waterlogged wooden dock section breaks loose in the storm surge, threatening to crush you against the pilings unless you brace it.',
    'The iron grate over the camp cistern is rusted into its stone collar—lifting it requires a crowbar and raw leverage.',
    'A stack of heavy cedar benches has been toppled across the infirmary hallway, blocking the only way to the back exit.',
    'The boathouse winch cable snaps under tension, whipping across the rafters while the heavy hull starts sliding back toward you.',
    'A swollen pine door in the shower block is wedged shut by a broken mop handle jammed beneath the बाहर latch.',
    'You have to haul a freezing, exhausted counselor up the slick clay wall of the washout before the creek surges again.',
    'A padlocked chain wraps the camp’s main timber gate; a heavy splitting maul is buried in the chopping block ten yards away.',
    'The ladder to the fire-watch tower has had its bottom rungs smashed out—you have to leap and haul yourself up by your bruised hands.',
  ],
  Hearts: [
    'A camp walkie-talkie left on the bunk suddenly crackles to life with the wet, rhythmic sound of someone breathing right outside the screen.',
    'Floating against the dock pilings in the lantern light is a counselor’s yellow rain slicker—soaked with fresh blood at the collar.',
    'Through the mosquito netting of Cabin 6, a tall silhouette stands motionless in the rain, holding something that gleams when lightning flashes.',
    'The camp PA horn on the flagpole clicks on with a burst of feedback, broadcasting the sound of fingernails scraping across metal.',
    'You shine your beam across the bunks and realize one of the sleeping bags is stuffed with wet pine boughs—and a bloody camp shirt.',
    'From out on the black water comes a splash and a choked cry that sounds exactly like the counselor who went to check the boats.',
    'Wet, muddy bootprints—far larger than anyone’s in the group—lead straight up the cabin steps and stop right outside the door.',
    'A carved wooden camp totem or counsellor nameplate has been nailed upside-down to the cabin door with a hunting knife.',
    'One of the survivors points a shaking finger at the treeline: someone in a soaked mask is standing between the pines, watching.',
    'You hear the slow, deliberate creak of the porch boards circling the cabin in the dark, testing each window screen one by one.',
    'Inside the camp craft shed, someone has arranged the missing counselors’ whistles in a neat row on the blood-stained workbench.',
    'A sudden gust blows the cabin door open, and the rain washes a streak of dark red across the threshold onto your shoes.',
    'The old camp bell by the mess hall rings once—a single, heavy iron toll in the storm—though no one from your group is out there.',
    'You catch the smell of lake rot, wet wool, and copper right behind you inside the unlit shower block.',
    'A counselor’s flashlight is lying in the mud by the latrines, its beam pointing straight at a drag-mark leading into the ferns.',
    'Someone whispers from underneath the raised cabin floorboards that they can see boots standing at the bottom of the steps.',
    'You wipe the condensation off the truck windshield—and realize the handprint smeared on the glass is on the INSIDE.',
    'An old cassette player in the rec hall clicks on by itself, warbling a distorted camp song as shadows move behind the curtains.',
  ],
  Clubs: [
    'The camp generator’s fuel bowl is clogged with water and pine needles; you have to strip and prime the carburetor by lantern light.',
    'In the Director’s cabin safe, you find the 1979 incident folder—showing the drowned camper’s family owned this land all along.',
    'The CB radio in the ranger truck has a severed microphone cord; splicing the four thin copper wires by hand takes nerves of steel.',
    'A trail of notched pine bark and snapped twigs reveals the Killer’s hidden footpath leading back to an old root cellar.',
    'The key to the motorboat ignition is locked inside the rusted waterfront lockbox—and the combination is hidden in the swim log.',
    'You discover that the camp’s fuse box wasn’t struck by lightning; someone pulled the ceramic fuses and hid them in the tool chest.',
    'A map pinned in the maintenance shed shows an old drainage tunnel running from the boiler room straight under the fence.',
    'The camp truck’s distributor cap is missing its rotor—but there’s a spare parts bin on the high shelf of the dark garage.',
    'By timing the intervals between the PA system’s static clicks, you realize the microphone is tied down inside the boathouse.',
    'A half-burned camp ledger in the woodstove reveals why the camp was shut down—and which counselor’s family signed the cover-up.',
    'You find a tripwire made of heavy monofilament fishing line stretched ankle-high across the cabin steps, wired to a falling timber.',
    'The medical cabinet in the infirmary is locked with a wafer lock that can be raked open with a bent dissection probe.',
    'Comparing the mud on the floor to the shoreline clay tells you the Killer is entering through the old pump-house intake.',
    'A box of marine distress flares in the boathouse is soaked, except for two rounds sealed inside a rusted coffee tin.',
    'The camp telephone junction box on the utility pole still has a live trunk line if you can clip a handset directly to the terminals.',
    'You notice the padlocks on the cabins were all keyed alike—meaning one master key on the groundskeeper’s belt opens everything.',
    'A bloody boot-print on the dock planking shows a distinctive notched heel from an old logging boot stored in the heritage cabin.',
    'You rig a floodlight wire across the wet aluminum screen door to deliver a jolt the moment anything touches the handle.',
  ],
  Diamonds: [
    'You have to crawl beneath the raised floorboards of Cabin 3 through freezing mud while heavy boots walk across the planks inches above your back.',
    'To reach the boat keys on the nail, you have to edge along the narrow, slime-slick outer beam of the boathouse over deep black water.',
    'A shelf of tin cans and cast-iron skillets in the camp kitchen starts to slide as you squeeze behind the pantry—catch it or wake the woods.',
    'You have to slip out the high bathroom louver window and drop onto the wet pine needles without snapping a single branch.',
    'The canoe is drifting three feet off the dock in the storm; a mistimed leap will plunge you straight into the freezing lake.',
    'You are pressed flat behind a rack of hanging life-jackets in the dark shed as the Killer’s blade parts the vests one by one.',
    'A counselor’s foot slips on the slick clay edge of the gorge; you have to lunge and catch their wrist before they go over.',
    'To unhook the chain across the camp road, you have to dash into the open clearing between lightning flashes and vanish back into the brush.',
    'You have to thread a wire coat-hanger through the torn screen door to lift the wooden drop-bar from the outside without rattling it.',
    'Sprinting down the dark woodland trail, you spot a taut wire at throat height a split-second before you hit it.',
    'You have to swim silently under the floating swim-raft while the Killer stands on the planks above, scanning the water.',
    'A frightened raccoon or camp dog in the garbage shed is about to bolt and give away your hiding spot unless you calm it silently.',
    'You have to pass a bundle of flares and keys across the gap between two cabin roofs in the driving rain.',
    'Your sneaker gets sucked into the deep reed-mud at the shoreline right as the Killer’s lantern rounds the point.',
    'You have to jimmy the ranger truck’s vent window with a pocketknife while keeping your head below the dashboard.',
    'A loose stack of split logs begins to shift beside your hiding place—one rolling log will give you away instantly.',
    'You have to sprint across the swaying rope bridge over the flooded creek while the slick planks tilt under every step.',
    'As the cabin door swings shut, you slide across the wet pine floor to snag the dropped walkie-talkie before the lock clicks.',
  ],
};

const SUMMERCAMP_FACE_EXTRA: Record<Suit, Record<'11' | '12' | '13', SixSparks>> = {
  Spades: {
    '11': [
      'A rusted machete or wood-axe punches straight through the thin pine wall of the cabin, showering you in splinters.',
      'The Killer rises out of the black lake water beside the dock and grabs the gunwale of your canoe with an iron grip.',
      'The screen door explodes off its hinges as the Killer steps into the cabin, rainwater and blood dripping from their coat.',
      'A heavy gloved hand bursts up through the rotted porch planks and locks around a counselor’s ankle.',
      'The Killer swings a heavy brush-hook across the narrow trail, slicing a sapling in half inches from your chest.',
      'You crash through the wet ferns at a dead sprint and collide directly with the Killer standing in the dark clearing.',
    ],
    '12': [
      'The Killer is methodically chopping through the cabin door with a felling axe while the windows are nailed shut.',
      'Out on the slick, rain-lashed dock, the Killer blocks the shoreward end while advancing toward you step by step.',
      'The Killer flips the heavy picnic table you were using as a barricade and pins a counselor against the logs.',
      'Inside the cramped boathouse, the Killer swings a heavy iron chain to herd you toward the open water slip.',
      'The Killer smashes through the infirmary partition wall, cutting you off from the rest of the counselors.',
      'Trapped in the mud beneath the fire-tower, you have to fend off the Killer’s relentless downward strikes.',
    ],
    '13': [
      'The Killer’s axe buries itself deep into the wet pine post beside your head—giving you one brutal second to tackle them into the lake.',
      'On the collapsing covered bridge above the flooded gorge, you lock up with the Killer in a desperate fight for survival.',
      'With the cabin burning around you, you grab a splitting maul or jagged oar and meet the Killer’s charge head-on.',
      'The Killer drags you into the knee-deep shallows; you have to wrench their own weapon free to break the stranglehold.',
      'Backed against the roaring camp bonfire, you use every ounce of strength left to shove the Killer into the flames.',
      'Bloodied and half-drowned, you plant your boots in the mud and trade one final, bone-crushing blow with the monster of Camp Pinewood.',
    ],
  },
  Hearts: {
    '11': [
      'The Killer steps into the lantern light wearing the whistle or jacket of the first counselor who went missing.',
      'Pinned to the cabin door with an archery arrow is a photo of your group taken from inside the bunkhouse an hour ago.',
      'The Killer stands at the edge of the campfire circle, tossing a severed walkie-talkie into the embers while staring right at you.',
      'You open the boathouse locker and find the camp shrine—fetishes of hair, old badges, and fresh blood from tonight.',
      'From across the narrow cove, the Killer slowly raises their blade and points it directly at the person beside you.',
      'The Killer drags an oar or machete along the cabin’s tin roof overhead, waiting to see who screams and runs out into the rain.',
    ],
    '12': [
      'Two counselors are trapped in separate cabins as the Killer walks between them—whichever one makes a sound gets the blade.',
      'A panicked counselor freezes in the beam of the truck headlights while the Killer steps out of the trees behind them.',
      'The Killer uses a dead counselor’s walkie-talkie to lure someone toward the latrines before stepping out to block the path.',
      'You are safe inside the locked mess hall, watching through the screen as the Killer corners a friend on the porch.',
      'Accusations fly in the dark cabin as someone realizes the spare set of truck keys was hidden by one of your own group.',
      'The Killer holds a wounded counselor by the hair at the end of the dock, waiting to see if you will step out of cover.',
    ],
    '13': [
      'Standing in the pouring rain by the lake that claimed so many lives, you swallow your terror and refuse to take another step back.',
      'With the other counselors screaming behind you, you blow the brass camp whistle at the top of your lungs to draw the Killer to you.',
      'You look past the waterlogged mask into the Killer’s eyes and turn a whole summer of grief and fear into pure defiance.',
      'Even with three wounds bleeding through your camp shirt, you plant yourself on the cabin steps and hold the line.',
      'When the Killer lunges from the dark pines, you don’t flinch—you scream back and face the nightmare head-on.',
      'Every terrible memory of Camp Pinewood converges in this heartbeat, and you choose survival over despair.',
    ],
  },
  Clubs: {
    '11': [
      'You realize the Killer didn’t cut the power from outside—they are standing inside the generator shed with you right now.',
      'The trail markers on the pines have been reversed in the storm, leading your group straight into the Killer’s sunken pit-trap.',
      'As you piece together the 1979 drowning from the camp files, a wet shadow falls across the desk from the open window.',
      'The Killer systematically smashes the distributor cap of the camp truck before turning slowly toward your hiding spot in the brush.',
      'You spot the rusted bear-trap hidden under the wet leaves an instant before the Killer steps out from behind the tree.',
      'The radio finally picks up a signal—and you realize the clicking sound is coming from inside the same cabin.',
    ],
    '12': [
      'While the Killer hacks at the boathouse door, you have seconds to rig the winch cable and outboard fuel into a deadly snare.',
      'You spot the rotting planks on the dock—if you can lure the Killer’s heavy stride onto that exact board, it will give way.',
      'Trapped in the camp kitchen, you use boiling oil, propane valves, or the freezer lock to outthink a stronger predator.',
      'You trace the Killer’s blind spot—water in their mask or an old knee injury—and call out the exact angle for the group to run.',
      'With the Killer ten yards behind you in the dark woods, you navigate the flooded ravine trail by memory and compass alone.',
      'You have one chance to hotwire the camp tractor or flare-gun mechanism while the Killer smashes through the windshield.',
    ],
    '13': [
      'Inside the Killer’s rotting shrine-cabin, you hold up the drowned camper’s relic—freezing the Killer in their tracks.',
      'You spring the final camp trap—dropping the boathouse hoist, igniting the fuel drum, or electrifying the wet dock—at the exact second they strike.',
      'You call out the truth of what happened at Camp Pinewood in 1979, shattering the Killer’s rhythm just long enough to counterattack.',
      'Every clue you gathered across the camp grounds pays off as you predict the Killer’s ambush and turn their own lair against them.',
      'With cold clarity in the middle of the storm, you sever the rope bridge or dock mooring the instant the Killer steps onto it.',
      'You use the Killer’s obsession with the lake against them, luring them onto the one piece of ground that cannot hold their weight.',
    ],
  },
  Diamonds: {
    '11': [
      'Your sneaker snaps a hollow dead branch in the quiet pines, and the Killer’s head snaps toward you from the trail.',
      'A machete blade slices up through the canvas tent or bunk mattress you were hiding on, missing your ribs by an inch.',
      'The canoe paddle slips and bangs hollowly against the aluminum hull right as the Killer walks onto the dock.',
      'You duck behind a cabin corner just as the Killer’s thrown hatchet buries itself quivering in the timber where your head was.',
      'Your flashlight rolls off the picnic table and spins across the floorboards, illuminating the Killer’s boots standing by the stove.',
      'Someone’s rain poncho snags on a rusty nail as you bail out the cabin window with the Killer two steps behind.',
    ],
    '12': [
      'The Killer chases you across the slick, tilting logs of the timber boom—one slip drops you into the black water beneath them.',
      'Inside the pitch-black archery shed, you have to weave between hanging targets and equipment racks while the Killer swings blind.',
      'You dive through the closing boathouse hatch, snatching the flare gun off the floor as the blade sparks against the iron sill.',
      'To save a cornered counselor, you whip a stone or lantern across the clearing to pull the Killer’s lunge off-target.',
      'You have to unhook the boat’s bow-line in driving rain while dodging the Killer’s reach from the edge of the pier.',
      'Sliding down the mud-slick ravine bank in the dark, you have to catch a tree root to keep from hurtling into the Killer’s path.',
    ],
    '13': [
      'At the very edge of the gorge or dock, you sidestep the Killer’s full-force swing so their own momentum carries them over the brink.',
      'Pinned on the slick planks in the rain, you twist free of the Killer’s grasp, leaving only your torn camp jacket in their hand.',
      'You pull off an impossible leap from the boathouse roof into the drifting boat just as the Killer’s axe splinters the eaves.',
      'With the blade descending toward your chest, you flick a lit flare or handful of lime straight into the eye-holes of their mask.',
      'You thread a narrow gap between the collapsing cabin beams at full sprint while the roof comes down on the Killer behind you.',
      'One final, lightning-fast reflex decides whether you clear the camp gate or become the last trophy in the pines.',
    ],
  },
};

const SUMMERCAMP_JOKER_EXTRA: Record<JokerColor, SixSparks> = {
  Red: [
    'Out on the storm-lashed dock where the legend began, you bring every weapon and revealed weakness together to drag the Killer into the deep.',
    'The surviving counselors surround the Killer in the burning ruins of the main lodge—no one is running anymore.',
    'As the Killer rises from the shallows for one last strike, you jam the flare, propeller, or blade straight into their exposed weakness.',
    'The storm breaks into cold morning fog across the lake as you deliver the final blow that breaks the curse of Camp Pinewood.',
    'With the drowned camper’s relic in one hand and a weapon in the other, you end the massacre at the water’s edge.',
    'Soaked in rain and blood, the last survivors work as one to drive the Killer down beneath the black water for good.',
  ],
  Black: [
    'The flooded creek washes out the main highway bridge with a deafening roar—even if you reach the road, there is no way out.',
    'The ranger truck coming up the camp road crashes into a pine—the driver is already dead, and the Killer steps out of the cab.',
    'Lightning strikes the camp fuel tank by the generator shed, sending a wall of fire rolling toward the cabins.',
    'The body you thought was the Killer’s is just a counselor’s corpse dressed in a spare rain slicker and mask—the real Killer is behind you.',
    'The storm surge swamps the last motorboat at the dock, sinking it to the gunwales in ten feet of freezing water.',
    'Every cabin door in the circle slams shut at once as the wind shifts—and someone starts ringing the camp bell in the dark.',
  ],
};

/**
 * Returns 6 extra playset-coupled sparks (Pages 2 and 3) for any standard card,
 * ensuring every card in the deck has a 9-spark pool (3 pages of 3 takes).
 */
export function getExtendedCardSparks(
  suit: Suit,
  rank: number,
  playsetId: string = 'default',
): SixSparks {
  const isCamp = playsetId === 'summercamp';

  if (rank === 1) {
    return isCamp ? SUMMERCAMP_ACE_EXTRA[suit] : DEFAULT_ACE_EXTRA[suit];
  }

  if (rank >= 11) {
    const faceKey = String(rank) as '11' | '12' | '13';
    return isCamp
      ? SUMMERCAMP_FACE_EXTRA[suit][faceKey]
      : DEFAULT_FACE_EXTRA[suit][faceKey];
  }

  // Number cards (2..10): deterministic offset into the 18-spark reservoir
  // so different ranks get distinct Page 2 & Page 3 sets!
  const reservoir = isCamp
    ? SUMMERCAMP_NUMBER_RESERVOIR[suit]
    : DEFAULT_NUMBER_RESERVOIR[suit];
  const len = reservoir.length;
  const start = ((rank - 2) * 2) % len;

  return [
    reservoir[start % len],
    reservoir[(start + 1) % len],
    reservoir[(start + 2) % len],
    reservoir[(start + 3) % len],
    reservoir[(start + 4) % len],
    reservoir[(start + 5) % len],
  ];
}

/**
 * Returns 6 extra playset-coupled sparks (Pages 2 and 3) for a Joker card.
 */
export function getExtendedJokerSparks(
  color: JokerColor,
  playsetId: string = 'default',
): SixSparks {
  return playsetId === 'summercamp'
    ? SUMMERCAMP_JOKER_EXTRA[color]
    : DEFAULT_JOKER_EXTRA[color];
}
