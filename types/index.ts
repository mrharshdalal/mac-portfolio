export type AppId =
  | "finder"
  | "terminal"
  | "safari"
  | "photos"
  | "notes"
  | "resume"
  | "projects"
  | "about"
  | "contact"
  | "music"
  | "settings"
  | "trash"
  | "sticky";

export type WallpaperId =
  | "grid"
  | "gradient"
  | "mountain"
  | "abstract"
  | "dark"
  | "dynamic";

export type ThemeMode = "light" | "dark" | "auto";

export type AccentColor =
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "graphite";

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  position: Position;
  size: Size;
  prevPosition?: Position;
  prevSize?: Size;
}

export interface DesktopIcon {
  id: string;
  appId: AppId;
  label: string;
  icon: string;
  gridX: number;
  gridY: number;
  /** Anchor from the right edge so icons stay on-screen across viewports */
  align?: "left" | "right";
  type: "folder" | "file" | "app" | "trash" | "sticky";
}

export interface DockItem {
  /** Unique dock slot key (multiple slots can open the same app) */
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  separatorAfter?: boolean;
}

export interface SettingsState {
  theme: ThemeMode;
  accent: AccentColor;
  wallpaper: WallpaperId;
  animations: boolean;
  sound: boolean;
  reduceMotion: boolean;
  transparency: boolean;
  fontSize: "small" | "medium" | "large";
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  year: string;
  role: string;
  link?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
  color?: string;
}

export interface TrashItem {
  id: string;
  name: string;
  type: "txt" | "img" | "pdf" | "link";
  subtitle?: string;
}

export interface FinderSection {
  id: string;
  label: string;
  icon: string;
  group: "favorites" | "projects";
}

export interface AppDefinition {
  id: AppId;
  title: string;
  icon: string;
  defaultSize: Size;
  defaultPosition: Position;
  minSize?: Size;
  resizable?: boolean;
}
