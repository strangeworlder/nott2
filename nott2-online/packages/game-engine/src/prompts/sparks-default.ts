/**
 * @nott2/game-engine — Default Playset ("Generic Slasher") Card Sparks
 *
 * Concrete, practical slasher set-pieces that ground the Platonic card prompts
 * in a classic suburban / isolated-house / late-night horror movie.
 */

import type { Suit, JokerColor } from '../types';

export type CardSparksMap = Record<Suit, Record<string, readonly [string, string, string]>>;
export type JokerSparksMap = Record<JokerColor, readonly [string, string, string]>;

export const DEFAULT_CARD_SPARKS: CardSparksMap = {
  Spades: {
    '1': [
      'Splitting firewood or hauling a heavy generator out back while everyone else is still laughing inside.',
      'Shoving a stalled pickup truck out of a muddy ditch with raw shoulder strength.',
      'Fixing a jammed storm shutter on the upper porch before the wind tears it off its hinges.',
    ],
    '2': [
      'A heavy steel cellar door drops and latches from above while the single bulb overhead begins to swing.',
      'A rusted fire door in the back corridor jams in its warped frame, smelling of old motor oil and damp concrete.',
      'The heavy oak door to the basement utility room slams shut—and the brass deadbolt slides home from the outside.',
    ],
    '3': [
      'A tall metal shelving unit loaded with paint cans and rusted tools has been toppled across the narrow stairwell.',
      'The storm-felled trunk of a dead oak has smashed through the sunroom roof, pinning the sliding glass door shut.',
      'An overturned vending machine and a tangle of chained furniture block the only corridor to the front lobby.',
    ],
    '4': [
      'A narrow laundry chute or air duct lined with jagged sheet-metal screws that catch at your ribs.',
      'A busted basement window frame still bristling with teeth of frosted glass and rusted chicken wire.',
      'The crawlspace beneath the floorboards where splintered joists and exposed nails scrape your back raw.',
    ],
    '5': [
      'The rotted wooden staircase groans and drops three feet into the crawlspace as you hit the middle step.',
      'A section of waterlogged ceiling plaster and heavy beams crashes down across the hallway behind you.',
      'The old balcony railing splinters outward over the concrete driveway just as you grab it for balance.',
    ],
    '6': [
      'A gloved hand shoots out from beneath the gap of the staircase risers, fingers digging into your Achilles tendon.',
      'A loop of greased snare wire hidden in the tall grass cinches tight around your boot and yanks you off your feet.',
      'Something submerged in the flooded basement water wraps cold, iron-hard fingers around your calf.',
    ],
    '7': [
      'You are slammed into the bathroom vanity; the cracked mirror rains silver shards across the tile.',
      'You hit the trophy display case or china cabinet hard enough to bury yourself in splintered wood and glass.',
      'You are hurled against the cinderblock boiler room wall, snapping a hot-water pipe that hisses steam into the dark.',
    ],
    '8': [
      'A rusted bear trap or industrial rat-snare hidden under a throw rug clamps onto your boot.',
      'A rigged tripwire at shin height pulls a heavy iron pipe or cleaver swinging down from the doorframe.',
      'A floorboards plank gives way over a pit of upturned nails and broken bottles.',
    ],
    '9': [
      'A heavy cast-iron radiator or gun safe has been tipped over, pinning your legs to the soaked carpet.',
      'A collapsed garage beam and a stack of winter tires trap you flat against the oil-stained concrete.',
      'A heavy oak wardrobe lies face-down across your shoulders while boots thud slowly down the hall.',
    ],
    '10': [
      'A ruptured gas line catches a spark, sending a sheet of orange flame licking across the ceiling.',
      'Freezing black water is pouring through the basement window while a live frayed extension cord arcs in the foam.',
      'Thick, choking exhaust from a rigged engine fills the locked garage, turning every breath into lead.',
    ],
    '11': [
      'They stand a head taller than the doorframe, shoulders broad and motionless against the high-beams of a dead car.',
      'Lightning flashes through the hallway window, silhouetting a hulking figure in oil-stained work coveralls.',
      'At the top of the stairs, their shadow stretches down the wallpaper—chest heaving with slow, mechanical calm.',
    ],
    '12': [
      'A notched splitting maul dragged edge-down across the linoleum, leaving a white scar in the floor.',
      'A length of rusted tow-chain wrapped around one fist, ending in a meat hook that clinks with every step.',
      'A heavy two-handed pruning saw, its teeth clogged with dark wool and fresh splinters.',
    ],
    '13': [
      'A kitchen knife is still buried to the hilt in their collarbone—and they don’t even glance down at it.',
      'One side of their skull is scorched and bleeding from an earlier blow, yet their stride never wavers.',
      'A jagged shard of glass protrudes from their forearm, dripping steadily onto the floorboards as they reach for you.',
    ],
  },

  Hearts: {
    '1': [
      'Checking on a nervous friend who’s been quiet all evening, pressing a warm mug into their shaking hands.',
      'Bandaging a minor scrape or fixing someone’s collar while promising them tonight is going to be fine.',
      'Holding onto a worn keepsake from someone you lost, trying to be the steady anchor for the whole group.',
    ],
    '2': [
      'The hallway sconce sputters out, and the coat rack at the end of the corridor seems to turn its head.',
      'The refrigerator hum dies; in the sudden dark, a tall shadow detaches itself from the pantry doorway.',
      'A flashlight beam sweeps across the wallpaper and catches a second silhouette trailing half a step behind yours.',
    ],
    '3': [
      'Someone calls your childhood nickname from the bottom of the cellar stairs in a voice that sounds just like your mother’s.',
      'Over the crackle of an unplugged intercom, a friend who left an hour ago whispers, "Why did you lock me out?"',
      'From the dark outside the screen door, a familiar trembling voice begs you to unhook the latch.',
    ],
    '4': [
      'A cracked phone screen or locket belonging to the first victim, laid neatly in the center of the kitchen table.',
      'Someone’s varsity jacket or favorite scarf, soaked dark at the collar and hung carefully on the inside of the closet door.',
      'A set of car keys on a familiar keychain, dropped into a sink full of pink, rusty water.',
    ],
    '5': [
      'Through the frosted glass of the bathroom window, two unblinking eyes catch the streetlamp glow.',
      'The attic hatch directly above your head is slid open just two inches, a strip of pitch black staring down.',
      'In the reflection of the dark television screen, someone is standing behind the sofa watching you breathe.',
    ],
    '6': [
      'You turn the corner expecting to see the others, only to find an empty hallway—and warm breath against your ear.',
      'A closet door clicks ajar beside you, and a raspy voice murmurs the exact lie you told before coming here.',
      'The basement door shuts between you and the group, and something in the coal bin whispers your name.',
    ],
    '7': [
      'The family portraits along the staircase all have their eyes scratched out—except when the others look, they seem fine.',
      'Blood drips slowly from the ceiling fixture onto your hand, but when you wipe it away, your palm is bone-dry.',
      'You see your own reflection in the dark window glass—and the reflection is standing still while you move.',
    ],
    '8': [
      'They’re clutching something behind their back and their knuckles are white, refusing to say where they were for the last five minutes.',
      'There’s a fresh smear of mud and blood on their cuff that wasn’t there a moment ago, and their smile doesn’t reach their eyes.',
      'They keep glancing toward the locked back door as if waiting for someone they aren’t telling you about.',
    ],
    '9': [
      'The smell of copper and wet wool snaps you back to the night you swore you’d never talk about again.',
      'A siren wailing in the distance freezes your legs, replaying the accident that broke this group apart last year.',
      'Seeing someone cornered in the dark brings back the exact moment you failed to save someone who trusted you.',
    ],
    '10': [
      'Through the window, you can see the others arguing in the next room—too far and too distracted to hear you pounding on the glass.',
      'Every phone in the house is dead, the road is empty for miles, and the realization sinks in that no cavalry is coming.',
      'You scream for help, and the only answer is the wind rattling the deadbolts.',
    ],
    '11': [
      'A pale, featureless plastic mask warped by heat so the eyeholes droop in a permanent, weeping sneer.',
      'A sack of coarse burlap stitched shut with baling twine, wet and dark around the mouth.',
      'No mask at all—just a slack, expressionless face whose eyes never blink even when glass shatters.',
    ],
    '12': [
      'A wet, rattling intake of breath like air being drawn through a punctured lung.',
      'A low, rhythmic clicking in the back of the throat that mimics the ticking of a grandfather clock.',
      'A hollow, distorted hum that sounds like a lullaby played backward on a warped tape.',
    ],
    '13': [
      'Their head sits tilted at a thirty-degree angle, neck stiff, while their shoulders move with jerky precision.',
      'One leg drags behind them in a dead arc, yet they close the distance down the hallway faster than you can run.',
      'Their fingers flex and snap in unison, double-jointed knuckles popping as they reach for the doorknob.',
    ],
  },

  Clubs: {
    '1': [
      'Testing the landline and noticing the dial tone cuts out with a faint, rhythmic click on the line.',
      'Checking the back windows and realizing the latches were unscrewed from the inside earlier today.',
      'Looking over an old newspaper clipping or local map you brought along because the story never added up.',
    ],
    '2': [
      'Scratched into the condensation on the mirror: "DON’T GO DOWNSTAIRS — THEY’RE ALREADY INSIDE."',
      'A torn page from a spiral notebook stuffed into a coat pocket: "Count the keys. One is missing."',
      'Written in grease pencil across the fuse box door: "IF THE PORCH LIGHT DIES, RUN."',
    ],
    '3': [
      'The main breaker panel has had its ceramic fuses smashed with a hammer; only a spare copper wire can bridge the circuit.',
      'The distributor cap has been yanked from the car engine and tossed into the thorny brush beside the driveway.',
      'The landline junction box in the mudroom has been sliced cleanly through with shears, leaving bare color-coded wires.',
    ],
    '4': [
      'Three parallel notches carved into every doorframe—the exact trademark of a string of unsolved killings from ten years ago.',
      'A crude spiral drawn in soot on the chimney breast, matching the graffiti from the abandoned mill outside town.',
      'A row of rusted keys hung by twine in the shed, each tagged with a date and a pair of initials.',
    ],
    '5': [
      'A town blueprint spread on the workbench with the storm drain beneath this very house circled in tacky red.',
      'A hand-drawn floorplan of the upstairs hallway showing a hidden crawlspace behind the master bedroom closet.',
      'A crumpled local map where the main bridge is crossed out and the old logging road is marked with a skull.',
    ],
    '6': [
      'The spare key you were all counting on fits the deadbolt—but someone has welded the exterior storm grate shut.',
      'The getaway car in the driveway has all four tires slashed down to the rims.',
      'The room you just barricaded yourselves into has a dumbwaiter shaft big enough for a grown person to climb through.',
    ],
    '7': [
      'A neighbor or delivery driver slumped in the pantry, their wristwatch stopped at 9:13 and their keys gone.',
      'A body arranged in a rocking chair facing the door, holding a flashlight pointed directly at where you’re standing.',
      'Drag marks of dark blood leading to the utility closet, where the victim’s fingernails are still wedged in the jamb.',
    ],
    '8': [
      'A heavy padlock on the gun cabinet whose combination is etched at the bottom of a jar filled with cloudy, foul liquid.',
      'A jammed security shutter that can only be released by reaching an arm inside the grinding gear housing.',
      'Two crossed ignition wires beneath the dashboard—one sparks the starter, the other triggers the horn.',
    ],
    '9': [
      'A box of old polaroids in the attic reveals the Killer lived in this house—and never truly left.',
      'A ledger of names shows this wasn’t random: every person here tonight is tied to the same buried cover-up.',
      'You find a second identical mask and bloodstained coat—meaning the Killer has either a partner or a staging ground right here.',
    ],
    '10': [
      'Every window on the ground floor is barred from the outside, and the smoke creeping under the door means they’re smoking you out.',
      'The bridge is out, the radio is a dummy unit, and the footprints in the mud lead in a circle right back to the house.',
      'The timers on the floodlights were set hours ago—you aren’t being hunted in the wild; you’re in a kill-box.',
    ],
    '11': [
      'A faded high-school letterman jacket two sizes too small, its sleeves split at the seams.',
      'A heavy rubber butcher’s apron worn over Sunday dress clothes, stiff with dried salt and blood.',
      'A dead police officer’s utility belt strapped over a tattered raincoat, the radio still squawking static.',
    ],
    '12': [
      'Your wet footprints on the hardwood floor led straight to the closet door—and they’re looking right at the floor.',
      'A draft from the broken flue made the curtain billow just as they walked past.',
      'They systematically checked every blind spot in the room in the exact order you planned to use them.',
    ],
    '13': [
      'They hold up a small cassette recorder that plays back your own voice from earlier tonight.',
      'In a low, gravel-scraped whisper, they repeat the exact promise you made when you thought you were safe.',
      'They tap a gloved finger against the glass and mouth the name of the person you care about most.',
    ],
  },

  Diamonds: {
    '1': [
      'Showing off a contraband bottle or picking a locked liquor cabinet while daring the others to join in.',
      'Cracking a dark joke to break the tension while secretly pocketing something you shouldn’t have.',
      'Doing a reckless balancing act on the porch rail to keep all eyes on you.',
    ],
    '2': [
      'Your elbow catches a brass coat stand, sending an avalanche of metal hangers and umbrellas clattering across the tile.',
      'You step backward onto a crate of empty glass bottles that shatters in the dead silence.',
      'Your knee slams into an old upright piano or grandfather clock, unleashing a discordant chime that rings through the house.',
    ],
    '3': [
      'The car keys slip from your sweaty palm and vanish through the iron grate of the basement floor drain.',
      'Your flashlight rolls off the workbench and drops into the pitch-black gap behind the furnace.',
      'The only roll of gauze or pocketknife tumbles down between the rotting boards of the porch steps.',
    ],
    '4': [
      'You snap and accuse another survivor of leading the group into a trap—and everyone suddenly remembers they had the map.',
      'You let slip that you knew this place was dangerous before tonight, and the room goes ice-cold.',
      'You blurt out that someone left the back door unlocked, turning every pair of eyes toward the person nearest it.',
    ],
    '5': [
      'The heavy security door is swinging shut on its hydraulic arm, and you freeze for a heartbeat before diving for the gap.',
      'A passing car’s headlights sweep the end of the driveway, already accelerating away into the fog.',
      'The elevator or dumbwaiter cables groan as the platform starts dropping without you.',
    ],
    '6': [
      'Your elbow hits a motion-sensor security floodlight AND a piercing garage alarm that deafens the yard.',
      'Your hand hits the garbage disposal or table saw switch, roaring to life in the quiet room.',
      'You accidentally knock a heavy shelf bar loose, dropping the rolling metal shutter over the doorway.',
    ],
    '7': [
      'Dust and insulation tickle your throat into a violent cough while boots pause on the floorboards two feet away.',
      'A loose floorboard beneath your heel lets out a slow, agonizing creak in the dark.',
      'Your watch or phone screen lights up with a low-battery chime inside the pitch-black closet.',
    ],
    '8': [
      'You stepped out into the open hallway to prove nobody was there—just as the door behind you clicked shut.',
      'You went back for a prized possession everyone told you to leave behind, and now shadows block the doorway.',
      'You taunted the dark to show you weren’t scared, and something in the shadows took you up on it.',
    ],
    '9': [
      'You yank a friend back from a doorway, accidentally pulling down a bookcase that traps both of you in the alcove.',
      'You throw something to distract the threat away from another survivor, only to knock out the only light source in the room.',
      'You slam and bolt the door to save the person beside you—locking the rest of the group on the wrong side.',
    ],
    '10': [
      'You led the group down what you swore was a shortcut, and it ends in a bricked-up basement wall with footsteps behind you.',
      'You panicked and shoved past someone on the narrow stairs, leaving them sprawled on the landing as the shadow rounds the corner.',
      'You pulled the wrong lever on the breaker box, plunging the survivor fighting for their life into total darkness.',
    ],
    '11': [
      'Their boots make zero sound on the broken glass covering the floor until their shadow falls across your shoulder.',
      'They slip out from behind the heavy drapes you walked past three seconds ago without stirring the fabric.',
      'The rain outside masks every footstep until cold steel touches the back of your collar.',
    ],
    '12': [
      'They slowly toss the keys you’ve been looking for onto the floor between their boots and wait for you to reach.',
      'They drag the flat of their blade along the wallpaper beside your face, herding you backward step by step.',
      'They deliberately leave the front door wide open behind them, daring you to try and sprint past their reach.',
    ],
    '13': [
      'You just watched them walk into the yard, yet when you yank open the upstairs bedroom door, they are already standing inside.',
      'They drop silently from the ceiling hatch directly in front of the exit you were sprinting toward.',
      'They step out of the basement stairwell you locked and barricaded five minutes ago.',
    ],
  },
};

export const DEFAULT_JOKER_SPARKS: JokerSparksMap = {
  Red: [
    'Luring the Killer onto the weakened floorboards over the roaring furnace and kicking the last support beam loose.',
    'Using the very weapon or weakness you uncovered tonight to pin them into the path of oncoming dawn headlights.',
    'Standing your ground at the threshold as the sun breaks over the trees, driving the final blow home with everything you have left.',
  ],
  Black: [
    'The Killer’s hand erupts through the windshield or floorboards for one last choke-hold just as you reach the exit.',
    'Slamming the fire door shut from the inside and holding the broken latch with your own body so the others can clear the threshold.',
    'Taking the blade meant for the last survivor beside you in order to knock the Killer back into the dark.',
  ],
};
