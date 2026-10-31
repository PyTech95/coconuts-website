import {
  CheckCircle2, Cpu, MapPin, Star, Sparkles, Leaf, ShieldCheck, Gem, PencilRuler, Smile, Users, Award, Clock,
  Palette, Globe, Trophy, Nut, Utensils, FlaskConical, Stamp, Snowflake, Heart, Gift, Crown, PartyPopper, Truck,
  Phone, Camera, Music, Flower2, Coffee, Zap, ThumbsUp, Package, Calendar, Shield, Medal, Sun, Droplets, Flame, CupSoda, Wine, GlassWater,
} from 'lucide-react';

export const ICONS = {
  Check: CheckCircle2, CheckCircle2, Cpu, MapPin, Star, Sparkles, Leaf, ShieldCheck, Gem, PencilRuler, Smile, Users,
  Award, Clock, Palette, Globe, Trophy, Nut, Utensils, FlaskConical, Stamp, Snowflake, Heart, Gift, Crown, PartyPopper,
  Truck, Phone, Camera, Music, Flower2, Coffee, Zap, ThumbsUp, Package, Calendar, Shield, Medal, Sun, Droplets, Flame, CupSoda, Wine, GlassWater,
};

export const ICON_NAMES = Object.keys(ICONS);

export const getIcon = (name, fallback = Star) => ICONS[name] || fallback;
