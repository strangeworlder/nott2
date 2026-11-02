/**
 * @nott2/game-engine — "Summer Camp Massacre" Playset Card Sparks
 *
 * Practical horror beats grounded in Camp Pinewood: rotting boathouses,
 * rain-lashed cabins, archery sheds, kerosene lanterns, and a black lake.
 */

import type { CardSparksMap, JokerSparksMap } from './sparks-default';

export const SUMMERCAMP_CARD_SPARKS: CardSparksMap = {
  Spades: {
    '1': [
      'Hauling aluminum canoes up onto the slick timber dock before the storm hits the lake.',
      'Splitting cordwood behind the Mess Hall with a heavy camp axe while the pines groan in the wind.',
      'Wrestling the rusted main gate chain into place at the edge of the dirt logging road.',
    ],
    '2': [
      'The heavy storm doors of the Boathouse slam shut, and the iron padlock bar drops into its bracket outside.',
      'The wooden hatch to the Mess Hall root cellar crashes down above you, smelling of wet earth and rotting potatoes.',
      'The chain-link gate of the camp generator pen snaps shut and its rusted latch jams fast.',
    ],
    '3': [
      'A collapsed rack of waterlogged wooden canoes and tangled oars blocks the only doorway out of the Boathouse.',
      'A towering pine has crashed across the cabin porch roof, pinning the screen door behind a wall of wet branches.',
      'Heavy iron bunk beds and footlockers have been deliberately piled across the center aisle of Cabin 4.',
    ],
    '4': [
      'Squeezing beneath the low, mud-choked timber pilings under the cabin while rusted nails rake your back.',
      'Forcing yourself through the narrow ventilation louvers of the dark latrine block.',
      'Writhing through a jagged tear in the chain-link perimeter fence where rusted barbs snag your flesh.',
    ],
    '5': [
      'The rotted planks of the lake pier splinter beneath your boots, dropping toward the black water below.',
      'The sagging timber roof of the Archery Shed caves in under a deadfall branch, cutting off the trail.',
      'The wooden footbridge across the swollen ravine snaps one of its suspension ropes as you reach the middle.',
    ],
    '6': [
      'A freezing, waterlogged hand shoots up from between the dock planks and clamps around your ankle.',
      'A concealed poaching snare on the deer trail cinches tight around your shin and jerks you into the ferns.',
      'Something hiding beneath the cabin floorboards grabs your heel as you step off the porch.',
    ],
    '7': [
      'You are thrown into the camp trophy cabinet in the Rec Hall, showering the floorboards in broken glass and brass plaques.',
      'You slam hard against the stone fireplace of the Main Lodge, knocking loose a shower of soot and iron pokers.',
      'You are hurled through the rotten railing of the cabin porch into the mud and nettles below.',
    ],
    '8': [
      'A rusted iron coyote trap hidden under pine needles snaps shut around your ankle on the dark trail.',
      'A taut fishing-line tripwire across the cabin doorway releases a weighted timber beam.',
      'A rigged board on the dock flips up, driving rusted boat spikes through the sole of your shoe.',
    ],
    '9': [
      'An overturned cast-iron woodstove and a pile of split logs pin you flat to the cabin floor.',
      'The heavy wooden hull of a fallen sailboat crushes your chest against the wet planks of the boathouse.',
      'A collapsed timber rafter in the old barn pins you down while rain pours through the torn roof.',
    ],
    '10': [
      'A kicked-over kerosene lantern ignites the dry pine walls of the cabin, filling the room with Pitch-black smoke.',
      'You are dragged under the surface of the freezing lake, tangled in heavy gill-nets that pull you toward the bottom.',
      'The camp walk-in freezer door latches shut while sub-zero air and leaking ammonia burn your lungs.',
    ],
    '11': [
      'Standing at the end of the dock in the pouring rain, wearing a dripping oilskin slicker and holding an oar like a spear.',
      'Framed in the cabin doorway by a flash of lightning, towering over the bunk beds in mud-caked logger boots.',
      'Motionless among the pine trunks just beyond the dying campfire, broad shoulders swallowing the lantern light.',
    ],
    '12': [
      'A heavy double-bitted felling axe, its handle wrapped in blood-soaked friction tape.',
      'A rusted brush-clearing machete that scrapes sparks off the stone steps of the Lodge.',
      'A barbed iron gaff hook used for hauling timber out of the lake, swinging from a thick leather strap.',
    ],
    '13': [
      'Three broadhead hunting arrows are jutting from their chest—and they just snap the shafts off with one hand.',
      'A deep outboard-motor propeller gash tears across their shoulder, leaking dark water and blood without slowing them.',
      'Their coat is still smoldering from a flare strike, the burned flesh beneath completely ignored.',
    ],
  },

  Hearts: {
    '1': [
      'Sitting on the end of the pier at dusk, comforting a homesick camper or nervous counselor before lights-out.',
      'Tending the first campfire of the night and sharing a quiet promise with the person sitting closest to you.',
      'Polishing an old camp whistle or locket from the summer that changed everything.',
    ],
    '2': [
      'The kerosene lantern gutters in the draft, and a shadow between the pine trees steps closer when the flame dips.',
      'The bug-zapper on the Mess Hall porch arcs blue—illuminating a figure standing motionless by the flagpole.',
      'Your flashlight beam cuts across the cabin bunk beds, and one of the hanging raincoats shifts on its hook.',
    ],
    '3': [
      'Across the flat black water of the lake, someone calls your name from a drifting canoe that shouldn’t be out there.',
      'The camp PA horn crackles to life in the rain, broadcasting a weeping voice from an empty office.',
      'From the dark woods behind the latrines, the voice of a counselor who vanished an hour ago begs you to come help.',
    ],
    '4': [
      'A counselor’s brass whistle on a severed lanyard, left neatly on your pillow inside the cabin.',
      'A soaked Camp Pinewood staff t-shirt belonging to a friend, impaled on a branch at eye level on the trail.',
      'Someone’s cracked glasses and flashlight lying in the mud right outside the screen door, the beam still on.',
    ],
    '5': [
      'Between the warped cedar planks of the cabin wall, the glint of an eye reflects your lantern light.',
      'Something is treading water silently beneath the gaps in the dock boards right under your feet.',
      'From the dark treeline across the archery field, someone is watching you through a pair of binoculars.',
    ],
    '6': [
      'The fog rolls off the lake so thick you lose the trail markers—and wet footsteps squish right behind your heel.',
      'You duck under a low pine bough and realize the others took the left fork; something breathes in the ferns beside you.',
      'From beneath the bottom bunk, a voice raw with lake water whispers your name.',
    ],
    '7': [
      'Every carved name on the old Camp Memorial totem has been freshly gouged out—except yours is carved at the bottom.',
      'The lake water lapping against the shore runs thick and red in the moonlight, then looks black again when you blink.',
      'A row of soaked camp clothes hangs from the rafters like bodies, swaying even though there is no wind inside.',
    ],
    '8': [
      'Their boots are soaked in black lake silt up to the ankles, and they lie about where they just came from.',
      'They are clutching the only working walkie-talkie with a dead stare, refusing to hand it over.',
      'You catch them wiping pine pitch and blood off their knuckles behind the washhouse.',
    ],
    '9': [
      'The sound of splashing water and adistant cry pulls you straight back to the drowning no one ever reported.',
      'The smell of wet pine and kerosene triggers the memory of the fire that shut this camp down years ago.',
      'Seeing the dock in the storm brings back the face of the person you left behind the last time you were here.',
    ],
    '10': [
      'You are stranded on theswimming raft in the middle of the black lake while the lantern on shore goes out.',
      'The miles of state forest road are washed out, the camp truck is dead, and no ranger is coming until Monday.',
      'You can see the cabin lights across the clearing, but the wind and rain swallow every scream you make.',
    ],
    '11': [
      'A rotting canvas sack cinched around the neck with rope, one eyehole torn ragged and dripping lake water.',
      'A cracked vintage fiberglass goalie or fencing mask, darkened with pine soot and old blood.',
      'A face caked in grey river clay and moss, with eyes wide and white in the lantern glow.',
    ],
    '12': [
      'A wet, bubbling wheeze like someone trying to breathe with lungs half-full of lake water.',
      'The slow, metallic scrape of steel sharpening against a whetstone in the pitch dark.',
      'A hollow, distorted imitation of the camp bugle call blown through cracked lips.',
    ],
    '13': [
      'Their neck is wrenched sideways as if broken years ago, yet their arms swing the blade with terrifying force.',
      'They walk with a stiff, waterlogged lurch that never slows down, snapping saplings in their path.',
      'Their dislocated shoulder pops back into place with a wet crack as they reach through the broken screen.',
    ],
  },

  Clubs: {
    '1': [
      'Checking the camp Director’s office ledger and noticing pages from ten summers ago have been razor-bladed out.',
      'Testing the emergency CB radio in the lodge and realizing someone snapped the antenna lead off at the roof.',
      'Inspecting the canoe fleet and finding every hull has had a neat hole drilled through the floorboards.',
    ],
    '2': [
      'Carved deep into the underside of the wooden picnic table with a hunting knife: "THE LAKE REMEMBERS WHAT YOU DID."',
      'Written in red canoe paint across the washhouse mirror: "NO ONE LEAVES CAMP PINEWOOD."',
      'A soggy camp postcard pinned to the bulletin board with a fishhook: "Count the bunks. One of you doesn’t belong."',
    ],
    '3': [
      'The pull-cord on the backup diesel generator has been sliced through, and the fuel line is draining into the dirt.',
      'The camp pickup truck’s battery cables have been hacked apart with an axe, and the ignition cylinder is jammed.',
      'The base-station CB radio has had its microphone cord ripped out, leaving only exposed copper pins.',
    ],
    '4': [
      'Stick-and-twine effigies hanging from the lower branches along the perimeter trail, marking a hunting boundary.',
      'An old Camp Pinewood staff patch from 1979 nailed to the tree—the year the camp was shut down after the massacre.',
      'Three notches hacked into the timber post of every cabin where someone has already been taken.',
    ],
    '5': [
      'The painted wooden trail map outside the Lodge has been defaced—every cabin is X’d out except the Point.',
      'A mildewed camp counselor’s handbook with a hand-drawn map of the abandoned storm cellar under the old chapel.',
      'A topographic map of the lake with depth markings showing where the old roadbed disappears underwater.',
    ],
    '6': [
      'You reach the fire tower hoping to signal for help, only to find the lower ten feet of the wooden ladder sawed away.',
      'The motorboat you planned to escape in has had its fuel tank filled with lake water and sugar.',
      'The main lodge shutters bolt from the outside, not the inside—you’ve locked yourselves into a cage.',
    ],
    '7': [
      'The camp caretaker’s body hanging upside down from the bell tower rope, ringing softly with each gust of wind.',
      'A body stuffed inside a sleeping bag on the top bunk, still warm, with the cabin key missing from their belt.',
      'A drowned victim floating face-down between the canoes at the dock, their fingers still clutching a scrap of oilskin.',
    ],
    '8': [
      'The key to the camp rifle rack is dangling inside a glass bait jar teeming with wasps or rusted fishhooks.',
      'To release the jammed floodgate on the dam bridge, someone has to reach into the rushing spillway chain.',
      'A rigged padlock on the boathouse winch that requires holding a burning flare against the rusted pin to melt the grease.',
    ],
    '9': [
      'Old medical records in the infirmary cabinet prove the kid who "drowned" here years ago was left to die by the staff.',
      'You find a shrine of counselor name-tags in the woods—and one of the tags belongs to someone at this table.',
      'The Killer isn’t an outsider: their gear came from the camp’s own locked maintenance bunker.',
    ],
    '10': [
      'The wooden bridge over the gorge is burning in the rain, reducing the entire peninsula to a dead-end island.',
      'Every trail through the pines has been strung with razor-taut snare wire funneling you back toward the lake.',
      'The storm has flooded the low road; the only way out now is through the Killer’s own hunting ground.',
    ],
    '11': [
      'A faded, moth-eaten Camp Pinewood junior camper’s poncho stretched over a massive adult frame.',
      'A vintage leather archery arm-guard and a groundskeeper’s tool belt bristling with rusted camp hardware.',
      'A waterlogged life vest worn over dark wool, trailing tangled weeds from the bottom of the lake.',
    ],
    '12': [
      'Wet mud and pine needles from your boots left a clear trail across the dry porch boards to your hiding spot.',
      'The beam of your flashlight bled through the gaps in the cabin floorboards while you crouched above.',
      'They know every creaking board in this cabin because they built—or grew up in—this very camp.',
    ],
    '13': [
      'They toss a handful of tarnished camp merit badges onto the floor—one for each sin the group is hiding.',
      'A raspy voice over the stolen counselor walkie-talkie whispers the exact spot where you’re crouching.',
      'They point a dripping blade at you and hum the camp’s lights-out song.',
    ],
  },

  Diamonds: {
    '1': [
      'Sneaking a bottle of cheap liquor out to the lifeguard chair after curfew while teasing the others.',
      'Showing off a trick shot at the archery targets or balancing along the wet canoe gunwale.',
      'Jimmied open the camp canteen window to pass snacks out to the rest of the group.',
    ],
    '2': [
      'Your boot catches a rack of aluminum canoe paddles, sending them clattering like gunshots across the wooden dock.',
      'You back into a shelf of tin mess-hall trays and galvanized buckets that crash to the kitchen floor.',
      'You trip over the camp dinner bell rope in the dark, letting out a single brazen clang that echoes across the lake.',
    ],
    '3': [
      'The keys to the camp truck slip through the wide gaps of the wooden pier and land on a submerged crossbeam below.',
      'The only flare gun slides off the slick roof of the cabin and lands in the muddy blackberry brambles.',
      'Your waterproof flashlight rolls under the floorboards of the latrine pit.',
    ],
    '4': [
      'You accuse another counselor of abandoning the campers earlier—and everyone goes dead quiet.',
      'You snap that someone here is the reason the Killer came back, exposing a secret from last summer.',
      'You admit you left the cabin door unlatched when you snuck out earlier tonight.',
    ],
    '5': [
      'The last dry canoe is drifting away from the dock on the storm chop, and you hesitate at the edge of the pier.',
      'The heavy storm shutter on the Lodge window is sliding down, and you freeze for a second before diving through.',
      'The generator sputters on its last drop of fuel while the security gate winch is only halfway open.',
    ],
    '6': [
      'Your wet hand slips and fires a blinding red marine flare straight into the rafters of the boathouse.',
      'You accidentally trip the camp air-raid siren on the lodge roof, howling across the dark woods.',
      'Your foot kicks the chock block out from under the boat trailer, sending it rolling down the ramp.',
    ],
    '7': [
      'A dry pine twig snaps like a rifle shot under your heel while the Killer stands ten feet away in the mist.',
      'Cold lake water dripping from your hair hits the dry leaves right below your hiding spot.',
      'The squelch of your soaked sneakers betrays you as you try to edge past the screen window.',
    ],
    '8': [
      'You walked out onto the end of the dock alone to prove the noise was just raccoons.',
      'You insisted on cutting through the off-limits Old Camp ruins to save time in the rain.',
      'You called out into the dark trees to draw them away, not realizing how fast they could close the gap.',
    ],
    '9': [
      'You shove a friend into the canoe to save them, accidentally capsizing it into the freezing lake.',
      'You swing a lantern at the shadow behind your friend, shattering the glass and plunging the cabin into darkness.',
      'You yank the rope bridge to slow the pursuer down, nearly dumping the survivor still crossing it into the gorge.',
    ],
    '10': [
      'You slammed and barred the Mess Hall door in a panic—before realizing one of the others was still on the porch.',
      'You dropped the box of dry matches into the puddle, killing the only chance to light the signal fire.',
      'You misread the trail blaze in the rain and led the whole group onto the dead-end cliff above the quarry.',
    ],
    '11': [
      'The pattering rain on the pine canopy masks every step until the ferns part right beside your elbow.',
      'They rise out of the black lake water beside the dock without making a single ripple.',
      'They step out from behind the wide trunk of an old-growth cedar you just brushed past.',
    ],
    '12': [
      'They dangle the camp truck keys from the tip of their blade, tapping them rhythmically against the cabin screen.',
      'They methodically cut the guy-wires of the tent or porch around you, watching you scramble.',
      'They toss your friend’s broken walkie-talkie at your feet while static hisses from the speaker.',
    ],
    '13': [
      'You saw them at the campfire ten seconds ago, yet they are already waiting inside the Boathouse when you arrive.',
      'They burst upward through the rotted floorboards of the cabin right between you and the door.',
      'They drop from the rafters of the Mess Hall directly onto the table in front of you.',
    ],
  },
};

export const SUMMERCAMP_JOKER_SPARKS: JokerSparksMap = {
  Red: [
    'Luring the Killer out onto the soaked planks of the main pier and igniting the spilled outboard fuel as dawn breaks over the lake.',
    'Driving the camp pickup or motorboat full-throttle to pin them against the boathouse pilings and drag them into the deep water.',
    'Using the dark secret of Camp Pinewood you uncovered tonight to break their hold and strike the final blow on the shoreline.',
  ],
  Black: [
    'As you push the boat off into the morning mist, the Killer’s hands erupt from the black water to drag someone overboard.',
    'Staying behind on the collapsing pier to cut the mooring line so the others can drift out of reach.',
    'Throwing yourself between the Killer’s machete and the last survivor at the cabin threshold.',
  ],
};
