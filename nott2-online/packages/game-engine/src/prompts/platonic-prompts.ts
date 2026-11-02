/**
 * @nott2/game-engine — Platonic Card Prompts
 *
 * The universal "Platonic Ideal" of each of the 54 horror beats.
 * Every card provides:
 *   - activePlayer: The Protagonist/Director hook — visceral, relational,
 *     and ending with an actionable challenge that leads into the d13 roll.
 *   - cameraCrew:   The Table's conversational entry point — a specific question
 *     or sensory angle for the other players to immediately jump in with.
 */

import type { Suit, JokerColor } from '../types';

export interface TwoPartPrompt {
  activePlayer: string;
  cameraCrew: string;
}

export interface FaceCardTwoPartPrompt {
  firstTime: TwoPartPrompt;
  recurring: TwoPartPrompt;
}

export type PlatonicCardPrompt = TwoPartPrompt | FaceCardTwoPartPrompt;

export const FACE_CARD_PREFIX =
  'The Killer is here. How do they corner you, and what makes them look unstoppable?';

export const PLATONIC_SUIT_PROMPTS: Record<Suit, Record<string, PlatonicCardPrompt>> = {
  Spades: {
    '1': {
      activePlayer:
        'ESTABLISHING SHOT — We see you handling a demanding physical task with effortless confidence before the night goes wrong. What are you doing, and why couldn’t you stay away tonight?',
      cameraCrew:
        'Who else is in the frame watching them, and what detail of their body language hints at the trouble to come?',
    },
    '2': {
      activePlayer:
        'A heavy barrier slams shut behind you, cutting you off from the safety of the group. How are you trying to force it open before whatever is in here with you makes its move?',
      cameraCrew:
        'Who is trapped on the other side of that barrier, and what sound do they hear through it?',
    },
    '3': {
      activePlayer:
        'The only way forward is choked with heavy wreckage—too massive for one person to shift safely, yet you have no time to wait. How do you throw your weight against it to clear a path?',
      cameraCrew:
        'Why is the rest of the group unable to reach them in time, and what is shifting dangerously inside the debris?',
    },
    '4': {
      activePlayer:
        'To reach the others or escape, you have to force yourself through a suffocatingly tight gap. What jagged edge tears at you in the dark, and how do you haul yourself through before it pins you?',
      cameraCrew:
        'What claustrophobic sound echoes out of that crawlspace, and who is waiting at the other end?',
    },
    '5': {
      activePlayer:
        'Part of the structure gives way with a deafening crack, threatening to bury the route between you and the others. How do you dive or brace against the collapse before the dust settles?',
      cameraCrew:
        'What vital escape route or piece of shelter is now gone forever, and who gets showered in splinters or dust?',
    },
    '6': {
      activePlayer:
        'Something cold and Vice-like snatches your ankle from the shadows below. How do you wrench yourself free, and what bruising mark does it leave on your skin?',
      cameraCrew:
        'What did they kick loose in the struggle, and what sound retreats into the dark afterward?',
    },
    '7': {
      activePlayer:
        'A sudden violent impact hurls you into the wall, knocking the wind out of your lungs. What shatters around you, and how do you scramble back to your feet before the threat closes in?',
      cameraCrew:
        'Who hears the crash from the next space over, and what broken object now litters the floor between them?',
    },
    '8': {
      activePlayer:
        'A cruel physical trap snaps shut the moment you step forward. What immediate, searing pain hits you, and how are you trying to pry yourself out before you bleed out or draw the Killer?',
      cameraCrew:
        'What telltale sign shows this trap was set deliberately for the group, and who sees the blood first?',
    },
    '9': {
      activePlayer:
        'Crushing weight drops onto you, pinning your chest and stealing your breath while footsteps approach. How do you summon the sheer brute force to heave it off before it’s too late?',
      cameraCrew:
        'Why can’t anyone else lift it for them right now, and what is creeping closer while they struggle?',
    },
    '10': {
      activePlayer:
        'The environment itself turns into a death trap—fire, flooding water, shattered glass, or collapsing machinery. How is this place trying to kill you right now, and how do you fight your way out?',
      cameraCrew:
        'Who is screaming your name from the edge of the hazard, and why can’t they step in without dying too?',
    },
    '11': {
      firstTime: {
        activePlayer:
          'What is the first terrifying thing you notice about their silhouette—and how do you use sheer physical desperation to break out of their reach?',
        cameraCrew:
          'How does the light frame the Killer’s bulk, and who freezes in the background watching this unfold?',
      },
      recurring: {
        activePlayer:
          'How does that unmistakable silhouette loom over you right now, and how do you physically clash with or outmuscle their ambush?',
        cameraCrew:
          'What part of the surroundings does the Killer effortlessly smash through to reach them?',
      },
    },
    '12': {
      firstTime: {
        activePlayer:
          'What brutal weapon are they dragging or hefting—and how do you keep it from coming down on you as you fight for an opening?',
        cameraCrew:
          'What awful sound does that weapon make against the floor or walls before they swing?',
      },
      recurring: {
        activePlayer:
          'How do they use that weapon to cut off your escape, and what desperate physical gamble do you take to get past it?',
        cameraCrew:
          'Whose blood or trophy is already staining that weapon when the light catches it?',
      },
    },
    '13': {
      firstTime: {
        activePlayer:
          'What horrific wound should have killed them, but didn’t—and how do you survive a direct collision with something that refuses to die?',
        cameraCrew:
          'How does the Killer’s refusal to feel pain shatter the table’s last hope of fighting fair?',
      },
      recurring: {
        activePlayer:
          'How does that mortal wound look even more grotesque now, and how do you physically tear yourself out of their grip?',
        cameraCrew:
          'What sickening sound comes from that wound as the Killer bears down on them?',
      },
    },
  },

  Hearts: {
    '1': {
      activePlayer:
        'ESTABLISHING SHOT — We see you looking out for someone or tending to an emotional bond before the terror begins. Who are you caring for, and why did you come here tonight?',
      cameraCrew:
        'Which other character at the table relies on them most, and what quiet worry is already hanging in the air?',
    },
    '2': {
      activePlayer:
        'The lights gutter out and a shadow shifts where nothing should be standing. How do you steady your breathing and force yourself to check what’s lurking there so the group doesn’t panic?',
      cameraCrew:
        'Whose silhouette did that shadow briefly mimic, and why does the silence feel so heavy?',
    },
    '3': {
      activePlayer:
        'Through the dark, you hear a familiar voice calling out—someone who cannot possibly be here. Why does that voice cut straight to your heart, and how do you resist its pull?',
      cameraCrew:
        'What phrase is the voice repeating, and who else at the table catches the tail end of it?',
    },
    '4': {
      activePlayer:
        'You stumble across a personal keepsake belonging to someone who was taken—or someone sitting at this table. Why does finding it here turn your stomach, and how do you hold yourself together?',
      cameraCrew:
        'What has been done to the item to turn it into a warning, and whose eyes do you immediately look for?',
    },
    '5': {
      activePlayer:
        'The prickling certainty of being watched freezes the sweat on your neck. Where is that unseen gaze coming from, and how do you keep your nerve while leading the others out of its line of sight?',
      cameraCrew:
        'What tiny sign—a parted curtain, a breath on glass, a snapping twig—proves they aren’t imagining it?',
    },
    '6': {
      activePlayer:
        'For a single heartbeat, you realize the others aren’t right behind you anymore—and something whispers your name from arm’s reach. How do you fight off the rising hysteria and find your way back?',
      cameraCrew:
        'How did the group lose track of them so easily, and what intimate secret did that whisper hint at?',
    },
    '7': {
      activePlayer:
        'You witness something that violates all sense—something that makes you question your own eyes. How do you anchor yourself to reality and convince the others that the danger is real?',
      cameraCrew:
        'Why does the scene look completely ordinary a second later when someone else turns to look?',
    },
    '8': {
      activePlayer:
        'One of the other survivors is acting wrong—pale, evasive, or staring where they shouldn’t. Why does a sudden spike of paranoia make you fear them, and how do you confront or steady them?',
      cameraCrew:
        'Which character is it, and what innocent—or guilty—detail makes them look so suspicious right now?',
    },
    '9': {
      activePlayer:
        'Something in this room triggers a paralyzing memory you’ve tried to bury. What old wound resurfaces at the worst possible second, and how do you claw your focus back to the present?',
      cameraCrew:
        'Who at the table already knows about their past, and what approaching danger demands they snap out of it now?',
    },
    '10': {
      activePlayer:
        'Even with others nearby, a crushing wave of dread tells you that no one can save you now. Why do you feel utterly forsaken, and how do you muster the will to keep moving anyway?',
      cameraCrew:
        'What barrier—emotional or physical—keeps the rest of the table from comforting or reaching them in time?',
    },
    '11': {
      firstTime: {
        activePlayer:
          'What is deeply wrong with their face or mask—and how do you break the paralysis of looking into it long enough to run?',
        cameraCrew:
          'What unsettling detail about that mask or face feels personal to the survivors?',
      },
      recurring: {
        activePlayer:
          'How does that face stare directly through you right now, and how do you refuse to let terror root you to the floor?',
        cameraCrew:
          'What has changed on the Killer’s face or mask since the first time you saw them?',
      },
    },
    '12': {
      firstTime: {
        activePlayer:
          'What sound do they make that doesn’t belong in a human throat—and how do you keep from screaming when it echoes right beside you?',
        cameraCrew:
          'How does that sound vibrate through the room, and what does it drown out?',
      },
      recurring: {
        activePlayer:
          'How unbearably close is that sound now, and how do you steel your nerves to slip out of the dark before they strike?',
        cameraCrew:
          'Why does the sound seem to come from two directions at once?',
      },
    },
    '13': {
      firstTime: {
        activePlayer:
          'What part of their body is moving wrong—and how do you overcome the revulsion to tear yourself away from their reach?',
        cameraCrew:
          'What unnatural rhythm or twitch makes watching them move feel like a nightmare?',
      },
      recurring: {
        activePlayer:
          'How does their body twist or snap as they lunge for you, and how do you keep your head when sanity is slipping?',
        cameraCrew:
          'What horrible detail shows they are pushing their own body past human limits just to catch you?',
      },
    },
  },

  Clubs: {
    '1': {
      activePlayer:
        'ESTABLISHING SHOT — We see your sharp mind at work—checking an exit, a piece of gear, or an odd detail everyone else missed. What are you examining, and what brought you here tonight?',
      cameraCrew:
        'Who at the table brushes off their caution as overthinking, and what small clue is already hiding in plain sight?',
    },
    '2': {
      activePlayer:
        'You uncover a hastily scrawled message or record left behind. What cryptic warning does it contain, and how do you piece together what it means before the group walks into a trap?',
      cameraCrew:
        'Whose handwriting or voice is it, and why was the message left unfinished?',
    },
    '3': {
      activePlayer:
        'A critical piece of equipment—a radio, fuse box, vehicle, or lock—is dead when you need it most. What crucial component was ripped out or broken, and how do you jury-rig a bypass under pressure?',
      cameraCrew:
        'Who is keeping watch while they work, and what sign proves this wasn’t an accident?',
    },
    '4': {
      activePlayer:
        'You recognize a recurring mark, trophy, or pattern etched into the scene. What dark history does it point to, and how do you use that knowledge to guide the others away from danger?',
      cameraCrew:
        'Where else have you seen this symbol tonight without realizing what it meant until now?',
    },
    '5': {
      activePlayer:
        'You find a layout, map, or schedule marked in fresh blood. Which location is circled, and how do you chart a safe route when the Killer clearly knows the terrain better than you?',
      cameraCrew:
        'Why were you all headed toward that exact spot, and what else is crossed out on the page?',
    },
    '6': {
      activePlayer:
        'Halfway through the group’s plan, the cold truth hits you: you missed a fatal detail. What is the flaw in your escape plan, and how do you scramble to correct it in real time?',
      cameraCrew:
        'Who had staked their safety on that plan working, and how close are they to the point of no return?',
    },
    '7': {
      activePlayer:
        'You find a body—staged or hidden where you were meant to find it. What forensic detail reveals how they died, and how do you search the scene for something useful before the Killer returns?',
      cameraCrew:
        'Who was this victim to the group, and what detail suggests the death happened mere minutes ago?',
    },
    '8': {
      activePlayer:
        'A deliberate mechanism, cipher, or sadistic snare blocks the way forward. What terrible price or risk does solving it demand, and how do you work through it with shaking hands?',
      cameraCrew:
        'What ticking clock—footsteps, rising smoke, a dying light—means they only get one shot at this?',
    },
    '9': {
      activePlayer:
        'You connect the dots and uncover a chilling truth about the Killer’s motive or nature. Why does knowing the truth make your situation even worse, and how do you act on it right now?',
      cameraCrew:
        'How does this revelation implicate someone’s past or the very reason you all came here tonight?',
    },
    '10': {
      activePlayer:
        'The whole picture snaps into focus—and you realize the exits were never meant to work. Why is conventional escape impossible, and what desperate counter-plan do you improvise on the spot?',
      cameraCrew:
        'How do the other characters react when they see the realization dawn on the Active Player’s face?',
    },
    '11': {
      firstTime: {
        activePlayer:
          'What are they wearing that looks deeply out of place—and what split-second deduction helps you anticipate their strike?',
        cameraCrew:
          'Where did that piece of clothing or gear come from, and whose memory does it trigger?',
      },
      recurring: {
        activePlayer:
          'How is that clothing stained or torn now, and how do you read their movements to stay one step ahead?',
        cameraCrew:
          'What new trophy or tear on their outfit tells you where they’ve just been?',
      },
    },
    '12': {
      firstTime: {
        activePlayer:
          'How did they know the exact spot where you were hiding—and how do you outthink a hunter who already knows your habits?',
        cameraCrew:
          'What subtle trail or tell did the group unknowingly leave behind?',
      },
      recurring: {
        activePlayer:
          'What gave your position away this time, and how do you turn the environment into a distraction to slip away?',
        cameraCrew:
          'How does the Killer cut off the obvious bolt-hole before the Active Player even moves?',
      },
    },
    '13': {
      firstTime: {
        activePlayer:
          'They speak—or leave an unmistakable message. What does it reveal about your secrets, and how do you break through the shock to escape?',
        cameraCrew:
          'Why could only someone who knows the group intimately have known that detail?',
      },
      recurring: {
        activePlayer:
          'Why does hearing that voice or signal threaten to freeze your mind, and how do you force logic to override terror?',
        cameraCrew:
          'What promise or threat does that voice make to the rest of the survivors listening in?',
      },
    },
  },

  Diamonds: {
    '1': {
      activePlayer:
        'ESTABLISHING SHOT — We see you holding court, bending a rule, or charming your way through a moment before the blood starts flowing. What are you doing, and why are you really here tonight?',
      cameraCrew:
        'Who at the table is rolling their eyes—or secretly drawn in—by their antics?',
    },
    '2': {
      activePlayer:
        'In the tense quiet, your foot catches and something crashes WAY too loudly in the dark. What made the racket, and how do you scramble to silence it or slip away before it draws attention?',
      cameraCrew:
        'Who was right next to them trying to stay dead silent, and how does the noise echo through the space?',
    },
    '3': {
      activePlayer:
        'At the worst possible moment, a vital item—keys, a light, a weapon, a bandages roll—slips from your fingers. Where does it fall, and how do you snake your hand in to retrieve it?',
      cameraCrew:
        'Why is reaching into that spot repulsive or dangerous, and who is counting on them not to lose it?',
    },
    '4': {
      activePlayer:
        'Under the strain, you blurt out the worst possible thing—an accusation, a secret, or a cruel truth. Who looks at you with sudden distrust, and how do you keep the group from fracturing right here?',
      cameraCrew:
        'Why did that remark hit a raw nerve for another character at the table?',
    },
    '5': {
      activePlayer:
        'For one fatal second, you freeze or second-guess yourself while a window of safety starts closing. What opportunity is slipping away, and how do you lunge to catch it before it’s gone?',
      cameraCrew:
        'What split-second distraction made them hesitate, and who yells at them to move?',
    },
    '6': {
      activePlayer:
        'Your slick hands slip in the dark and trigger something you never meant to touch. What alarm, light, or mechanism did you just set off, and how do you shut it down or dodge the fallout?',
      cameraCrew:
        'How does the sudden flash or noise expose the group’s position to the night outside?',
    },
    '7': {
      activePlayer:
        'You are trying to move like a ghost just paces away from danger, when something threatens to betray you. What nearly gives you away, and how do you control your body to stay undetected?',
      cameraCrew:
        'How close is the threat passing by, and who is holding their breath watching you from cover?',
    },
    '8': {
      activePlayer:
        'Your pride, temper, or recklessness pushes you one step too far into the danger zone. What obvious warning did you brush past, and how do you finesse your way out of the corner you walked into?',
      cameraCrew:
        'Who warned them not to do it ten seconds ago, and what closes in behind them now?',
    },
    '9': {
      activePlayer:
        'You make a split-second move to help or shield someone else, only for it to backfire horribly. How did your intervention tangle the situation, and how do you pull both of you out of the fire?',
      cameraCrew:
        'Which other survivor is caught in the middle of this with them, and what is about to give way?',
    },
    '10': {
      activePlayer:
        'A catastrophic miscalculation puts blood in the water—someone is about to pay the price for your mistake. How did you misplay your hand, and what desperate stunt do you pull to take the heat back onto yourself?',
      cameraCrew:
        'Who was left exposed by that mistake, and how close is the blade to finding them?',
    },
    '11': {
      firstTime: {
        activePlayer:
          'How do they move with such impossible, predatory silence—and how do you twist out of the way when they materialize beside you?',
        cameraCrew:
          'What tiny shift in the air or floorboard was the only warning before the strike?',
      },
      recurring: {
        activePlayer:
          'Why didn’t you hear them approach this time, and how do you rely on pure reflex to slip through their fingers?',
        cameraCrew:
          'How did the Killer use the group’s own noise or commotion to mask their approach?',
      },
    },
    '12': {
      firstTime: {
        activePlayer:
          'They are toying with you like a cat with a cornered bird. What do they do to show they’re in complete control, and how do you shatter their poise long enough to bolt?',
        cameraCrew:
          'What cruel gesture or tilt of the head shows the Killer is savoring this?',
      },
      recurring: {
        activePlayer:
          'How do they try to humiliate or bait you before striking, and what reckless feint do you use to break their rhythm?',
        cameraCrew:
          'How does the Killer turn the Active Player’s own signature trick or bravado against them?',
      },
    },
    '13': {
      firstTime: {
        activePlayer:
          'They appear somewhere they couldn’t possibly have reached ahead of you. How did they cut you off, and how do you thread the needle past them when every exit feels rigged?',
        cameraCrew:
          'What shortcut, crawlspace, or staged ambush proves they knew every move you’d make?',
      },
      recurring: {
        activePlayer:
          'Why does it feel like there is nowhere left to run, and what impossible gap do you dive through to survive one more scene?',
        cameraCrew:
          'What happens to the room behind them the instant they make their break for it?',
      },
    },
  },
};

export const PLATONIC_JOKER_PROMPTS: Record<JokerColor, TwoPartPrompt> = {
  Red: {
    activePlayer:
      'THE FINAL TEST — The Killer has you dead to rights as the first grey light of dawn bleeds into the sky. There are no tricks left. How do you end this nightmare once and for all?',
    cameraCrew:
      'How do the scars, losses, and discovered Weaknesses of the night converge in this final frame?',
  },
  Black: {
    activePlayer:
      'THE TWIST — Just when you thought it was over, the nightmare lunges back for one last, vicious reprise. What desperate sacrifice do you make right now to keep the survivors breathing?',
    cameraCrew:
      'What false sense of safety just shattered, and where did the Killer erupt from?',
  },
};
