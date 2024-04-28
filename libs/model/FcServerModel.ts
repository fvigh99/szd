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
  machineId?: number;
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
  userId: number;
  day?: number;
  start?: number;
  end?: number;
  type?: string;
  capacity?: number;
  inactive?: boolean;
}

export interface UserInTraining extends EntityWithId {
  userId?: number;
  scheduleId?: number;
}

export interface PersonalGoal extends EntityWithId {
  userId?: number;
}

export interface Exercise extends EntityWithId {
  machineId?: number;
  userId?: number;
  weight?: number;
  count?: number;
  intensity?: number;
  duration?: number;
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
  userId?: number;
  achievementId?: number;
  date?: Date;
}

export interface GroupExercise extends EntityWithId {
  type?: string;
  duration?: number;
  trainer?: User;
}
