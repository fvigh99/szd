export interface EntityWithId {
  id?: number;
}

export interface User extends EntityWithId {
  firstname?: string;
  lastname?: string;
  username?: string;
  password?: string;
  email?: string;
  role?: string;
  pass?: Pass;
  crd?: Date;
}

export interface Achievement extends EntityWithId {
  name?: string;
  summary?: string;
  icon?: string;
  machine?: Machine;
  weight?: number;
  count?: number;
  intensity?: number;
  duration?: number;
}

export interface Machine extends EntityWithId {
  name?: string;
  summary?: string;
  picture?: string;
  type?: string;
}

export interface Schedule extends EntityWithId {
  user?: User;
  day?: number;
  start?: number;
  end?: number;
  type?: string;
  capacity?: number;
  inactive?: boolean;
}

export interface UserInTraining extends EntityWithId {
  user?: User;
  schedule?: Schedule;
}

export interface PersonalGoal extends EntityWithId {
  user?: User;
}

export interface Exercise extends EntityWithId {
  machine?: Machine;
  user?: User;
  weight?: number;
  count?: number;
  intensity?: number;
  duration?: number;
  date?: Date;
}

export interface Pass extends EntityWithId {
  sauna?: boolean;
  spinracing?: boolean;
  yoga?: boolean;
  pilates?: boolean;
  kickbox?: boolean;
  price?: number;
  dailyEntryCount?: number;
  entryPerWeek?: number;
  type?: string;
}

export interface EarnedAchievement extends EntityWithId {
  user?: User;
  achievement?: Achievement;
  date?: Date;
}

export interface GroupExercise extends EntityWithId {
  type?: string;
  duration?: number;
  trainer?: User;
}
