export interface EntityWithId {
  id?: number;
}

export interface User extends EntityWithId {
  firstname?: string;
  lastname?: string;
  username?: string;
  password?: string;
  email?: string;
  picture?: string;
  role?: string;
  pass?: Pass;
  crd?: Date;
}

export interface Achievement extends EntityWithId {
  name?: string;
  summary?: string;
  type?: string;
  eventCount?: number;
  machine?: Machine;
  weight?: number;
  repetitionCount?: number;
  intensity?: number;
  duration?: number;
  typeOfGroupTraining?: string;
  icon?: string;
}

export interface Machine extends EntityWithId {
  name?: string;
  summary?: string;
  picture?: string;
  type?: string;
}

export interface Schedule extends EntityWithId {
  trainer?: User;
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

export interface UserSessionObject {
  access_token?: string;
  user_object?: User;
  message?: string;
}

export interface FileUploadResult {
  statusCode?: number;
  data: string;
}

export interface Day {
  id?: number;
  name?: string;
}
