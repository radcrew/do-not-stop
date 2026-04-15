import lionImage from '../assets/images/pets/lion.png';
import catImage from '../assets/images/pets/cat.png';
import dinosaurImage from '../assets/images/pets/dinosaur.png';
import dogImage from '../assets/images/pets/dog.png';
import elephantImage from '../assets/images/pets/elephant.png';
import owlImage from '../assets/images/pets/owl.png';
import battleIcon from '../assets/images/icons/interaction/battle.png';
import breedIcon from '../assets/images/icons/interaction/breed.png';
import levelupIcon from '../assets/images/icons/interaction/levelup.png';
import tradingIcon from '../assets/images/icons/interaction/trading.png';

export type LandingFeatureCard = {
  title: string;
  text: string;
  icon?: string;
  iconImage?: string;
};

export type LandingFeaturedPet = {
  name: string;
  level: number;
  rarity: string;
  image: string;
};

export type LandingCommunityCard = {
  name: string;
  members: string;
  color: 'discord' | 'twitter' | 'telegram' | 'youtube';
  icon: string;
};

export const LANDING_FEATURE_CARDS: LandingFeatureCard[] = [
  { title: 'Breed Unique Pets', text: 'Combine rare DNA traits and hatch powerful new companions.', iconImage: breedIcon },
  { title: 'Epic Battles', text: 'Challenge rivals and climb the leaderboard with tactical fights.', iconImage: battleIcon },
  { title: 'Power Growth', text: 'Level up, optimize stats, and unlock advanced abilities.', iconImage: levelupIcon },
  { title: 'Trade & Earn', text: 'Collect, showcase, and trade your best CryptoPets.', iconImage: tradingIcon },
];

export const LANDING_FEATURED_PETS: LandingFeaturedPet[] = [
  { name: 'Golden Lion', level: 99, rarity: 'Legendary', image: lionImage },
  { name: 'Frost Dragon', level: 37, rarity: 'Epic', image: dinosaurImage },
  { name: 'Thunder Pup', level: 96, rarity: 'Rare', image: dogImage },
  { name: 'Crystal Trunk', level: 62, rarity: 'Epic', image: elephantImage },
  { name: 'Shadow Cat', level: 83, rarity: 'Rare', image: catImage },
  { name: 'Mystic Owl', level: 71, rarity: 'Legendary', image: owlImage },
];

export const LANDING_COMMUNITY_CARDS: LandingCommunityCard[] = [
  { name: 'Discord', members: '150k+ Members', color: 'discord', icon: '💬' },
  { name: 'Twitter', members: '250k+ Followers', color: 'twitter', icon: '🐦' },
  { name: 'Telegram', members: '120k+ Members', color: 'telegram', icon: '✈️' },
  { name: 'YouTube', members: '180k+ Members', color: 'youtube', icon: '▶️' },
];
